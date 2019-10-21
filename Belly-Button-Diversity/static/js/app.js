  
function buildMetadata(sample) {
  // Use `d3.json` to fetch the metadata for a sample
  var metadata = d3.select("#sample-metadata");
  var url = "/metadata/" + sample;
  // document.getElementById("#sample-metadata").innerHTML = "";
  d3.json(url).then(function(response) {
    console.log(response);
    metadata.html("");
    Object.entries(response).forEach(([key, value]) => metadata.append("p").text(`${key}: ${value}`));
  });
}
   

function buildCharts(sample) {

  var url2 = "/samples/" + sample;

  d3.json(url2).then(function(response) {
    console.log(response);

    // var total_length = length(response.sample_values);

    var sample_values2 = [];
    var otu_ids2 = [];
    var otu_labels2 = []; 

    for (var i = 1; i < 10; i++){
     sample_values2.push(response.sample_values[i]);
     otu_ids2.push(response.otu_ids[i]);
     otu_labels2.push(response.otu_labels[i]);
    }
  
 
    var trace1 = {
      values: sample_values2,
      labels: otu_ids2.map(String),
      hovertext: otu_labels2,
      type: 'pie'
    };

    var trace2 = {
      x: response.otu_ids,
      y: response.sample_values,
      mode: 'markers',
      marker: {
        size: response.sample_values
      },
    };

    var data1 = [trace1];
    var data2 = [trace2];

    var layout1 = {
      height: 400,
      width: 400,
    };

    var layout2 = {
      width: 1200,
      height: 500
    };
    
    var piepie = d3.select('#pie');

    var bubbly = d3.select('#bubble');

    Plotly.newPlot('pie', data1, layout1);
    Plotly.newPlot('bubble', data2, layout2);

  });
}
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

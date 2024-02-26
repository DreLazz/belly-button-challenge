let bellyURL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//  update based on the selected id (dataset)
function updateCharts(data, id) {
    
    let selected = data.samples.find(set => set.id == id);

    // bar chart updates
    let selectedSampleValues = selected.sample_values.slice(0,10).sort((a, b) => a-b);
    let selectedOtuId = selected.otu_ids.slice(0,10);
    let selectedOtuIdLabel = selectedOtuId.map(id => `OTU ${id}`);

    Plotly.restyle('bar', 'x', [selectedSampleValues]);
    Plotly.restyle('bar', 'y', [selectedOtuIdLabel]);

    // bubble chart updates
    let bubbleSampleValues = selected.sample_values;
    let bubbleOtuAll = selected.otu_ids;

    Plotly.restyle('bubble', 'x', [bubbleOtuAll]);
    Plotly.restyle('bubble', 'y', [bubbleSampleValues]);

    // update info
    updateDemo(data, id);
};

function updateDemo(data, id) {
    let metaData = data.metadata.find(x => x.id == id);
    let metaDatadiv = d3.select('#sample-metadata');
    
    metaDatadiv.html("");

    Object.entries(metaData).forEach(([key, value]) => {
        metaDatadiv.append('p').text(`${key}: ${value}`);
    });
}

// Load data 
d3.json(bellyURL).then(function(data) {
    let dropdownMenu = d3.select('#selDataset');
    data.samples.forEach(x => {
        dropdownMenu.append('option').text(x.id).property('value', x.id);
    });    
    
    // create variables 
    let dataSamples = data.samples;

    // chart x / y values 
    let sampleValues = dataSamples[0].sample_values;
    let sampleValuessorted = dataSamples[0].sample_values.slice(0,10).sort((a, b) => a - b);

    // chart x / y values
    let otuAll = dataSamples[0].otu_ids;
    let otuSliced = dataSamples[0].otu_ids.slice(0,10);
    let otuId = otuSliced.map(id => `OTU ${id}`);

    // Bar chart data / trace
    let barCharttrace = {
        y: otuId,
        x: sampleValuessorted,
        type: 'bar',
        orientation: 'h',
        marker: {
            color: '#ff69b4'
        }
    };
    let barChartdata = [barCharttrace]
    let barChartlayout = {
        title: 'Top 10 Bacteria By Subject',
        margin: {
            l: 75,
            r: 10,
            t: 30,
            b: 50
        }
    };
    // bubble chart trace
    let bubbleChartdata =[{
        x: otuAll,
        y: sampleValues,
        mode: 'markers',
        marker: {
            size: sampleValues,
            color: otuAll,
            colorscale: 'Bluered',

        } 
}];
    let bubbleChartlayout = {
        title: 'Bacteria By Sample',
        showlegend: false,
        height: 500,
        width: 1250,
        xaxis: {title: 'OTU ID'},
        yaxis: {title: 'Sample Values'}
    };
    // initial plotly load 
    Plotly.newPlot('bar', barChartdata, barChartlayout);
    Plotly.newPlot('bubble', bubbleChartdata, bubbleChartlayout);

    const initalDemo = data.metadata[0].id;
    updateDemo(data, initalDemo);
       
    // event listener for dropdown menu
    d3.selectAll("#selDataset").on("change", function (event) {
        const selectedID = event.target.value;
        updateCharts(data, selectedID);

});


});  
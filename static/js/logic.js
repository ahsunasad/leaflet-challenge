//'const url' will store the GeoJSON data URL
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// 'streets' will be used to define a Leaflet tile layer
let streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// 'myMap' creates a Leaflet map
var myMap = L.map("map", {
    center: [35.00, -100.00],
    zoom: 4,
    layers: [streets]
});


//'basemaps' defines the actual street maps
let baseMaps = {
    "streets": streets
};

//'earthquake_data' and 'tectonics' define their respective layergroups
let earthquake_data = new L.LayerGroup();
let tectonics = new L.LayerGroup();

//'overlays' joins the layergroups to overlays
let overlays = {
    "Earthquakes": earthquake_data,
    "Tectonic Plates": tectonics
};

//Control layer added
L.control.layers(baseMaps, overlays).addTo(myMap);

//functions below determine style, set radius and color based on magnitude and earthquale depth
function styleInfo(feature) {
    return {
        color: chooseColor(feature.geometry.coordinates[2]),
        radius: chooseRadius(feature.properties.mag), 
        fillColor: chooseColor(feature.geometry.coordinates[2]) 
    }
};

//'chooseColor' defibnes what color to set on the map
function chooseColor(depth) {
    if (depth <= 10) return "red";
    else if (depth > 10 & depth <= 25) return "orange";
    else if (depth > 25 & depth <= 40) return "yellow";
    else if (depth > 40 & depth <= 55) return "green";
    else if (depth > 55 & depth <= 70) return "blue";
    else return "purple";
};

//'chooseRadius' deifnes the radius based of earthquake magnitude
function chooseRadius(magnitude) {
    return magnitude*5;
};


//Use JSON to pull the actual data
d3.json(url).then(function (data) { 
    L.geoJson(data, {
        pointToLayer: function (feature, latlon) {  
            return L.circleMarker(latlon).bindPopup(feature.id); 
        },
        style: styleInfo 
    }).addTo(earthquake_data); 
    earthquake_data.addTo(myMap);

    //Draw white lines where tectonics are
    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (data) { //pulls tectonic data with d3.json
        L.geoJson(data, {
            color: "white",  
            weight: 5
        }).addTo(tectonics); 
        tectonics.addTo(myMap);
    });


});
//Legend is created below, with different colors corresponding to different earthquakee strenghts
var legend = L.control({ position: "bottomright" });
legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "legend");
       div.innerHTML += "<h4>Depth Color Legend</h4>";
       div.innerHTML += '<i style="background: red"></i><span>(Depth < 10)</span><br>';
       div.innerHTML += '<i style="background: orange"></i><span>(10 < Depth <= 25)</span><br>';
       div.innerHTML += '<i style="background: yellow"></i><span>(25 < Depth <= 40)</span><br>';
       div.innerHTML += '<i style="background: green"></i><span>(40 < Depth <= 55)</span><br>';
       div.innerHTML += '<i style="background: blue"></i><span>(55 < Depth <= 70)</span><br>';
       div.innerHTML += '<i style="background: purple"></i><span>(Depth > 70)</span><br>';
  
    return div;
  };
  legend.addTo(myMap);

//Use JSOn to collect necessary data
d3.json(url).then(function (data) {
    console.log(data);
    let features = data.features;
    console.log(features);
//coordinates for latitude [0], longitude[1], and earthquake depth [2]
    let results = features.filter(id => id.id == "nc73872510"); 
    let first_result = results[0];
    console.log(first_result);
    let geometry = first_result.geometry;
    console.log(geometry);
    let coordinates = geometry.coordinates;
    console.log(coordinates);
    console.log(coordinates[0]); 
    console.log(coordinates[1]); 
    console.log(coordinates[2]); 
    let magnitude = first_result.properties.mag;
    console.log(magnitude);
    
    //'depth' for earthqquake depth
    let depth = geometry.coordinates[2];
    console.log(depth);
    let id = first_result.id;
    console.log(id);

});
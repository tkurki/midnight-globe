// Initialize the Cesium Viewer
const viewer = new Cesium.Viewer('cesiumContainer', {
    baseLayerPicker: false,
    geocoder: false,
    animation: false,
    timeline: false,
    fullscreenButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    homeButton: false,
    infoBox: false,
    selectionIndicator: false,
    terrainProvider: new Cesium.EllipsoidTerrainProvider(),
    // Start with no imagery provider to avoid default Bing Maps behavior
    imageryProvider: false
});

// Explicitly add OpenStreetMap layer
viewer.imageryLayers.addImageryProvider(
    new Cesium.UrlTemplateImageryProvider({
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        credit: 'Map data © OpenStreetMap contributors'
    })
);

// Helsinki coordinates
const HELSINKI_LON = 24.9384;
const HELSINKI_LAT = 60.1699;
const VIEW_HEIGHT = 20000000; // 20,000 km viewing distance to see the whole globe nicely

function flyToHelsinki() {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(HELSINKI_LON, HELSINKI_LAT, VIEW_HEIGHT),
        orientation: {
            heading: 0.0,
            pitch: -Cesium.Math.PI_OVER_TWO, // Look directly down
            roll: 0.0
        },
        duration: 2 // Flight duration in seconds
    });
}

// Set initial view
viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(HELSINKI_LON, HELSINKI_LAT, VIEW_HEIGHT),
    orientation: {
        heading: 0.0,
        pitch: -Cesium.Math.PI_OVER_TWO,
        roll: 0.0
    }
});

// Add event listener to the reset button
document.getElementById('resetBtn').addEventListener('click', flyToHelsinki);

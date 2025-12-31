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

// --- Midnight Line Logic ---

function calculateMidnightLongitude() {
    const now = new Date();
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();
    const utcSeconds = now.getUTCSeconds();
    const utcDecimal = utcHours + utcMinutes / 60 + utcSeconds / 3600;

    // Calculate longitude where it is midnight
    // Sun is at (12 - UTC) * 15
    // Midnight is opposite: ((12 - UTC) * 15) + 180
    let lon = ((12 - utcDecimal) * 15) + 180;
    
    // Normalize to [-180, 180]
    while (lon > 180) lon -= 360;
    while (lon < -180) lon += 360;
    
    return lon;
}

// Create the midnight line entity
const midnightLine = viewer.entities.add({
    name: 'Astronomical Midnight',
    polyline: {
        // Use a CallbackProperty to update positions dynamically
        positions: new Cesium.CallbackProperty(function() {
            const lon = calculateMidnightLongitude();
            return Cesium.Cartesian3.fromDegreesArray([
                lon, 90,  // North Pole
                lon, -90  // South Pole
            ]);
        }, false),
        width: 5,
        material: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.BLACK
        })
    }
});

// Follow Midnight Logic
const followCheckbox = document.getElementById('followMidnight');

viewer.clock.onTick.addEventListener(function() {
    if (followCheckbox.checked) {
        const lon = calculateMidnightLongitude();
        
        // Smoothly move camera to the new longitude
        // We keep the current latitude and height
        const currentCameraPosition = viewer.camera.positionCartographic;
        
        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromRadians(
                Cesium.Math.toRadians(lon), 
                currentCameraPosition.latitude, 
                currentCameraPosition.height
            )
        });
    }
});


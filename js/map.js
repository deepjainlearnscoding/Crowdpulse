// js/map.js
// Modular Google Maps Initialization
window.StadiumMap = {
    map: null,
    centerLat: 23.1028, // Narendra Modi Stadium
    centerLng: 72.5975,

    initMap() {
        const mapOptions = {
            zoom: 17,
            center: { lat: this.centerLat, lng: this.centerLng },
            mapTypeId: 'satellite', // Base style before overlays 
            disableDefaultUI: true, // Keep it sleek and hackathon-like
            keyboardShortcuts: false,
            styles: [
                { elementType: "geometry", stylers: [{ color: "#050817" }] },
                { elementType: "labels.text.stroke", stylers: [{ color: "#050817" }] },
                { elementType: "labels.text.fill", stylers: [{ color: "#4f8ef7" }] },
                { featureType: "road", elementType: "geometry", stylers: [{ color: "#0d1526" }] },
                { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
                { featureType: "water", elementType: "geometry", stylers: [{ color: "#010314" }] },
                { featureType: "poi.sports_complex", elementType: "geometry.fill", stylers: [{ color: "#080c16" }] },
            ]
        };
        
        const mapElement = document.getElementById('map-canvas');
        if (mapElement) {
            this.map = new google.maps.Map(mapElement, mapOptions);
            
            // Dispatch event stating map is ready for heatmaps to attach to
            window.dispatchEvent(new Event('googleMapReady'));
        }
    }
};

// Global callback for Google Maps API script tag
function initGoogleMapAPI() {
    window.StadiumMap.initMap();
}

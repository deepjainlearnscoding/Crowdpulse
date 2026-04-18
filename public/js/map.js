// js/map.js
// Leaflet.js Map Initialization (Free, No API Key Required)
window.StadiumMap = {
    map: null,
    centerLat: 23.1028, // Narendra Modi Stadium
    centerLng: 72.5975,

    initMap() {
        const mapElement = document.getElementById('map-canvas');
        if (mapElement) {
            // Initialize Leaflet Map
            this.map = L.map('map-canvas', {
                zoomControl: false, // Cleaner UI
                attributionControl: false
            }).setView([this.centerLat, this.centerLng], 17);

            // Use CartoDB Dark Matter for that sleek dark StadiumIQ theme
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap &copy; CARTO',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(this.map);
            
            // Dispatch event stating map is ready for heatmaps to attach to
            window.dispatchEvent(new Event('leafletMapReady'));
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.StadiumMap.initMap();
});

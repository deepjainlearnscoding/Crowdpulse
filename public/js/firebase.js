// js/firebase.js
// Simulates a Firebase Realtime Database Stream
class MockFirebaseDB {
    constructor(centerLat, centerLng) {
        this.centerLat = centerLat;
        this.centerLng = centerLng;
        this.listeners = [];
        this.pointsCount = 600; // Total simulated people/points
        this.interval = null;
        this.hotspots = [
            { latOffset: 0.0003, lngOffset: -0.0003, baseDensity: 8, name: "Gate 3", label: "Gate 3 - High Crowd" }, // High density at Gate 3
            { latOffset: -0.0002, lngOffset: 0.0004, baseDensity: 5, name: "Food Court", label: "Food Court - Moderate" }, // Moderate at food court
            { latOffset: 0.0005, lngOffset: 0.0005, baseDensity: 2, name: "East Corridor", label: "East Corridor - Low Density" }, // Low
        ];
    }

    onSnapshot(callback) {
        this.listeners.push(callback);
        this.emitDelta();
        
        // Simulate real-time streaming every 3 seconds (debounced via request on UI side)
        this.interval = setInterval(() => {
            this.emitDelta();
        }, 3500); 
    }

    emitDelta() {
        // Generate pseudo-random realistic movement cluster data
        const data = [];
        this.hotspots.forEach(spot => {
            // Fluctuate the base density
            let currentDensity = spot.baseDensity + (Math.random() * 2 - 1); 
            if (currentDensity < 1) currentDensity = 1;
            
            const pointsToGen = Math.floor(this.pointsCount * (currentDensity / 15));
            for (let i = 0; i < pointsToGen; i++) {
                data.push({
                    lat: this.centerLat + spot.latOffset + (Math.random() - 0.5) * 0.0008,
                    lng: this.centerLng + spot.lngOffset + (Math.random() - 0.5) * 0.0008,
                    weight: Math.random() * 5 // Weight simulation
                });
            }
        });
        
        // Add random scatter points across the stadium
        for (let i = 0; i < 80; i++) {
            data.push({
                lat: this.centerLat + (Math.random() - 0.5) * 0.0018,
                lng: this.centerLng + (Math.random() - 0.5) * 0.0018,
                weight: Math.random() * 2
            });
        }
        
        // Broadcast
        this.listeners.forEach(cb => cb(data));
    }
}
window.FirebaseSimulator = MockFirebaseDB;

// js/heatmap.js
// Attaches Leaflet heatmap layer and listens to Firebase Database
document.addEventListener('DOMContentLoaded', () => {
    let heatLayer = null;
    let database = null;
    
    // Status UI Elements
    const statusDot = document.getElementById('hm-status-dot');
    const statusText = document.getElementById('hm-status-text');

    window.addEventListener('leafletMapReady', () => {
        const map = window.StadiumMap.map;
        
        // Initialize Firebase stream simulation
        database = new window.FirebaseSimulator(window.StadiumMap.centerLat, window.StadiumMap.centerLng);
        
        database.onSnapshot((data) => {
            // Convert to Leaflet Heatmap format: [lat, lng, intensity]
            const heatMapData = data.map(pt => [pt.lat, pt.lng, pt.weight]);

            // Throttle & UI update status simulation
            indicateUpdating();
            
            if (!heatLayer) {
                heatLayer = L.heatLayer(heatMapData, {
                    radius: 40,
                    blur: 25,
                    maxZoom: 17,
                    max: 5,
                    gradient: {
                        0.4: 'green',
                        0.6: 'yellow',
                        0.8: 'orange',
                        1.0: 'red'
                    }
                }).addTo(map);
            } else {
                // Update existing dataset efficiently
                heatLayer.setLatLngs(heatMapData);
            }
            
            setTimeout(() => {
                indicateLive();
                updateSidebarInsights(data); // Mock logic
            }, 800); // Simulated delay
        });
        
        setupInteractiveTooltips();
    });

    function indicateUpdating() {
        if(statusDot) statusDot.style.background = "#f59e0b"; // Yellow
        if(statusText) statusText.textContent = "Updating...";
    }

    function indicateLive() {
        if(statusDot) { 
            statusDot.style.background = "#22c55e"; 
            statusDot.style.animation = "pd 2s ease infinite"; 
        }
        if(statusText) statusText.textContent = "Live";
    }

    function updateSidebarInsights(data) {
        // Just simulating the AI insights fluctuating slightly
        const crowdTotal = data.length;
        const gateCrowd = Math.floor(crowdTotal * 0.45);
        document.getElementById('sb-crowded-val').textContent = `Gate 3 (${gateCrowd} fans)`;
        
        const safeCrowd = Math.floor(crowdTotal * 0.15);
        document.getElementById('sb-safe-val').textContent = `Gate 8 (${safeCrowd} fans)`;
    }

    // Interactive custom tooltips mock
    function setupInteractiveTooltips() {
        const tooltip = document.getElementById('hm-tooltip');
        if (!tooltip) return;
        
        document.getElementById('map-canvas').addEventListener('mousemove', (e) => {
            const rect = e.target.getBoundingClientRect();
            const relX = e.clientX - rect.left;
            const relY = e.clientY - rect.top;
            
            tooltip.style.left = (e.clientX + 15) + 'px';
            tooltip.style.top = (e.clientY + 15) + 'px';
            
            if (relX > 200 && relX < 360 && relY > 160 && relY < 320) {
                tooltip.style.opacity = 1;
                tooltip.innerHTML = "<strong>Gate 3</strong><br/><span style='color:#ef4444'>High Crowd Density (94%)</span>";
            } else if (relX > 400 && relX < 560 && relY > 300 && relY < 460) {
                tooltip.style.opacity = 1;
                tooltip.innerHTML = "<strong>Food Court</strong><br/><span style='color:#f59e0b'>Moderate Crowd (55%)</span>";
            } else {
                tooltip.style.opacity = 0;
            }
        });
    }

    // Buttons logic
    document.getElementById('btn-evac')?.addEventListener('click', (e) => {
        const isEvac = e.target.classList.toggle('active');
        e.target.style.background = isEvac ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,.06)';
        e.target.style.borderColor = isEvac ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255,255,255,.15)';
        e.target.textContent = isEvac ? "Evacuation Routes: ON" : "View evacuation routes";
    });

    document.getElementById('btn-path')?.addEventListener('click', (e) => {
        e.target.textContent = "Calculating AI Path...";
        e.target.style.opacity = '0.7';
        setTimeout(() => {
            e.target.style.opacity = '1';
            e.target.textContent = "✨ Route Found: Gate 8 → Corridor E";
            e.target.style.background = 'linear-gradient(135deg, #10b981, #22c55e)';
            e.target.style.borderColor = 'transparent';
        }, 1200);
    });
});

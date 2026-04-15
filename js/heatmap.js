// js/heatmap.js
// Attaches heatmap layer to Google Map and listens to Firebase Database
document.addEventListener('DOMContentLoaded', () => {
    let heatmap = null;
    let database = null;
    
    // Status UI Elements
    const statusDot = document.getElementById('hm-status-dot');
    const statusText = document.getElementById('hm-status-text');

    window.addEventListener('googleMapReady', () => {
        const map = window.StadiumMap.map;
        
        // Initialize Firebase stream simulation
        database = new window.FirebaseSimulator(window.StadiumMap.centerLat, window.StadiumMap.centerLng);
        
        database.onSnapshot((data) => {
            // Convert to Google Maps Heatmap data format
            const heatMapData = data.map(pt => ({
                location: new google.maps.LatLng(pt.lat, pt.lng),
                weight: pt.weight
            }));

            // Throttle & UI update status simulation
            indicateUpdating();
            
            if (!heatmap) {
                heatmap = new google.maps.visualization.HeatmapLayer({
                    data: heatMapData,
                    map: map,
                    radius: 35,
                    opacity: 0.8,
                    maxIntensity: 50,
                    gradient: [
                        'rgba(0, 255, 255, 0)',
                        'rgba(34, 197, 94, 1)',   // Green: Low
                        'rgba(245, 158, 11, 1)',  // Yellow: Medium
                        'rgba(239, 68, 68, 1)'    // Red: High
                    ]
                });
            } else {
                // Update existing dataset instead of re-instantiating the layer map
                heatmap.setData(heatMapData);
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

    // Mock Tooltips since heatmap layers themselves don't support native object tooltips easily 
    // We add simulated bounds to hover
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

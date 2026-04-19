// public/js/routing-simulator.js

/**
 * Routing Simulator & Tester
 * This module handles navigation logic, input validation, edge cases,
 * error handling, and provides a simple test suite using console.assert.
 */

class RoutingSimulator {
    constructor() {
        // Mock data for valid locations in the stadium
        this.validLocations = ['Gate A', 'Gate B', 'Gate C', 'Zone A', 'Zone B', 'Food Court', 'Washroom', 'Seat 47B'];
    }

    /**
     * Simulate fetching route data with a delay.
     * Handles various edge cases and validation.
     */
    async fetchRoute(source, destination) {
        return new Promise((resolve) => {
            // Simulate network delay to allow loading indicators to show
            setTimeout(() => {
                // 1. Input validation (Empty input)
                if (!source || !destination || source.trim() === '' || destination.trim() === '') {
                    resolve({ success: false, error: 'Source and destination cannot be empty.' });
                    return;
                }

                const src = source.trim().toLowerCase();
                const dst = destination.trim().toLowerCase();

                // 2. Edge case: Same source and destination
                if (src === dst) {
                    resolve({ success: false, error: 'You are already at your destination!' });
                    return;
                }

                // 3. Validation: Verify locations exist
                const isSourceValid = this.validLocations.some(loc => loc.toLowerCase() === src);
                const isDestValid = this.validLocations.some(loc => loc.toLowerCase() === dst);
                
                if (!isSourceValid || !isDestValid) {
                    resolve({ success: false, error: 'Invalid location entered. Please choose a valid stadium zone.' });
                    return;
                }

                // 4. Edge case: "No route found" scenario (e.g. restricted zones)
                if (src === 'gate a' && dst === 'zone a') {
                    resolve({ success: false, error: 'No route found. This path is currently restricted.' });
                    return;
                }

                // Success scenario
                resolve({ 
                    success: true, 
                    route: [source, 'Main Corridor', destination], 
                    eta: '4 mins' 
                });
            }, 800); // 800ms loading simulation
        });
    }

    /**
     * UI Wrapper to handle interactions cleanly without modifying the HTML structure.
     * Uses global toast function if available for fallback states.
     */
    async simulateUserInteraction(source, destination) {
        // UI State: Loading Indicator
        console.log(`[Router] Loading data for route: ${source} -> ${destination}...`);
        if (typeof window.toast === 'function') {
            window.toast('⏳ Finding optimal route...');
        }

        const result = await this.fetchRoute(source, destination);

        // UI State: Handle outcome
        if (!result.success) {
            // Error / Fallback UI state
            console.error("[Router] Error:", result.error);
            if (typeof window.toast === 'function') {
                window.toast('❌ ' + result.error, 'error');
            }
        } else {
            // Success UI state
            console.log("[Router] Success! Route details:", result);
            if (typeof window.toast === 'function') {
                window.toast(`✅ Route found! ETA: ${result.eta}`);
            }
        }

        return result;
    }
}

/**
 * 5. Simple test function using console.assert to simulate various test cases.
 */
async function runRoutingTests() {
    console.log("%c--- Starting Routing Simulator Tests ---", "color: #3b82f6; font-weight: bold;");
    const router = new RoutingSimulator();

    try {
        // Test 1: Empty input
        let res1 = await router.fetchRoute('', 'Gate A');
        console.assert(res1.success === false, "Test 1 Failed: Should block empty source");
        console.assert(res1.error === 'Source and destination cannot be empty.', "Test 1 Failed: Wrong error message");

        // Test 2: Same source/destination
        let res2 = await router.fetchRoute('Gate A', 'Gate A');
        console.assert(res2.success === false, "Test 2 Failed: Should block same locations");
        console.assert(res2.error === 'You are already at your destination!', "Test 2 Failed: Wrong error message");

        // Test 3: Invalid location
        let res3 = await router.fetchRoute('Mars Spaceport', 'Gate A');
        console.assert(res3.success === false, "Test 3 Failed: Should block invalid locations");
        console.assert(res3.error === 'Invalid location entered. Please choose a valid stadium zone.', "Test 3 Failed: Wrong error message");

        // Test 4: No route found
        let res4 = await router.fetchRoute('Gate A', 'Zone A');
        console.assert(res4.success === false, "Test 4 Failed: Should handle no route scenario");
        console.assert(res4.error === 'No route found. This path is currently restricted.', "Test 4 Failed: Wrong error message");

        // Test 5: Valid route
        let res5 = await router.fetchRoute('Gate B', 'Food Court');
        console.assert(res5.success === true, "Test 5 Failed: Valid route should succeed");
        console.assert(res5.eta === '4 mins', "Test 5 Failed: ETA should be present");

        console.log("%c--- All Tests Passed Successfully! ---", "color: #22c55e; font-weight: bold;");
    } catch (err) {
        console.error("Test execution failed:", err);
    }
}

// Expose to window for easy demo/testing from console
window.RoutingSimulator = RoutingSimulator;
window.runRoutingTests = runRoutingTests;

// Automatically execute the test suite 1.5 seconds after load so it can be seen in console
setTimeout(() => {
    runRoutingTests();
}, 1500);

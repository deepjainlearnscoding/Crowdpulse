// js/firebase.js
// Firebase V9 Integration & Setup

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

let app, auth, db;

const FALLBACK_CONFIG = {
    apiKey: "AIzaSyC3-sdajkzX1q89z-sqnptBbWQ5DuusH0s",
    authDomain: "crowdpulse-f2ff0.firebaseapp.com",
    projectId: "crowdpulse-f2ff0",
    storageBucket: "crowdpulse-f2ff0.firebasestorage.app",
    messagingSenderId: "108417955219",
    appId: "1:108417955219:web:67c4bea7f2fec5abaf6466"
};

try {
    let apiBase = '';
    if (window.location.protocol === 'file:') {
        apiBase = 'http://localhost:3001';
    }
    
    let firebaseConfig = FALLBACK_CONFIG;
    try {
        const response = await fetch(`${apiBase}/api/config`);
        if (response.ok) {
            const data = await response.json();
            if (data.firebaseConfig && data.firebaseConfig.apiKey) {
                firebaseConfig = data.firebaseConfig;
            }
        }
    } catch (e) {
        console.warn("[Firebase] Could not fetch /api/config. Using fallback development keys.");
    }

    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("[Firebase] Successfully Initialized Official Core APIs.");
    
} catch (error) {
    console.error("[Firebase] Initialization Failed. Did you setup your API keys?", error);
}

// ── Export Firebase Globally ──
window.CrowdPulseApp = app;
window.CrowdPulseAuth = auth;
window.CrowdPulseDB = db;

window.FirebaseAPI = {
    signIn: signInWithEmailAndPassword,
    signUp: createUserWithEmailAndPassword,
    googleProvider: new GoogleAuthProvider(),
    signInWithPopup,
    signOut,
    onAuthStateChanged
};

// ── HEATMAP FALLBACK SIMULATOR ──
// We retain the heatmap simulator so the visual demo continues working 
// while you focus on connecting the authentication architecture.
class MockFirebaseDB {
    constructor(centerLat, centerLng) {
        this.centerLat = centerLat;
        this.centerLng = centerLng;
        this.listeners = [];
        this.pointsCount = 600;
        this.interval = null;
        this.hotspots = [
            { latOffset: 0.0003, lngOffset: -0.0003, baseDensity: 8, name: "Gate 3", label: "Gate 3 - High Crowd" }, 
            { latOffset: -0.0002, lngOffset: 0.0004, baseDensity: 5, name: "Food Court", label: "Food Court - Moderate" }, 
            { latOffset: 0.0005, lngOffset: 0.0005, baseDensity: 2, name: "East Corridor", label: "East Corridor - Low Density" }, 
        ];
    }

    onSnapshot(callback) {
        this.listeners.push(callback);
        this.emitDelta();
        this.interval = setInterval(() => { this.emitDelta(); }, 3500); 
    }

    emitDelta() {
        const data = [];
        this.hotspots.forEach(spot => {
            let currentDensity = spot.baseDensity + (Math.random() * 2 - 1); 
            if (currentDensity < 1) currentDensity = 1;
            
            const pointsToGen = Math.floor(this.pointsCount * (currentDensity / 15));
            for (let i = 0; i < pointsToGen; i++) {
                data.push({
                    lat: this.centerLat + spot.latOffset + (Math.random() - 0.5) * 0.0008,
                    lng: this.centerLng + spot.lngOffset + (Math.random() - 0.5) * 0.0008,
                    weight: Math.random() * 5
                });
            }
        });
        for (let i = 0; i < 80; i++) {
            data.push({
                lat: this.centerLat + (Math.random() - 0.5) * 0.0018,
                lng: this.centerLng + (Math.random() - 0.5) * 0.0018,
                weight: Math.random() * 2
            });
        }
        this.listeners.forEach(cb => cb(data));
    }
}
window.FirebaseSimulator = MockFirebaseDB;

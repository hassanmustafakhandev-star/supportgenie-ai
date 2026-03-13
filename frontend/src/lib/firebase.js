// Lazy initialize Firebase only on the client side to avoid SSR errors
let _app, _auth, _db, _googleProvider;

function getFirebaseModules() {
    if (typeof window === "undefined") return null;
    if (_app) return { app: _app, auth: _auth, db: _db, googleProvider: _googleProvider };

    const { initializeApp, getApps, getApp } = require("firebase/app");
    const { getAuth, GoogleAuthProvider } = require("firebase/auth");
    const { getFirestore } = require("firebase/firestore");

    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    _app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    _auth = getAuth(_app);
    _db = getFirestore(_app);
    _googleProvider = new GoogleAuthProvider();

    return { app: _app, auth: _auth, db: _db, googleProvider: _googleProvider };
}

export { getFirebaseModules };

// Named exports for compatibility — safe on server (returns undefined until client-side resolves)
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const isBrowser = typeof window !== "undefined";

const firebaseConfig = {
    apiKey: isBrowser ? process.env.NEXT_PUBLIC_FIREBASE_API_KEY : "placeholder",
    authDomain: isBrowser ? process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN : "placeholder",
    projectId: isBrowser ? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID : "placeholder",
    storageBucket: isBrowser ? process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET : "placeholder",
    messagingSenderId: isBrowser ? process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID : "placeholder",
    appId: isBrowser ? process.env.NEXT_PUBLIC_FIREBASE_APP_ID : "1:000000000000:web:0000000000000000000000",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };

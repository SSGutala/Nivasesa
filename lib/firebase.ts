import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only if config is present to avoid crashes
const isConfigValid = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

let app;
let auth: any = null;
let db: any = null;

if (isConfigValid) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
} else {
    console.warn("Firebase configuration is missing. Using mock instances.");
    // Mock Auth
    auth = {
        currentUser: null,
        signOut: async () => { },
        onAuthStateChanged: (cb: any) => () => { },
    } as any;

    // Mock DB
    db = {
        type: 'firestore',
    } as any;
}

export { auth, db };

import { initializeApp, FirebaseApp, getApps, getApp } from 'firebase/app'
// the below imports are option - comment out what you don't need
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'
import 'firebase/performance'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

let app: FirebaseApp;

// export default function initFirebase() {

//     app = initializeApp(firebaseConfig);
//     // Check that `window` is in scope for the analytics module!
//     if (typeof window !== 'undefined') {
//         // Enable analytics. https://firebase.google.com/docs/analytics/get-started
//         if ('measurementId' in firebaseConfig) {
//             // firebase.analytics()
//             // firebase.performance()
//             getAnalytics(app);
//         }
        
//         console.log('Firebase successfully initialized.');
//     }
// }

if(getApps().length) {
    app = getApp();
} else {
    app = initializeApp(firebaseConfig)
}

export default app;

export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
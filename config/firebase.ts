import { getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  // Sleep Catcher Firebase project credentials
  // App nickname: Sleep Catcher
  // Bundle ID: com.dalvindigital.sleep
  // iOS App ID: 1:894695797365:ios:a18298a66fbcefd307be3c
  apiKey: 'AIzaSyAyqD0aFfJs5iVRTQJI02Rd137voDVke-I',
  authDomain: 'sleep-catcher.firebaseapp.com',
  projectId: 'sleep-catcher',
  storageBucket: 'sleep-catcher.firebasestorage.app',
  messagingSenderId: '894695797365',
  appId: '1:894695797365:ios:a18298a66fbcefd307be3c',
};

// Initialize Firebase only if no apps exist
let firebaseApp;
if (getApps().length === 0) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

// Initialize Auth with AsyncStorage persistence for React Native
let firebaseAuth;
try {
  firebaseAuth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  // If auth is already initialized, get the existing instance
  firebaseAuth = getAuth(firebaseApp);
}

// Initialize Firestore
let firebaseFirestore;
try {
  firebaseFirestore = getFirestore(firebaseApp);
} catch (error) {
  console.warn('Firestore initialization failed:', error);
  firebaseFirestore = null;
}

// Export Firebase services
export { firebaseApp, firebaseAuth, firebaseFirestore };
export default firebaseApp;

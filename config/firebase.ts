import { getApps, initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

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
  // iOS specific configuration
  iosBundleId: 'com.dalvindigital.sleep',
  iosAppId: '1:894695797365:ios:a18298a66fbcefd307be3c',
};

// Initialize Firebase only if no apps exist
let firebaseApp;
if (getApps().length === 0) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

// Export Firebase services
export { firebaseApp };
export const firebaseAuth = auth();
export const firebaseFirestore = firestore();

export default firebaseApp;

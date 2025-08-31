
import { initializeApp, getApps } from "@firebase/app";
import { getDatabase } from "@firebase/database";
import { getStorage } from "@firebase/storage";

// Your web app's Firebase configuration.
const firebaseConfig = {
  // Your project's API Key.
  apiKey: "AIzaSyB7FUA8IhViDS74U7KDH1Cz8vh14oe0Ag8",
  
  // Your project's auth domain.
  authDomain: "freetic-5f3b9.firebaseapp.com",
  
  // The databaseURL is CRITICAL for the Realtime Database to work.
  databaseURL: "https://freetic-5f3b9-default-rtdb.firebaseio.com",

  // Your unique project ID.
  projectId: "freetic-5f3b9",

  // Your project's storage bucket.
  storageBucket: "freetic-5f3b9.appspot.com",

  // Your project's messaging sender ID.
  messagingSenderId: "844988690965",

  // Your project's app ID.
  appId: "1:844988690965:web:7e928f998feea72fa0541c"
};

// Initialize Firebase, ensuring it's not re-initialized on hot reloads
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Get a reference to the database service
export const database = getDatabase(app);

// Get a reference to the storage service
export const storage = getStorage(app);
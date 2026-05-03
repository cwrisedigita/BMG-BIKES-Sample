// ============================================================
//  BMG BIG BIKE RENTALS — Firebase Config
// ============================================================

const firebaseConfig = {
  apiKey:            "AIzaSyAhnIobToZ8hf8ovgKi31NpCLS2J6z7PoE",
  authDomain:        "bmg-bigbikes.firebaseapp.com",
  projectId:         "bmg-bigbikes",
  storageBucket:     "bmg-bigbikes.firebasestorage.app",
  messagingSenderId: "87961398574",
  appId:             "1:87961398574:web:95fd58062f35e8cd67debf"
};

firebase.initializeApp(firebaseConfig);

const db   = firebase.firestore();
const auth = firebase.auth();

const FACEBOOK_URL = "https://www.facebook.com/BMGbigbikes";
const PHONE        = "0991 482 7609";

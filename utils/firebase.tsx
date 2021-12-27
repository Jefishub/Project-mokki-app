import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCfqrnNRczFy3T-sIFWm3h9jAeGZJhNEAo",
    authDomain: "mokki-app.firebaseapp.com",
    databaseURL: "https://mokki-app-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "mokki-app",
    storageBucket: "mokki-app.appspot.com",
    messagingSenderId: "1076260585596",
    appId: "1:1076260585596:web:b80e79ce08ccfaefc609f9",
    measurementId: "G-W91HJB66BQ"
};

export default function Firebase() {
    const app = initializeApp(firebaseConfig);
    return app
}

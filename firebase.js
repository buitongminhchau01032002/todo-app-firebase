// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyAriDRdLoJ5sogDaJFyMA0q0dyD4aueNWo',
    authDomain: 'csdl-todos.firebaseapp.com',
    projectId: 'csdl-todos',
    storageBucket: 'csdl-todos.appspot.com',
    messagingSenderId: '535470081688',
    appId: '1:535470081688:web:58a72518e3588ec0ac32ed',
    measurementId: 'G-JYTX30DHSH',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

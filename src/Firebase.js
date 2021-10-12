// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import 'firebase/database';
import 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBzh1FaixUfliTaZQIiDXDux3zaykCqn4o",
    authDomain: "pizza-order-0821.firebaseapp.com",
    projectId: "pizza-order-0821",
    storageBucket: "pizza-order-0821.appspot.com",
    messagingSenderId: "1043620246628",
    appId: "1:1043620246628:web:183738d008a45890d51b71"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

// export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = getAuth();

export default firebase;
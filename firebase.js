import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCNhRwnG1JPTfzW3MTtTs2RJzUgPnN9Ob8",
  authDomain: "instagram-clone-772e9.firebaseapp.com",
  projectId: "instagram-clone-772e9",
  storageBucket: "instagram-clone-772e9.appspot.com",
  messagingSenderId: "794538826071",
  appId: "1:794538826071:web:e4fdf6ffe69543ebb48612",
  measurementId: "G-VDCX93BZJE"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};
import { getApp, getApps, initializeApp } from  'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

//here is the firebase configuration 
const firebaseConfig = {
    apiKey: "AIzaSyDUferQlPPQtZLptKjDY2hZsk7OjATB1WY",
    authDomain: "auth-8510d.firebaseapp.com",
    projectId: "auth-8510d",
    storageBucket: "auth-8510d.appspot.com",
    messagingSenderId: "1064587148700",
    appId: "1:1064587148700:web:f87ba59afdc612b48a1c59",
    measurementId: "G-407YLQ28TS"
};
//initialize firebase
const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

// intialize db
const firestore = getFirestore(app)
const storage = getStorage(app)

export { app, firestore, storage};
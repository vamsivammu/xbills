import * as firebase from 'firebase';
import firestore from 'firebase/firestore'

// const settings = {timestampsInSnapshots: true};

const config = {
    apiKey: "AIzaSyBXJZBHy-FLzxTJ9o4VUgENt9XzJ7UKlBs",
    authDomain: "officially-singles.firebaseapp.com",
    databaseURL: "https://officially-singles.firebaseio.com",
    projectId: "officially-singles",
    storageBucket: "officially-singles.appspot.com",
    messagingSenderId: "489289496203",
    appId: "1:489289496203:android:d80fe39edc45a40c"
};
firebase.initializeApp(config);

// firebase.firestore().settings(settings);

export default firebase;
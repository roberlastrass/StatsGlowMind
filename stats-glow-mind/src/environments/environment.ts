import { FIREBASE_KEY } from '../app/keys/keys';

export const environment = {

    firebaseConfig: {
      apiKey: FIREBASE_KEY,
      authDomain: "statsglowmindtfg.firebaseapp.com",
      databaseURL: "https://statsglowmindtfg-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "statsglowmindtfg",
      storageBucket: "statsglowmindtfg.appspot.com",
      messagingSenderId: "111604075463",
      appId: "1:111604075463:web:c135dffece96e3791c67e2",
      measurementId: "G-RYGMD1ENK6"
    },
    production: false

};

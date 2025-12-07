import { bootstrapApplication } from '@angular/platform-browser';
import { initializeApp } from "firebase/app";;
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { decodeFireConfig } from './app/services/firebase';

/* =======================================================
 * ANGULAR
 * ==================================================== */
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

/* =======================================================
 * FIREBASE
 * https://console.firebase.google.com/u/0/project/creativia-e5468/settings/general
 * ==================================================== */
initializeApp({
  apiKey: decodeFireConfig("WVFieUthWWBKT3BAISxVV1Rafm9ALSohKWpffElPV0E1TCtddHZv"),
  authDomain: decodeFireConfig("e2p9eWxxbnF5NX0tLC4gNn5xan16eWt9eWhoNnt3dQ=="),
  projectId: decodeFireConfig("e2p9eWxxbnF5NX0tLC4g"),
  storageBucket: decodeFireConfig("e2p9eWxxbnF5NX0tLC4gNn5xan16eWt9a2x3anl/fTZ5aGg="),
  messagingSenderId: decodeFireConfig("LiopISspIC8tLCwu"),
  appId: decodeFireConfig("KSIuKikhKykgLy0sLC4ib316Iip+KHkqfX0oLCEteyF6KiF6KS4rLS8="),
  measurementId: decodeFireConfig("XzUoLClVK19dLkFO")
});

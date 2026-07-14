import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app'; // On utilise "App" avec un "A" majuscule comme dans ton test !
import 'zone.js';
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
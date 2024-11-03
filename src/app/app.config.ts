import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { IonicModule } from '@ionic/angular';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideAnimations } from '@angular/platform-browser/animations';

const firebaseConfig = {
  apiKey: "demo-key",
  authDomain: "demo-domain.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-bucket.appspot.com",
  messagingSenderId: "000000000000",
  appId: "demo-app-id"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(IonicModule.forRoot()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth())
  ]
};

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Network } from '@ionic-native/network';
import { SelectSearchableModule } from 'ionic-select-searchable';

import { ImagePicker } from '@ionic-native/image-picker';
import { Camera } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';

import { MyApp } from './app.component';

import { SingletonService } from '../services/singleton/singleton';
import {Localstorage} from '../services/storage/localstorage';

import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { HomePage } from '../pages/home/home';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { AppointmentPage } from '../pages/appointments/appointments';
import { ProfilePage } from '../pages/profile/profile';
import { RsvpPage } from '../pages/rsvp/rsvp';
import { RegionPage } from '../pages/region/region';
import { GroupPage } from '../pages/group/group';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AboutPage,
    ContactPage,
    DashboardPage,
    AppointmentPage,
    LoginPage,
    ProfilePage,
    SignupPage,
    RsvpPage,
    RegionPage,
    GroupPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    SelectSearchableModule,  
    HttpModule, 
    HttpClientModule,
    FormsModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AboutPage,
    ContactPage,
    DashboardPage,
    AppointmentPage,
    LoginPage,
    ProfilePage,
    SignupPage,
    RsvpPage,
    RegionPage,
    GroupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SingletonService,
    Localstorage,
    Network,
    ImagePicker,
    Camera, 
    FilePath,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

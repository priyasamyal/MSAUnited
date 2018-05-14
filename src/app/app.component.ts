import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, App,Events,ViewController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { Http } from '@angular/http';

import { ImagePicker } from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';

import { SingletonService } from '../services/singleton/singleton';
import {Localstorage} from '../services/storage/localstorage';

import { HomePage } from '../pages/home/home';
import { ContactPage } from '../pages/contact/contact';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { RegionPage } from '../pages/region/region';


import { AppointmentPage } from '../pages/appointments/appointments';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';


@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;
  
  rootPage: any = HomePage;
  
  public pages: Array<{title: string, icon: string, component: any, color: string, edit: boolean}>;
  
  public online:boolean = false;
     
  public options;
     
  data:any = {};     

  constructor(private filePath: FilePath, public app: App,private network: Network, public events: Events, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public localstorage: Localstorage, public singleton: SingletonService, public http: Http, public imagePicker: ImagePicker, public camera: Camera) {
              this.http = http;
       
              this.initializeApp();
          
              this.network.onConnect().subscribe(res=>{
                this.online = true;
                console.log("NETWORK STATUS:"+this.online);
              });
       
              this.network.onConnect().subscribe(() => {
                   console.log("Connected successfully")         
                   //do other tasks after connected
                 }, error => console.error(error));

              this.network.onDisconnect().subscribe(res=>{
                this.online = false;
                console.log("NETWORK STATUS:"+this.online);
                this.singleton.doAlert('No Internet Connection', 'Sorry, no Internet connectivity detected. Please reconnect and try again.', 'OK');    
              });
              
     
          // used for an example of ngFor and navigation
          this.pages = [
                { title: 'HOME', 'icon': 'home', component: HomePage, 'color': '#7e3ba9', edit : true},
                { title: 'DASHBOARD', 'icon': 'speedometer', component: DashboardPage, 'color': '#7e3ba9', edit : false},
                { title: 'FAQ', 'icon': 'information-circle',component: null, 'color': '#7e3ba9', edit : true},
                { title: 'REGIONAL VIDEO GROUPS', 'icon': 'globe', component: RegionPage, 'color': '#7e3ba9', edit : true},
                { title: 'PRIVACY / DISCLAIMER', 'icon': 'lock', component: null, 'color': '#7e3ba9', edit : true},
                { title: 'CONTACT US', 'icon': 'mail', component: ContactPage, 'color': '#7e3ba9', edit : true},
                { title: 'LOGOUT', 'icon': 'log-out', component: null, 'color': '#7e3ba9', edit : false}
          ];

          // login check
          if(window.localStorage.getItem('logged') == 'true'){
               console.log("IF:" + window.localStorage.getItem('logged'));
               this.pages[1].edit = true;
               this.pages[6].edit = true;
               
               this.singleton.username = window.localStorage.getItem('username');
               this.singleton.userEmail = window.localStorage.getItem('userEmail');
               setTimeout(function(){
                    var userProfilePicture = document.getElementById("userProfilePicture") as HTMLImageElement;
                    userProfilePicture.src = window.localStorage.getItem('userProfilePicture');
               }, 500);
               
          } else {
               console.log("ELSE:" + window.localStorage.getItem('logged'));
          }
          this.singleton.getCommonDetail();
          
          // hide logout from nav-menu
          events.subscribe('user:logged-in', () => {
               this.pages[1].edit = true;
               this.pages[6].edit = true;
               
               this.singleton.username = window.localStorage.getItem('username');
               this.singleton.userEmail = window.localStorage.getItem('userEmail');
          });
       
          events.subscribe('session:expired', () => {
               this.nav.push(LoginPage);
          });
    
  }
  
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

    });    
    var lastTimeBackPress = 0;
    var timePeriodToExit = 2000;
    this.platform.registerBackButtonAction(() => {
      let view = this.app.getActiveNav().getViews().length;
      console.log(view, 'view');
      if (view == 1) {
        if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
          console.log('press1');
          this.platform.exitApp(); //exit from app
          if (this.nav.canGoBack()) this.nav.pop({});
        } else {
          console.log('press');
          this.singleton.commonToast('Press back again to exit App?');
          lastTimeBackPress = new Date().getTime();
        }
      } else if (view != 1) {
        let nav = this.app.getActiveNav();
        let activeView: ViewController = nav.getActive();
        console.log(activeView);
        if (activeView != null) {
          if (nav.canGoBack()) nav.pop();
          else nav.parent.select(0); // goes to the first tab
        }
      }
    });
  
  }

  openPage(page) {
    let nav = this.app.getActiveNav();
    let activeView: ViewController = nav.getActive();
   
    console.log(activeView.component.name)
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(activeView.component.name!=page.component){
      if( page.title.toLowerCase().indexOf('home') >= 0){
        this.nav.setRoot(HomePage);
        } 
  
       else if( page.title.toLowerCase().indexOf('privacy') >= 0){
            this.singleton.launch(this.singleton.privacyPolicyLink);
       } else if( page.title.toLowerCase().indexOf('faq') >= 0){
            this.singleton.launch(this.singleton.faqsLink);
       } else if( page.title.toLowerCase().indexOf('logout') >= 0){
            page.edit = false;
            this.pages[1].edit = false;
            this.singleton.logoutFunc();
            this.nav.setRoot(HomePage);
            var userProfilePicture = document.getElementById("userProfilePicture") as HTMLImageElement;
            userProfilePicture.src = "assets/imgs/profile.png";
       } else {
             
  
            this.nav.push(page.component);
       }
    }
  
  }
  
     uploadToServer(imageData) {
          (<any>window).resolveLocalFileSystemURL(imageData, (fileEntry)=>{
                           var doc_data = new FormData();

                         fileEntry.file(file => {
                              var reader = new FileReader();
                              reader.onloadend = (e) => {
                                   var imgBlob = new Blob([reader.result], {
                                        type: file.type
                                   });

                                   doc_data.append('profile_image', imgBlob, file.name);

                                   this.singleton.showLoader();
                                   //make HTTP call
                                   this.http.post(this.singleton.saveProfileImageApi, doc_data)
                                       .subscribe(data => {
                                           this.data.response = data["_body"];
                                           var callback = JSON.parse(this.data.response);
                                           console.log(JSON.stringify(callback));

                                           if (callback.meta.success) {
                                               this.singleton.commonToast('Profile picture uploaded successfully.');
                                                
                                               window.localStorage.setItem('userProfilePicture', callback.data.profile_image);

                                               var userProfilePicture = document.getElementById("userProfilePicture") as HTMLImageElement;
                                               userProfilePicture.src = callback.data.profile_image;
                                           } else {

                                               if (callback.data.errors.type == 'validation') {
                                                   var validationErrors = "";

                                                   // create a single string from validation array.
                                                   for (var propName in callback.data.errors.array) {
                                                       if (callback.data.errors.array.hasOwnProperty(propName)) {
                                                           validationErrors += callback.data.errors.array[propName] + "<br>";
                                                       }
                                                   }
                                                   this.singleton.doAlert('', validationErrors, 'Ok');
                                               } else {
                                                   this.singleton.commonToast(callback.data.errors.message);
                                               }

                                           }
                                           this.singleton.hideLoader();
                                       }, error => {
                                           console.log("Oooops!" + JSON.stringify(error));
                                           this.singleton.hideLoader();
                                       });

                              };
                              reader.readAsArrayBuffer(file);
                         });

                         console.log("FILE SYSTEM:" + JSON.stringify(fileEntry));
                      }, function (error) {
                          console.log('Error: ' + error);
                      });
     }
     
   //For action sheet
   openImagePicker() {

    // var mThis
        
        if(!this.singleton.networkCheck()) {
               this.singleton.doAlert('No Internet Connection', 'Sorry, no Internet connectivity detected. Please reconnect and try again.', 'OK');
        } else if(window.localStorage.getItem('logged') == 'true'){
             
               const options: CameraOptions = {
                 quality: 100,
                 destinationType: this.camera.DestinationType.FILE_URI,
                 sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                 mediaType: this.camera.MediaType.PICTURE
               }
                      this.camera.getPicture(options).then((imageData) => {
                      console.log("SOURCE:" + JSON.stringify(imageData));
                    
                      if (imageData.startsWith("Content://") || imageData.startsWith("content://")) {
                        
                              this.filePath.resolveNativePath(imageData)
                              .then(filePath =>{
                                imageData = filePath;
                                this.uploadToServer(imageData);
                              })
                              .catch(err => console.log(err));
                              // (<any>window).FilePath.resolveNativePath(imageData, function (result) {
                              //      imageData = result;
                              //      this.uploadToServer(imageData);
                              // }, function (error) {
                              //      throw new Error("");
                              // });
                      } else {
                                  this.uploadToServer(imageData);
                      }  
                    console.log("MODIFIED SOURCE:" + JSON.stringify(imageData));     

               },
                (err) => {
                    console.log("IMAGE PICKER ERROR:" + JSON.stringify(err));
               });
             
        }
        
   }
     
}
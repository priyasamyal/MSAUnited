import {Injectable} from '@angular/core';
import {Events, Platform, Loading, LoadingController, AlertController, ToastController, ActionSheetController } from 'ionic-angular';
import {ValidatorFn, AbstractControl } from '@angular/forms';
import { Http } from '@angular/http';
import { Network } from '@ionic-native/network';    

import {Localstorage} from '../storage/localstorage';

@Injectable()
export class SingletonService {

    public versionString: string = "1.0.8";
    public loginState: boolean = false;
    public emailPattern = /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;
    public noSpaceWithCharacterOnlyPattern = /^[a-zA-Z]*$/;
    public numberOnlyPattern = /^\d+$/;
    public mobileNumberOnlyPattern = /^\d{10}$/;
    public noSpaceWithAlphanumericUnderscoreOnlyPattern = /^[a-zA-Z0-9_]+$/;
   
    public iOSappUrl = 'https://itunes.apple.com/us/app/gosh-global-online-support-hub/id1350515767'; // app store url

    public webDomain: string = "https://www.brainpatient.org/";
    public domain: string = this.webDomain + 'api/mobile/';
    public baseUrl: string =  this.domain + 'user/';
    public saveProfileImageApi: string = this.baseUrl + 'saveProfileImage/';
    public commonDetailsApi: string = this.baseUrl + 'commonDetails/';
    public loginApi: string = this.baseUrl + 'login/';
    public registerApi: string = this.baseUrl + 'register/';
    public forgotPasswordApi: string = this.baseUrl + 'regeneratePassword/';
    public userProfileApi: string = this.baseUrl + 'profile/';
    public changePasswordApi: string = this.baseUrl + 'changePassword/';
    public upcomingAppoinmentsListApi: string = this.baseUrl + 'userUpcomingAppoinmentsList/';
    public pastAppoinmentsListApi: string = this.baseUrl + 'userPastAppoinmentsList/';
    public sessionListApi: string = this.baseUrl + 'sessionList/';
    public rsvpApi: string = this.baseUrl + 'setRsvp/';
    public getFaqsApi: string = this.baseUrl + 'faqs/';
    public sessionDetailApi: string = this.domain + 'session/';
    public updateSessionApi: string = this.domain + 'updateSession/';
    public blockUserApi: string = this.baseUrl + 'blockUser/';   
    //{participant_id: participant_id, user_id: user_id} THEN sendSignal('block_user', {blocked_user_id: user_id});
    public archiveSessionApi: string = this.domain + 'archiveSession/';
    public saveSessionChatApi: string = this.domain + 'saveSessionChat/'; 
    //{msg: recieved.msg, name: recieved.name, user_id: recieved.user_id, is_moderator: recieved.is_moderator, file_name: session_id}
    public newsletterSubscriptionApi: string = this.domain + 'subscribeNews/';   
    
    
    
    public privacyPolicyLink = this.webDomain + "Terms&PrivacyPolicy/";
    public faqsLink = this.webDomain + "#faq";
    public volunteerLink = this.webDomain + "volunteer";
    public technicalHelpLink = this.webDomain + "technicalHelp";
    public organiseVideoChat = this.webDomain + "organizeChat";
    public feedbackLink = this.webDomain + "#feedback";
     
    public donateLink = "https://defeatmsa.org/donate-to-us/";
    public msaShoeLink = "https://msashoe.org/";
    public defeatMSALink = "http://defeatmsa.org/";
    public supportLink = "https://defeatmsa.org/individual-supporters/";
     
    public facebookLink = "https://facebook.com/DefeatMSA/";
    public msaShoeFacebookLink = "https://facebook.com/MSAshoe/";
    public twitterLink = "https://twitter.com/DefeatMSA/";
    public youtubeLink = "https://www.youtube.com/channel/UCU3BfYB3o3Pj7mhrtU_LYDw";
    public instagramLink = "https://instagram.com/defeatmsa/";
    
    public twitterUsername = "@DefeatMSA";
    public instagramUsername = "defeatmsa";
    
    public sessionExpiredMsg = "Your session has been expired. Please login again to continue.";
     
    public continentArr;
    public regionArr;
    public timezoneArr;
    public countriesArr;
    public sessionListArr;
    public currentRegionDetail;
    public currentGroupDetail;
    public selectedGroupName: string;
    
    loading: Loading;
    
    public username = "Username";
    public userEmail = "Chat-Info@defeatmsa.org";
     
    data:any = {};
    constructor(public events: Events, public platform: Platform, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public toastCtrl: ToastController, public actionsheetCtrl: ActionSheetController, public http: Http, public localstorage: Localstorage, public network: Network) {
        // initalize things
        this.data.response = '';
        this.http = http;
    }
    
    setRootHome() {
//          this.app.getActiveNav().setRoot(LoginPage);
    }
    
    gotoProfilePage() {
          //this.app.getActiveNav().push(ProfilePage);
    }
    
     ngOnInit(){ 
          //goto login page after some time
          setTimeout(() => {
               //this.app.getActiveNav().setRoot(LoginPage); // Set Login page as rootpage with navigation menubar
               //this.app.getActiveNav().push(EditPage);// Load edit page on top of previous page with back button
          }, 3000);
     }
    
    public loader;
    // Create & Show loader
    public showLoader(): void {
          this.loading = this.loadingCtrl.create({
               content: 'Please wait...',
               spinner: 'dots'  // dots, ios, ios-small, bubbles, circles, crescent
          });
          this.loading.present();
    }
    // Hide loader
    public hideLoader(): void {
         if(this.loading){
               this.loading.dismiss();
               this.loading = null;
          }
    }
    
    // Create & Show alert
     doAlert(title:string, message:string, button:string) {
         let alert = this.alertCtrl.create({
           title: title,
           message: message,
           buttons: [button]
         });
         alert.present();
     }
  
     // Create & Show confirm dialog
     doConfirm(title:string, message:string, buttonOne:string, buttonTwo:string) {
         let confirm = this.alertCtrl.create({
           title: title,
           message: message,
           buttons: [
             {
               text: buttonOne,
               handler: () => {
                 console.log('Agree clicked');
               }
             },
             {
               text: buttonTwo,
               handler: () => {
                 console.log('Disagree clicked');
               }
             }
           ]
         });
         confirm.present()
     }
     
     doMenu() {
         let actionSheet = this.actionsheetCtrl.create({
           title: 'Albums',
           cssClass: 'action-sheets-basic-page',
           buttons: [
             {
               text: 'Delete',
               role: 'destructive',
               icon: !this.platform.is('ios') ? 'trash' : null,
               handler: () => {
                 console.log('Delete clicked');
               }
             },
             {
               text: 'Share',
               icon: !this.platform.is('ios') ? 'share' : null,
               handler: () => {
                 console.log('Share clicked');
               }
             },
             {
               text: 'Cancel',
               role: 'cancel', // will always sort to be on the bottom
               icon: !this.platform.is('ios') ? 'close' : null,
               handler: () => {
                 console.log('Cancel clicked');
               }
             }
           ]
         });
         actionSheet.present();
       }
     
     // Create & Show toast
     showToast(position: string, message:string, duration:number, closeButton:boolean, closeButtonText:string) {
         let toast = this.toastCtrl.create({
           message: message,
           duration: duration,
           position: position,
           showCloseButton: closeButton,
           closeButtonText: closeButtonText,
           dismissOnPageChange : false
         });
         toast.present(toast);
       }
       
       commonToast(message:string) {
         let toast = this.toastCtrl.create({
           message: message,
           duration: 3000,
           position: 'bottom',
           showCloseButton: false,
           dismissOnPageChange : false
         });
         toast.present(toast);
       }
       
       launch(url) {
             this.platform.ready().then(() => {
                // cordova.InAppBrowser.open(url, "_system", "location=true");
                 //let browser = new InAppBrowser(url, '_blank');
                 window.open(url, '_system');
             });
         }

     networkCheck(){
          console.log("NETWORK TYPE:" + this.network.type);
          if(this.network.type == 'NONE' || this.network.type == 'none'){
               return false;
          } else {
               return true;
          }
     }
       
     equaltoFunc(field_name): ValidatorFn {
          return (control: AbstractControl): {[key: string]: any} => {

               let input = control.value;

               let isValid = control.root.value[field_name] == input;
               //console.log("PASSWORD:"+control.value+"|"+isValid);
               if(!isValid) 
               return { 'equalToKey': {isValid} }
               else 
               return null;
          };
     }
     
     validateEmailFunc(): ValidatorFn {
          return (control: AbstractControl): {[key: string]: any} => {

               let input = control.value;
               
               let emailTest = this.emailPattern.test(input);
               //console.log("EMAIL:"+input+"|"+emailTest);
               if(!emailTest)
               return { 'validateEmailKey': {emailTest} }
               else 
               return null;
          };
     }
     
     noSpaceWithCharacterOnlyFunc(): ValidatorFn {
          return (control: AbstractControl): {[key: string]: any} => {

               let input = control.value;
               
               let noSpaceCharacterOnlyPattern = /^[a-zA-Z]*$/;
               let noSpaceCharacterOnlyTest = noSpaceCharacterOnlyPattern.test(input);
               //console.log("CHARACTER ONLY WITHOUT SPACE:"+input+"|"+noSpaceCharacterOnlyTest);
               if(!noSpaceCharacterOnlyTest)
               return { 'noSpaceCharacterOnlyKey': {noSpaceCharacterOnlyTest} }
               else 
               return null;
          };
     }
     
     noSpaceWithAlphanumericUnderscoreOnlyFunc(): ValidatorFn {
          return (control: AbstractControl): {[key: string]: any} => {

               let input = control.value;
               
               let noSpaceWithAlphanumericUnderscoreOnlyTest = this.noSpaceWithAlphanumericUnderscoreOnlyPattern.test(input);
               //console.log("ALPHANUMERIC UNDERSCORE WITHOUT SPACE:"+input+"|"+noSpaceWithAlphanumericUnderscoreOnlyTest);
               if(!noSpaceWithAlphanumericUnderscoreOnlyTest)
               return { 'noSpaceAlphanumericUnerscoreOnlyKey': {noSpaceWithAlphanumericUnderscoreOnlyTest} }
               else 
               return null;
          };
     }
     
     numberOnlyFunc(): ValidatorFn {
          return (control: AbstractControl): {[key: string]: any} => {

               let input = control.value;
               
               let numberOnlyTest = this.numberOnlyPattern.test(input);
               //console.log("NUMBER ONLY:"+input+"|"+numberOnlyTest);
               if(!numberOnlyTest)
               return { 'numberOnlyKey': {numberOnlyTest} }
               else 
               return null;
          };
     }
     
     characterOnlyWithSpaceFunc(): ValidatorFn {
          return (control: AbstractControl): {[key: string]: any} => {

               let input = control.value;
               
               let characterOnlyWithSpacePattern = /^[a-zA-Z ]*$/;
               let characterOnlyWithSpaceTest = characterOnlyWithSpacePattern.test(input);
               //console.log("CHARACTER ONLY:"+input+"|"+characterOnlyWithSpaceTest);
               if(!characterOnlyWithSpaceTest)
               return { 'characterOnlyWithSpaceKey': {characterOnlyWithSpaceTest} }
               else 
               return null;
          };
     }
     
     getObjectBasedOnValueFunc(arr, key, value){
                       
           var selectedCategory = arr.find(item => item[key] == value);
           
           console.log("SPECIFIC ITEM:"+JSON.stringify(selectedCategory));
           
           return selectedCategory;
          
     }
     
     logoutFunc(){
          this.commonToast("Logout Sucessfully");
          window.localStorage.clear();
          window.sessionStorage.clear();
          this.localstorage.clearStorage();
          
          this.username = "Username";
          this.userEmail = "Chat-Info@defeatmsa.org";
          
     }
     
     versionCompare(a, b) {
         if (a === b) {
            return 0;
         }

         var a_components = a.split(".");
         var b_components = b.split(".");

         var len = Math.min(a_components.length, b_components.length);

         // loop while the components are equal
         for (var i = 0; i < len; i++) {
             // A bigger than B
             if (parseInt(a_components[i]) > parseInt(b_components[i])) {
                 return 1;
             }

             // B bigger than A
             if (parseInt(a_components[i]) < parseInt(b_components[i])) {
                 return -1;
             }
         }

         // If one's a prefix of the other, the longer one is greater.
         if (a_components.length > b_components.length) {
             return 1;
         }

         if (a_components.length < b_components.length) {
             return -1;
         }

         // Otherwise they are the same.
         return 0;
     }

     getCommonDetail(){
          
          if(!this.networkCheck()) {
               this.doAlert('No Internet Connection', 'Sorry, no Internet connectivity detected. Please reconnect and try again.', 'OK');
          } else {          
               this.showLoader();

               this.http.get(this.commonDetailsApi)
                     .subscribe(data => {
                         this.data.response = data["_body"]; 
                         var callback = JSON.parse(this.data.response);
                         console.log(JSON.stringify(callback)+"\n"+this.versionString);

                         var defaultTimezone = {timezone_id: "", timezone_name: "Timezone", timezone_format: "", abbrevation: "", combined: "Timezone"};
                         
                         if(callback.meta.success){
                             this.continentArr = callback.data.continents;
                             this.regionArr = callback.data.regions;
                             this.timezoneArr = callback.data.timezones;
                              
                             for(let data of this.timezoneArr) {
                                if(data.timezone_format && data.timezone_format.substring(0, 1) != '-'){
                                   data.timezone_format = "+" + data.timezone_format;
                                }
                                if(data.timezone_format){
                                   data["combined"] = "(UTC" + data.timezone_format + ") " + data.timezone_name;
                                }
                                
                             }
                             this.timezoneArr.unshift(defaultTimezone);
                              
                             for(let data of this.continentArr) {
                                data["modal"] = "close";
                             }

                             this.countriesArr = callback.data.countries;
                             for(let data of this.countriesArr) {
                                data.phone_code = "+" + data.phone_code;
                             }

                             try{
                                if(this.versionCompare(callback.data.versionString, this.versionString)>0){
                                   this.getAppVersion();
                                }  
                             } catch(err){}

                         } else {

                              if (callback.data.errors.type == 'validation') {
                                   var validationErrors = "";

                                   // create a single string from validation array.
                                   for (var propName in callback.data.errors.array) {
                                        if (callback.data.errors.array.hasOwnProperty(propName)) {
                                             validationErrors += callback.data.errors.array[propName] + "<br>";
                                        }
                                   }
                                   this.doAlert('', validationErrors, 'Ok');
                              } else {
                                   this.commonToast(callback.data.errors.message);
                              }
                         }
                         this.hideLoader();
                     }, error => {
                         console.log("Oooops!"+JSON.stringify(error));
                         this.hideLoader();
                     });
          }
      }

     getAppVersion(){
          let alert = this.alertCtrl.create({
               title: '',
               message: 'A new version is available on App Store.\nPlease update your app.',
               buttons: [
                    {
                      text: 'UPDATE',
                      role: 'update',
                      handler: () => {
                        this.launch(this.iOSappUrl);  // go to app store.
                      }
                    }
               ]
          });
          alert.present();
      }

     ajaxSuccessFailHandler(callback){
          
          if (callback.data.errors.type == 'validation') {
               var validationErrors = "";
               for (var propName in callback.data.errors.array) {
                    if (callback.data.errors.array.hasOwnProperty(propName)) {
                         validationErrors += callback.data.errors.array[propName] + "<br>";
                    }
               }
               this.doAlert('', validationErrors, 'Ok');
          } else {
               this.commonToast(callback.data.errors.message);
               
               if(callback.data.errors.message == this.sessionExpiredMsg){
                    this.logoutFunc();

                    this.events.publish('session:expired');
               }
          }
     }
     
     ajaxErrorHandler(error){
          if (error.status === 500) {
               this.commonToast(error.status);
          }
          else if (error.status === 400) {
               this.commonToast(error.status);
          }
          else if (error.status === 409) {
               this.commonToast(error.status);
          }
          else if (error.status === 406) {
               this.commonToast(error.status);
          }
     }
      
}



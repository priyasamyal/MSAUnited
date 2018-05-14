import { Component } from '@angular/core';
import { NavController, AlertController, Events } from 'ionic-angular';
import { Http } from '@angular/http';
import { FormBuilder, Validators} from '@angular/forms';

import { SingletonService } from '../../services/singleton/singleton';
import {Localstorage} from '../../services/storage/localstorage';

import { SignupPage } from '../signup/signup';
import { DashboardPage } from '../dashboard/dashboard';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

     data:any = {};
     
     login;
     
     obj;
     
     signupPage = SignupPage;
     dashboardPage = DashboardPage;
  
       constructor(public events: Events, public alertCtrl: AlertController, public http: Http, public singleton: SingletonService, public navCtrl: NavController, public localstorage: Localstorage, public formBuilder: FormBuilder) { 
                this.data.username = '';
                this.data.password = '';
                this.data.response = '';
                this.http = http;

                this.login = formBuilder.group({
                       username: ['', Validators.compose([Validators.required])],
                       password: ['', Validators.compose([Validators.required])]
                });
       }
 
       doPrompt() {
       
         let prompt = this.alertCtrl.create({
           title: 'Reset Password',
           inputs: [
             {
               name: 'email',
               placeholder: 'Enter email address'
             },
           ],
           buttons: [
             {
               text: 'Cancel',
               handler: data => {
                 console.log('Cancel clicked');
               }
             },
             {
               text: 'Submit',
               handler: data => {
                        console.log("VALUE:" + JSON.stringify(data)+"|"+this.singleton.emailPattern.test(data.email));
                        let validateObj = this.singleton.emailPattern.test(data.email);
                        
                        if(!this.singleton.networkCheck()) {
                              this.singleton.doAlert('No Internet Connection', 'Sorry, no Internet connectivity detected. Please reconnect and try again.', 'OK');
                        } else if (!validateObj) {
                            this.singleton.commonToast('Please enter valid email address');
                            return false;
                        } else {
                            this.singleton.showLoader();
                            //make HTTP call
                            var myData = JSON.stringify({email: data.email});
                            
                            this.http.post(this.singleton.forgotPasswordApi, myData)
                               .subscribe(data => {
                                   this.data.response = data["_body"]; 
                                   var callback = JSON.parse(this.data.response);
                                   console.log(JSON.stringify(callback));

                                   if(callback.meta.success){
                                        this.singleton.commonToast('Check your mail to reset your password.');
                                        prompt.dismiss();
                                   } else {
                                        this.singleton.ajaxSuccessFailHandler(callback);
                                   }
                                   this.singleton.hideLoader();
                               }, error => {
                                   console.log("Oooops!"+JSON.stringify(error));
                                   this.singleton.hideLoader();
                               });
                               return false;
                        }
                    }
             }
           ]
         });
         prompt.present();
     } 
     
     loginFunc() {

          if(!this.singleton.networkCheck()) {
               this.singleton.doAlert('No Internet Connection', 'Sorry, no Internet connectivity detected. Please reconnect and try again.', 'OK');
          } else if(!this.data.username) {
               this.singleton.commonToast('Please enter username');
          } else if(!this.data.password) {
               this.singleton.commonToast('Please enter password');
          } else {
          
                this.singleton.showLoader();

                var myData = JSON.stringify({username: this.data.username, password: this.data.password});
                
                this.http.post(this.singleton.loginApi, myData)
                .subscribe(data => {
                    this.data.response = data["_body"]; 
                    var callback = JSON.parse(this.data.response);
                    console.log(JSON.stringify(this.data));

                    if(callback.meta.success){
                         // set a key/value
                         //this.localstorage.setLoggedIn(true);
                         window.localStorage.setItem('logged', 'true');
                         window.localStorage.setItem('userId', callback.data.user_id);
                         window.localStorage.setItem('username', callback.data.username);
                         window.localStorage.setItem('userEmail', callback.data.email);
                         window.localStorage.setItem('userProfilePicture', callback.data.profile_image);
                         
                         var userProfilePicture = document.getElementById("userProfilePicture") as HTMLImageElement;
                         userProfilePicture.src = window.localStorage.getItem('userProfilePicture');
                         
                         this.singleton.commonToast('Successfully logged-in');
                         this.events.publish('user:logged-in');
                         this.navCtrl.setRoot(DashboardPage);
                    } else {
                         this.singleton.ajaxSuccessFailHandler(callback);
                    }
                    this.singleton.hideLoader();
                }, error => {
                    console.log("Oooops!"+JSON.stringify(error));
                    this.singleton.hideLoader();
                });
          }
           
      }
      
}

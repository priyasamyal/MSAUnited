import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SelectSearchable } from 'ionic-select-searchable';

import { FormBuilder, Validators, FormControl} from '@angular/forms';
import { Http } from '@angular/http';

import { LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';

import { SingletonService } from '../../services/singleton/singleton';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
     loginPage = LoginPage;
     
     data:any = {};
     
     signup;
     public phoneCode;
     public timeZone = "";
     
       firstname;
       lastname;
       contactnumber;
       timezone = {timezone_id: "", timezone_name: "Timezone", timezone_format: "", abbrevation: "", combined: "Timezone"};
       email;
       username;
       password;
       confirmpassword;
       diagnosis;
       userOption;
     
       phonecode: string = '236';     // set default '+1'
     
     constructor(public loadingCtrl: LoadingController, public formBuilder: FormBuilder, public http: Http, public singleton: SingletonService, public navCtrl: NavController) {
     
           this.firstname = '';
           this.lastname = '';
          
           this.contactnumber = '';
           this.email = '';
           this.username = '';
           this.password = '';
           this.confirmpassword = '';
           this.diagnosis = '';
           this.userOption = '';
           
           this.data.response = '';
           this.http = http;
          
           this.signup = formBuilder.group({
                  firstname: ['', Validators.compose([Validators.required])],
                  lastname: ['', Validators.compose([Validators.required])],
                  phonecode: ['', Validators.compose([Validators.required])],
                  contactnumber: ['', Validators.compose([Validators.required])],
                  timezone: ['', Validators.compose([Validators.required])],
                  email: ['', Validators.compose([Validators.required])],
                  username: ['', Validators.compose([Validators.required])],
                  password: ['', Validators.compose([Validators.required])],
                  confirmpassword: ['', Validators.compose([Validators.required])],
                  diagnosis: ['', Validators.compose([Validators.required])],
                  acceptConditions: [false, Validators.compose([CheckboxValidator.isChecked, Validators.required])],
                  userOption: [false, Validators.compose([Validators.required])]
           });
          
     }
     
    portChange(event: { component: SelectSearchable, value: any }) {
        console.log('value:', event.value);
        let item = event.value;
        this.timeZone = item.timezone_id;
    }
     
     back2Login(){
          this.navCtrl.pop();
     }
           
     signupFunc() {
      
          let firstname = this.singleton.noSpaceWithCharacterOnlyPattern.test(this.firstname);
          let lastname = this.singleton.noSpaceWithCharacterOnlyPattern.test(this.lastname);
          let contactnumber = this.singleton.mobileNumberOnlyPattern.test(this.contactnumber);
          let email = this.singleton.emailPattern.test(this.email);
          let username = this.singleton.noSpaceWithAlphanumericUnderscoreOnlyPattern.test(this.username);
          
         if(!this.singleton.networkCheck()) {
               this.singleton.doAlert('No Internet Connection', 'Sorry, no Internet connectivity detected. Please reconnect and try again.', 'OK');
         } else if(!this.userOption){
               this.singleton.commonToast('Please select user role.');
         } else if(!this.firstname){
               this.singleton.commonToast('Please enter first name.');
         } else if(!firstname){
               this.singleton.commonToast('Please enter first name without spaces.');
         } else if(!this.lastname){
               this.singleton.commonToast('Please enter last name.');
         } else if(!lastname){
               this.singleton.commonToast('Please enter last name without spaces.');
         } else if(!this.phonecode){
               this.singleton.commonToast('Please select phone code.');
         } else if(!contactnumber){
               this.singleton.commonToast('Please enter 10 digit phone number.');
         } else if(!this.timezone || !this.timeZone){
               this.singleton.commonToast('Please select timezone.');
         } else if(!this.email){
               this.singleton.commonToast('Please enter your email address.');
         } else if(!email){
               this.singleton.commonToast('Please enter valid email address.');
         } else if(!this.username){
               this.singleton.commonToast('Please enter username.');
         } else if(!username){
               this.singleton.commonToast('Username can be alphanumeric including underscore.');
         } else if(!this.password){
               this.singleton.commonToast('Please enter password.');
         } else if(this.password.length<6){
               this.singleton.commonToast('Password must contain minimum 6 characters.');
         } else if(!this.confirmpassword){
               this.singleton.commonToast('Please confirm your password.');
         } else if(this.password !== this.confirmpassword){
               this.singleton.commonToast('Password does not match.');
         } else if(!this.diagnosis){
               this.singleton.commonToast('Please enter diagnosis.');
         } else {
          
                this.singleton.showLoader();
              
//                var phonecodeId = this.singleton.getObjectBasedOnValueFunc(this.singleton.countriesArr, "phone_code", this.phonecode);
//                this.phoneCode = phonecodeId.country_id;

              console.log("TZ:"+this.timeZone);
              
                var myData = JSON.stringify({
                         user_type: this.userOption, 
                         first_name: this.firstname, 
                         last_name: this.lastname,
                         email: this.email,
                         username: this.username,
                         password: this.password,
                         timezone: this.timeZone,
                         phone_code: this.phonecode,
                         phone_number: this.contactnumber,
                         confirm_password: this.confirmpassword,
                         diagnosis: this.diagnosis
                    });
                    
                console.log("SIGNUP DATA:"+myData);     
                
                this.http.post(this.singleton.registerApi, myData)
                .subscribe(data => {
                    this.data.response = data["_body"]; 
                    var callback = JSON.parse(this.data.response);
                    console.log(JSON.stringify(this.data));

                    if(callback.meta.success){
                         this.singleton.commonToast('Successfully registered.');
                         this.back2Login();
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

export class CheckboxValidator{

  static isChecked(control: FormControl) : any{

    if(control.value != true){
      return {
        "notChecked" : true
      };
    }

    return null;
  }

}

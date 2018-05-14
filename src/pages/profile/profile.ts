import { Component } from '@angular/core';
import { NavController, Events, AlertController } from 'ionic-angular';
import { SelectSearchableModule } from 'ionic-select-searchable';

import { FormBuilder, Validators} from '@angular/forms';
import { Http } from '@angular/http';

import { SingletonService } from '../../services/singleton/singleton';

import { DashboardPage } from '../dashboard/dashboard';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
     
       data:any = {};
       profile;
       public phoneCode;
       public timeZone;
       
       firstname;
       lastname;
       phonecode;
       contactnumber;
       timezone;
       email;
       username;
       diagnosis;
       userOption;
       
  
       constructor(public navCtrl: NavController, public http: Http, public singleton: SingletonService, public events: Events, public formBuilder: FormBuilder, public alertCtrl: AlertController) {
          
           this.firstname = '';
           this.lastname = '';
           this.contactnumber = '';
           this.email = '';
           this.username = '';
           this.diagnosis = '';
          
           this.http = http;

           events.publish('user:logged-in');
          
           this.profile = formBuilder.group({
                  firstname: ['', Validators.compose([Validators.required])],
                  lastname: ['', Validators.compose([Validators.required])],
                  phonecode: ['', Validators.compose([Validators.required])],
                  contactnumber: ['', Validators.compose([Validators.required])],
                  timezone: ['', Validators.compose([Validators.required])],
                  email: ['', ''],
                  username: ['', ''],
                  diagnosis: ['', Validators.compose([Validators.required])],
                  userOption: [false, Validators.compose([Validators.required])]
           });
           
       }
  
     // Function created
     ngOnInit(){
           this.getProfileFunc();  //function called
     }
     
     portChange(event: { component: SelectSearchableModule, value: any }) {
        console.log('value:', event.value);
        let item = event.value;
        this.timeZone = item.timezone_id;
     }
     
     getProfileFunc(){
          
          if(!this.singleton.networkCheck()) {
               this.singleton.doAlert('No Internet Connection', 'Sorry, no Internet connectivity detected. Please reconnect and try again.', 'OK');
          } else {          
     
               this.singleton.showLoader();
               this.http.get(this.singleton.userProfileApi)
                                    .subscribe(data => {
                                        this.data.response = data["_body"]; 
                                        var callback = JSON.parse(this.data.response);
                                        console.log(JSON.stringify(callback));

                                        if(callback.meta.success){

                                             var userDetail = callback.data.user_detail;

                                             this.firstname = userDetail.first_name;
                                             this.lastname = userDetail.last_name;

                                             var phoneCodeObj = this.singleton.getObjectBasedOnValueFunc(this.singleton.countriesArr, "country_id", userDetail.phone_code);
                                             console.log(phoneCodeObj.phone_code);

                                             this.phonecode = userDetail.phone_code;
                                             this.contactnumber = userDetail.phone_number;

                                             var index = this.singleton.timezoneArr.findIndex(x => x.timezone_id == userDetail.timezone_id);
                                             this.timezone = this.singleton.timezoneArr[index];

                                             this.email = userDetail.email;
                                             this.username = userDetail.username;
                                             this.diagnosis = userDetail.diagnosis;
                                             
                                             this.userOption = userDetail.user_type;

                                        } else {
                                             this.singleton.ajaxSuccessFailHandler(callback);
                                        }

                                        try{
                                             this.singleton.hideLoader();
                                        } catch(err){}
                                        
                                    }, error => {
                                        console.log("Oooops!"+JSON.stringify(error));
                                        this.singleton.hideLoader();
                                    });
          }
     }   
     
     
     updateProfileFunc(){

          let firstname = this.singleton.noSpaceWithCharacterOnlyPattern.test(this.firstname);
          let lastname = this.singleton.noSpaceWithCharacterOnlyPattern.test(this.lastname);
          let contactnumber = this.singleton.mobileNumberOnlyPattern.test(this.contactnumber);
          
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
         } else if(!this.timezone){
               this.singleton.commonToast('Please select timezone.');
         } else if(!this.diagnosis){
               this.singleton.commonToast('Please enter diagnosis.');
         } else {

               this.singleton.showLoader();
               
//               var timezoneObj = this.singleton.getObjectBasedOnValueFunc(this.singleton.timezoneArr, "timezone_name", this.timezone.split(') ')[1]);
               
//               var phonecodeObj = this.singleton.getObjectBasedOnValueFunc(this.singleton.countriesArr, "phone_code", this.phonecode);
               
               var myData = JSON.stringify({
                         user_type: this.userOption, 
                         first_name: this.firstname, 
                         last_name: this.lastname,
                         timezone_id: this.timezone.timezone_id,
                         phone_code: this.phonecode,
                         phone_number: this.contactnumber,
                         diagnosis: this.diagnosis
               });
                    
               this.http.post(this.singleton.userProfileApi, myData)
                                    .subscribe(data => {
                                        this.data.response = data["_body"]; 
                                        var callback = JSON.parse(this.data.response);
                                        console.log(JSON.stringify(callback));

                                        if(callback.meta.success){
                                            this.singleton.commonToast(callback.data.message);
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
     
     
      doChangePassword() {
         let prompt = this.alertCtrl.create({
           title: 'Change Password',

           inputs: [
             {
               name: 'current_password',
               placeholder: 'Old Password'
             },
             {
               name: 'new_password',
               placeholder: 'New Password',
               type: 'password'
             },
             {
               name: 'confirm_password',
               placeholder: 'Confirm Password',
               type: 'password'
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
                  console.log("VALUE:" + JSON.stringify(data));
                  
                  if(!this.singleton.networkCheck()) {
                         this.singleton.doAlert('No Internet Connection', 'Sorry, no Internet connectivity detected. Please reconnect and try again.', 'OK');
                         return false;
                  } else if (!data.current_password) {
                         this.singleton.commonToast('Please enter old password');
                         return false;
                  } else if (!data.new_password) {
                         this.singleton.commonToast('Please enter new password');
                         return false;
                  } else if(data.new_password.length<6){
                         this.singleton.commonToast('Password must contain minimum 6 characters.');
                         return false;
                  } else if (!data.confirm_password) {
                         this.singleton.commonToast('Please enter confirm password');
                         return false;
                  } else if (data.new_password !== data.confirm_password) {
                         this.singleton.commonToast('Confirmation password does not match');
                         return false;
                  } else {
                  
                         this.singleton.showLoader();
                         var myData = JSON.stringify(data);
                            
                         this.http.post(this.singleton.changePasswordApi, myData)
                               .subscribe(data => {
                                   this.data.response = data["_body"]; 
                                   var callback = JSON.parse(this.data.response);
                                   console.log(JSON.stringify(callback));

                                    if(callback.meta.success){
                                         this.singleton.commonToast('Password changed successfully.');
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
       
}

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { AppointmentPage } from '../appointments/appointments';

import { Http } from '@angular/http';

import { SingletonService } from '../../services/singleton/singleton';

@Component({
  selector: 'page-home',
  templateUrl: 'rsvp.html'
})

export class RsvpPage {
     data:any = {};
     
     constructor(public navCtrl: NavController, public http: Http, public singleton: SingletonService) {
          this.http = http;
     }
     
     rsvpFunc(sessionId){
     
          if(!this.singleton.networkCheck()) {
               this.singleton.doAlert('No Internet Connection', 'Sorry, no Internet connectivity detected. Please reconnect and try again.', 'OK');
          } else if(window.localStorage.getItem('logged') == 'true'){
               this.singleton.showLoader();
               
               var myData = JSON.stringify({
                         session_id: sessionId
               });
                    
               this.http.post(this.singleton.rsvpApi, myData)
                                    .subscribe(data => {
                                        this.data.response = data["_body"]; 
                                        var callback = JSON.parse(this.data.response);
                                        console.log(JSON.stringify(callback));

                                        this.singleton.hideLoader();
                                        if(callback.meta.success){
                                            this.singleton.commonToast(callback.data.message);
                                            this.rsvpConfirmationFunc(callback.data.rsvp_set);
                                        } else {
                                             this.singleton.ajaxSuccessFailHandler(callback);
                                        }
                                       
                                    }, error => {
                                        console.log("Oooops!"+JSON.stringify(error));
                                        this.singleton.hideLoader();
                                    });
          } else {
               this.navCtrl.push(LoginPage);
          }

     }
     
     rsvpConfirmationFunc(rsvpId){

          if(!this.singleton.networkCheck()) {
               this.singleton.doAlert('No Internet Connection', 'Sorry, no Internet connectivity detected. Please reconnect and try again.', 'OK');
          } else {
               
               this.singleton.showLoader();
               
               this.http.get(this.singleton.rsvpApi+rsvpId)
                                    .subscribe(data => {
                                        this.data.response = data["_body"]; 
                                        var callback = JSON.parse(this.data.response);
                                        console.log(JSON.stringify(callback));

                                        this.singleton.hideLoader();
                                        if(callback.meta.success){
                                            //this.singleton.doAlert("Congratulations", "Your session has been confirmed on "+callback.data.session.date_time, "Ok");
                                            this.navCtrl.setRoot(AppointmentPage);
                                        } else {
                                             this.singleton.ajaxSuccessFailHandler(callback);
                                        }
                                    }, error => {
                                        console.log("Oooops!"+JSON.stringify(error));
                                        this.singleton.hideLoader();
                                    });
          }
                                    
     }

}



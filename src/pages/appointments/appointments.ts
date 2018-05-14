import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { SingletonService } from '../../services/singleton/singleton';

import { DashboardPage } from '../dashboard/dashboard';


@Component({
  selector: 'page-appt',
  templateUrl: 'appointments.html'
})

export class AppointmentPage {

  appts: string;
  
  data:any = {};
  
  public upcomingSessionList = [];
  public completedSessionList = [];
     
  public tempSessionId; 
     
  public countdownModal = false;
  public startChatBtn = false;
  public myIntervalSub;
     

  constructor(public navCtrl: NavController, public http: Http, public singleton: SingletonService) {
     this.http = http;
     this.data.response = '';
  }

     // Function created
     ngOnInit(){
           this.getUpcomingAppointmentsListFunc();
     }
     
     getUpcomingAppointmentsListFunc(){
     
          if(!this.singleton.networkCheck()) {
               this.singleton.doAlert('No Internet Connection', 'Sorry, no Internet connectivity detected. Please reconnect and try again.', 'OK');
          } else {          
     
               this.singleton.showLoader();
               this.http.get(this.singleton.upcomingAppoinmentsListApi)
                                    .subscribe(data => {
                                        this.data.response = data["_body"]; 
                                        var callback = JSON.parse(this.data.response);
                                        console.log(JSON.stringify(callback));

                                        this.singleton.hideLoader();
                                        if(callback.meta.success){

                                            this.upcomingSessionList = callback.data.upcoming_sessions;

                                            if(typeof callback.data.upcoming_sessions == 'string'){
                                                  this.upcomingSessionList = [];
                                            }

                                            this.appts = "upcoming";

                                        } else {
                                             this.singleton.ajaxSuccessFailHandler(callback);
                                        }

                                    }, error => {
                                        console.log("Oooops!"+JSON.stringify(error));
                                        this.singleton.hideLoader();
                                    });
          }
      }
      
      getPastAppointmentsListFunc(){
           
          if(!this.singleton.networkCheck()) {
               this.singleton.doAlert('No Internet Connection', 'Sorry, no Internet connectivity detected. Please reconnect and try again.', 'OK');
          } else {           
     
               this.singleton.showLoader();
               this.http.get(this.singleton.pastAppoinmentsListApi)
                                    .subscribe(data => {
                                        this.data.response = data["_body"]; 
                                        var callback = JSON.parse(this.data.response);
                                        console.log(JSON.stringify(callback));

                                        this.singleton.hideLoader();
                                        if(callback.meta.success){

                                            this.completedSessionList = callback.data.past_sessions;

                                            if(typeof callback.data.past_sessions == 'string'){
                                                  this.completedSessionList = [];
                                            }

                                        } else {
                                             this.singleton.ajaxSuccessFailHandler(callback);
                                        }

                                    }, error => {
                                        console.log("Oooops!"+JSON.stringify(error));
                                        this.singleton.hideLoader();
                                    });
          }
      }
      
      joinChatFunc(sessionId){
           
          if(!this.singleton.networkCheck()) {
               this.singleton.doAlert('No Internet Connection', 'Sorry, no Internet connectivity detected. Please reconnect and try again.', 'OK');
          } else {           
           
                if(sessionId == 'empty'){
                   sessionId = this.tempSessionId;
                }

               var myData = JSON.stringify({
                   device: "mobile",
                   session_id: sessionId
               });

               console.log("myData:"+myData);

               this.singleton.showLoader();
               this.http.post(this.singleton.sessionDetailApi, myData)
                                    .subscribe(data => {
                                        this.data.response = data["_body"]; 
                                        var callback = JSON.parse(this.data.response);
                                        console.log(JSON.stringify(callback));

                                        if(callback.meta.success){
                                             if(callback.data.session_detail.api_key == ""){
                                                  try{
                                                       this.hideModal();
                                                  } catch(err){}

                                                  this.tempSessionId = sessionId;    // use for later

                                                  var years = parseInt(callback.data.timer.years);
                                                  var months = parseInt(callback.data.timer.months);
                                                  var days = parseInt(callback.data.timer.days);
                                                  var hours = parseInt(callback.data.timer.hours);
                                                  var minutes = parseInt(callback.data.timer.minutes);
                                                  var seconds = parseInt(callback.data.timer.seconds);

                                                  var secondsOnly = (minutes * 60) + seconds;

                                                  var dateTime = callback.data.session_detail.date_time;

                                                  console.log("DATA:"+years+"|"+months+"|"+days+"|"+hours);
                                                  if(years < 1 && months < 1 && days < 1 && hours < 1){
                                                       console.log("IF:"+minutes+"|"+seconds);
                                                       this.startTimer(secondsOnly, dateTime);
                                                  } else {
                                                       this.singleton.hideLoader();
                                                       this.singleton.doAlert('', "Chat is scheduled on " + callback.data.session_detail.date_time, 'Ok');
                                                  }

                                             } else {

                                                  this.singleton.hideLoader();

                                                  var userDetailJSON = callback.data.user_detail;
                                                  var sessionDetailJSON = callback.data.session_detail;
                                                  
                                                  (window as any).session(this.singleton.domain, sessionDetailJSON.session_id, sessionDetailJSON.api_key, sessionDetailJSON.tokbox_session_id, sessionDetailJSON.token, callback.data.timer_duration, callback.data.is_moderator, userDetailJSON.user_id, userDetailJSON.username, callback.data.session_detail.is_moderator_in_session, callback.data.publish_audio, callback.data.publish_video, callback.data.all_audio_status);

                                                  if(callback.data.is_moderator == '1'){
                                                     this.setModeratorFunc(sessionId);
                                                  }
                                                  this.navCtrl.setRoot(DashboardPage);
                                             }
                                        } else {
                                             this.singleton.hideLoader();

                                             this.singleton.ajaxSuccessFailHandler(callback);
                                        }

                                    }, error => {
                                        console.log("Oooops!"+JSON.stringify(error));
                                        this.singleton.hideLoader();
                                    });
          }
      }
     
     setModeratorFunc(sessionId){
           
               var myData = JSON.stringify({
                   session_id: sessionId
               });

               console.log("myData:"+myData);

               this.singleton.showLoader();
               this.http.post(this.singleton.sessionDetailApi, myData)
                                    .subscribe(data => {
                                        this.data.response = data["_body"]; 
                                        var callback = JSON.parse(this.data.response);
                                        console.log(JSON.stringify(callback));

                                        if(callback.meta.success){
                                             
                                        } else {
                                             this.singleton.hideLoader();

                                             this.singleton.ajaxSuccessFailHandler(callback);
                                        }

                                    }, error => {
                                        console.log("Oooops!"+JSON.stringify(error));
                                        this.singleton.hideLoader();
                                    });
      }
     
     startTimer(secondsOnly, dateTime) {
        this.countdownModal = true;
          
        var timer = secondsOnly;
        var minutes;
        var seconds;

        setTimeout(function(){
               document.getElementById("startAt").textContent = "Your session will start at " + dateTime;
        }, 1000);
          
        this.myIntervalSub = Observable.interval(1000).subscribe(val => {
            minutes = Math.floor(timer / 60);
            seconds = Math.floor(timer % 60);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            document.getElementById("minutes").textContent = minutes;
            document.getElementById("seconds").textContent = seconds;
             
            this.singleton.hideLoader();

            --timer;
            if (timer < 0) {
                 console.log('timeup');
                 document.getElementById("minutes").textContent = "00";
                 document.getElementById("seconds").textContent = "00";
                 this.myIntervalSub.unsubscribe();
                 
                 this.joinChatFunc('empty');
//                 this.startChatBtn = true;
            }
             
         });
    }
     
      showModal(secondsOnly, dateTime) {
        this.countdownModal = true;
        this.startTimer(secondsOnly, dateTime);
     }
     
     hideModal() {
        document.getElementById("minutes").textContent = "00";
                 document.getElementById("seconds").textContent = "00";
          this.countdownModal = false;
          try{
               this.myIntervalSub.unsubscribe();
          } catch(err){}
        
     }
      
}



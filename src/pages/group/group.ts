import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RsvpPage } from '../rsvp/rsvp';

import { Http } from '@angular/http';

import { SingletonService } from '../../services/singleton/singleton';

@Component({
  selector: 'page-home',
  templateUrl: 'group.html'
})


export class GroupPage {

     rsvpPage = RsvpPage;
     data:any = {};
     
     constructor(public navCtrl: NavController, public http: Http, public singleton: SingletonService) {
          this.http = http;
     }
     
     getSessionListApiFunc(groupItem){
          
          console.log("groupId:"+JSON.stringify(groupItem));
          
          var counts = 0;
          groupItem.sessions.forEach(function(sess) { 
               if(sess.is_participant == 0){
                    counts++;
               } 
          });
          
          if(counts > 0){
               this.singleton.selectedGroupName = groupItem.group_name;
               this.singleton.sessionListArr = groupItem.sessions;
               this.navCtrl.push(RsvpPage);
          } else {
               this.singleton.commonToast("Session has not been created yet in this Group.");
          }
                                        
      }
      
}



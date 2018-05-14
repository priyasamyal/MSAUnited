import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { RsvpPage } from '../rsvp/rsvp';
import { GroupPage } from '../group/group';

import { Http } from '@angular/http';

import { SingletonService } from '../../services/singleton/singleton';

@Component({
  selector: 'page-home',
  templateUrl: 'region.html'
})


export class RegionPage {

     rsvpPage = RsvpPage;
     data:any = {};
     
     constructor(public navCtrl: NavController, public http: Http, public singleton: SingletonService) {
          this.http = http;
     }
     
     getGroupListApiFunc(regionId){
          
          if(!this.singleton.networkCheck()) {
               this.singleton.doAlert('No Internet Connection', 'Sorry, no Internet connectivity detected. Please reconnect and try again.', 'OK');
          } else {          
          
               var myData = JSON.stringify({
                   region_id: regionId,
                   user_id: window.localStorage.getItem('userId')
               });
               console.log(myData);

               this.singleton.showLoader();
               this.http.post(this.singleton.sessionListApi, myData)
                                    .subscribe(data => {
                                        this.data.response = data["_body"]; 
                                        var callback = JSON.parse(this.data.response);
                                        console.log(JSON.stringify(callback));

                                        this.singleton.hideLoader();
                                        if(callback.meta.success){

                                            this.singleton.currentRegionDetail = callback.data.region_detail;
                                            this.singleton.currentGroupDetail = callback.data.groups;

                                             /*for (let key in callback.data.sessions) {
                                                 let value = myDictionary[key];
                                                 // Use `key` and `value`
                                             }*/

                                             if(callback.data.groups.length > 0){
                                                  this.navCtrl.push(GroupPage);
                                             } else {
                                                  this.singleton.commonToast("Group has not been created yet in this Region.");
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
      
      
      toggleChange(cont){
          if (cont.modal == "close") {
               for(var index = 0; index < this.singleton.continentArr.length; ++index)
                   this.singleton.continentArr[index].modal = "close";
                   cont.modal = "open";
           } else {
             cont.modal = "close";
           }
      }
     
}



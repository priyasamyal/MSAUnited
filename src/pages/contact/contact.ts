import { Component } from '@angular/core';
import { NavController,MenuController } from 'ionic-angular';
import { Http } from '@angular/http';
import { FormBuilder, Validators} from '@angular/forms';

import { SingletonService } from '../../services/singleton/singleton';

@Component({
  selector: 'page-home',
  templateUrl: 'contact.html'
})
export class ContactPage {

     data:any = {};
     
     email;
     subscribeNewsletter;
     
  constructor(public menuCtrl:MenuController, public navCtrl: NavController, public singleton: SingletonService, public http: Http, public formBuilder: FormBuilder) {
       
       this.email = '';
       
       this.data.response = '';
       this.http = http;
       
       this.subscribeNewsletter = formBuilder.group({
            email: ['', Validators.compose([Validators.required])]
       });
  }

 
     
     subscribeFunc() {
          
          let email = this.singleton.emailPattern.test(this.email);

          if(!this.singleton.networkCheck()) {
               this.singleton.doAlert('No Internet Connection', 'Sorry, no Internet connectivity detected. Please reconnect and try again.', 'OK');
          } else if(!this.email) {
               this.singleton.commonToast('Please enter email address');
          } else if(!email){
               this.singleton.commonToast('Please enter valid email address.');
          } else {
          
                this.singleton.showLoader();

                var myData = JSON.stringify({subscribe_mail: this.email});
              
                console.log("DATA:" + myData);
                
                this.http.post(this.singleton.newsletterSubscriptionApi, myData)
                .subscribe(data => {
                    this.data.response = data["_body"]; 
                    var callback = JSON.parse(this.data.response);
                    console.log(JSON.stringify(this.data));

                    if(callback.meta.success){
                         this.email = '';
                         this.singleton.commonToast('You have successfully subscribed to our newsletter.');
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
     
     downloadableHubsFunc(fileName){
          var url = this.singleton.webDomain + "assets/pdf/" + fileName + ".pdf";
          this.singleton.launch(url);
     }

}

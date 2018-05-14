import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Storage} from '@ionic/storage';

@Injectable()
export class Localstorage {

  constructor(public http: Http, private storage: Storage) {
    //console.log('Hello Localstorage Provider');
    }
    
    setLoggedIn(status: boolean){
          this.storage.set('logged', status);
    }
    
    getLoggedIn(){
          this.storage.get('logged').then(val=>{
    		console.log('Logged: ' + val);
    	  });
    }
    

    //store the email address
    setEmail(email){
          this.storage.set('email', 'ajay@geo');
    }

    //get the stored email
    getEmail(){
    	this.storage.get('email').then(email=>{
    		console.log('email: ' + email);
    	});
    }

    //delete the email address
    removeEmail(){
    this.storage.remove('email').then(()=>{
    		console.log('email is removed');
    	});
    }

    //clear the whole local storage
    clearStorage(){
    	this.storage.clear().then(()=>{
		console.log('all keys are cleared');
    	});
    }

}
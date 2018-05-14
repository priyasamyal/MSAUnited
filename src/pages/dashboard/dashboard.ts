import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

import { AppointmentPage } from '../appointments/appointments';
import { RegionPage } from '../region/region';
import { ProfilePage } from '../profile/profile';

import { SingletonService } from '../../services/singleton/singleton';


@Component({
  selector: 'page-home',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {
  appointmentPage = AppointmentPage;
  regionPage = RegionPage;
  profilePage = ProfilePage;
  
  constructor(public navCtrl: NavController, public singleton: SingletonService, public events: Events) {
     
  }
  
  dashboardButtonClick(pageName: string){
     if(pageName == 'region'){
          this.navCtrl.push(RegionPage);
     } else if(pageName == 'calendar'){
          this.navCtrl.push(AppointmentPage);
     } else if(pageName == 'profile'){
          this.navCtrl.push(ProfilePage);
     }
  }
     
     ngOnInit(){
          this.singleton.hideLoader();
     }
  
}

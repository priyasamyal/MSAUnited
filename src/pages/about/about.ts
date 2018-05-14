import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SingletonService } from '../../services/singleton/singleton';

@Component({
  selector: 'page-home',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController, public singleton: SingletonService) {

  }

}

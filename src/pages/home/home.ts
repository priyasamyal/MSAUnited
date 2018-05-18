import {Component} from '@angular/core';
import {NavController, Events} from 'ionic-angular';

import {Localstorage} from '../../services/storage/localstorage';
import {SingletonService} from '../../services/singleton/singleton';

import {AboutPage} from '../about/about';
import {LoginPage} from '../login/login';
import {RegionPage} from '../region/region';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  aboutPage = AboutPage;

  public edited = true;
  public modalEdited = false;

  constructor(
    public events: Events,
    public navCtrl: NavController,
    public localstorage: Localstorage,
    public singleton: SingletonService
  ) {
    // login check
    if (window.localStorage.getItem('logged') == 'true') {
      this.edited = false;
    } else {
      this.edited = true;
    }
  }

  openLoginPage() {
    // (window as any).session(
    //   this.singleton.domain,
    //   'sessionDetailJSON.session_id',
    //   'sessionDetailJSON.api_key',
    //   'sessionDetailJSON.tokbox_session_id',
    //   'sessionDetailJSON.token',
    //   'callback.data.timer_duration',
    //   'callback.data.is_moderator',
    //   'userDetailJSON.user_id',
    //   'userDetailJSON.username',
    //   'callback.data.session_detail.is_moderator_in_session',
    //   'callback.data.publish_audio',
    //   'callback.data.publish_video',
    //   'callback.data.all_audio_status'
    // );
    this.navCtrl.push(LoginPage);
  }

  openRegionPage() {
    this.navCtrl.push(RegionPage);
  }

  //for show modal
  showModal() {
    this.modalEdited = true;
  }

  //for hide modal
  hideModal() {
    this.modalEdited = false;
  }
}

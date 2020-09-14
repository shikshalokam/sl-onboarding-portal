import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { environment } from 'src/environments/environment';
import {TranslateModule, TranslateLoader, TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'sl-angular-basic';
  userDetails: any = '';
  menudata: any[];
  appName: string = environment.appName;

  constructor(private Keycloak: KeycloakService, public translate: TranslateService){
    // translate.addLangs(['en', 'od']);
    // translate.setDefaultLang('en');
  }

  selectedMenu(data){
  
  }
  ngOnInit(){
    const user = this.Keycloak.getKeycloakInstance();
    this.userDetails = user['profile'];
  }

  logoutMethod(){
    this.Keycloak.logout();
  //  this.Keycloak.logout(environment.portal_name).then();
  }

  changeLanguage(data){

  }

  
}



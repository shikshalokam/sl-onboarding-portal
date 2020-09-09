import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KeycloakAngularModule } from 'keycloak-angular';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { initializer } from './keycloak.init';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PortalCoreModule } from './modules/portal-core/portal-core.module';
import { PortalSharedModule } from './modules/portal-shared/portal-shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import {TranslateModule, TranslateLoader, TranslateService} from "@ngx-translate/core";
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { OnboardComponent } from './onboard/onboard.component';
import { LoaderComponent } from './loader/loader.component';
import { SelectEntityModalComponent } from './select-entity-modal/select-entity-modal.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


@NgModule({
  declarations: [
    AppComponent,
    OnboardComponent,
    LoaderComponent,
    SelectEntityModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    KeycloakAngularModule,
    PortalCoreModule,
    PortalSharedModule,
    MatMenuModule,
    MatInputModule,
    MatFormFieldModule,
    TranslateModule.forChild(),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    })  
  ],
  entryComponents: [
    AppComponent
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      multi: true,
      deps: [KeycloakService]
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


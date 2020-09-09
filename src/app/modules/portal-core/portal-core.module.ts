import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { HeadersComponent } from './components/headers/headers.component';
// import { FooterComponent } from './components/footer/footer.component';
// import { PageLayoutComponent } from './components/page-layout/page-layout.component';
import { PortalSharedModule }from '../portal-shared/portal-shared.module';
import { Interceptor } from './interceptor/interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PortalSharedModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS,
     useClass: Interceptor, multi: true }
],
  exports: []
})
export class PortalCoreModule { }

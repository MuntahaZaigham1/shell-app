import { NgModule } from '@angular/core';
import { SharedServiceComponent } from './shared-service.component';
import { SharedNavigationService } from './shared-navigation.service';
import { SharedAuthenticationService } from './shared-authentication.service';
import { SharedService } from './shared-service.service';



@NgModule({
  declarations: [
    SharedServiceComponent
  ],
  imports: [
  ],
  exports: [
    SharedServiceComponent
  ],
  providers: [SharedNavigationService, SharedAuthenticationService, SharedService]
})
export class SharedServiceModule { }

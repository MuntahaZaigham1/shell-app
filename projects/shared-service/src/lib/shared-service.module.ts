import { NgModule } from '@angular/core';
import { SharedServiceComponent } from './shared-service.component';
import { SharedNavigationService } from './shared-navigation.service';
import { SharedAuthenticationService } from './shared-authentication.service';



@NgModule({
  declarations: [
    SharedServiceComponent
  ],
  imports: [
  ],
  exports: [
    SharedServiceComponent
  ],
  providers: [SharedNavigationService, SharedAuthenticationService]
})
export class SharedServiceModule { }

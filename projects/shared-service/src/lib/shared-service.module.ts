import { NgModule } from '@angular/core';
import { SharedServiceComponent } from './shared-service.component';
import { SharedNavigationService } from './shared-navigation.service';



@NgModule({
  declarations: [
    SharedServiceComponent
  ],
  imports: [
  ],
  exports: [
    SharedServiceComponent
  ],
  providers: [SharedNavigationService]
})
export class SharedServiceModule { }

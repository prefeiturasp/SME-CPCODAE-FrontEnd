import { NgModule } from '@angular/core';

import { CoreModule } from '../_modules/core.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { NavigationModule } from '../navigation/navigation.module';
import { PublicRoutingModule } from './public-routing.module';

import { DashboardService } from './dashboard/dashboard.service';

import { PublicComponent } from './public.component';
import { MessagePageComponent } from './message-page/message-page.component';

@NgModule({
  declarations: [
    MessagePageComponent,
    PublicComponent
  ],
  imports: [
    CoreModule,
    
    DashboardModule,
    PublicRoutingModule,
    NavigationModule
  ],
  providers: [
    DashboardService
  ],
  bootstrap: [ ],
})
export class PublicModule {}

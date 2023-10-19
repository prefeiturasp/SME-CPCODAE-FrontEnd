import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CircleProgressComponent } from "./circle-progress/circle-progress.component";
import { GridViewComponent } from "./grid-view/grid-view.component";
import { PaginationComponent } from "./pagination/pagination.component";
import { PublicCallAttachmentModalComponent } from "./public-call-attachment-modal/public-call-attachment-modal.component";
import { PublicCallAttachmentCardHeaderComponent } from "./public-call-attachment-modal/card-header/attachment-card-header.component";
import { PublicCallCommentsModalComponent } from "./public-call-comments-modal/public-call-comments-modal.component";
import { PublicCallDashboardCardComponent } from "./public-call-dashboard-card/public-call-dashboard-card.component";
import { PublicCallDashboardComponent } from "./public-call-dashboard/public-call-dashboard.component";
import { PublicCallDeliveryComponent } from "./public-call-delivery/public-call-delivery.component";
import { PublicCallDeliveryModalComponent } from "./public-call-delivery/modal/public-call-delivery-modal.component";
import { PublicCallDeliveryTimelineComponent } from "./public-call-delivery-timeline/public-call-delivery-timeline.component";
import { PublicCallDetailHeaderComponent } from "./public-call-detail-header/public-call-detail-header.component";
import { PublicCallStatusComponent } from "./public-call-status/public-call-status.component";

import { MenuService } from "../navigation/menu/menu.service";

import { CoreModule } from "../_modules/core.module";

@NgModule({
    declarations: [
        CircleProgressComponent,
        GridViewComponent,
        PaginationComponent,
        PublicCallAttachmentModalComponent,
        PublicCallAttachmentCardHeaderComponent,
        PublicCallCommentsModalComponent,
        PublicCallDashboardCardComponent,
        PublicCallDashboardComponent,
        PublicCallDetailHeaderComponent,
        PublicCallDeliveryComponent,
        PublicCallDeliveryModalComponent,
        PublicCallDeliveryTimelineComponent,
        PublicCallStatusComponent
    ],
    imports: [
        CommonModule,
        FontAwesomeModule,
        FormsModule,
        RouterModule,
        NgbModule,

        CoreModule
    ],
    exports: [
        CircleProgressComponent,
        GridViewComponent,
        PaginationComponent,
        PublicCallAttachmentModalComponent,
        PublicCallAttachmentCardHeaderComponent,
        PublicCallCommentsModalComponent,
        PublicCallDashboardCardComponent,
        PublicCallDashboardComponent,
        PublicCallDeliveryComponent,
        PublicCallDeliveryModalComponent,
        PublicCallDeliveryTimelineComponent,
        PublicCallDetailHeaderComponent,
        PublicCallStatusComponent
    ],
    providers: [
        MenuService
    ]
})
export class ComponentsModule { }
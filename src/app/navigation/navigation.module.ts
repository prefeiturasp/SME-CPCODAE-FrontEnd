import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AcessoNegadoComponent } from './acesso-negado/acesso-negado.component';
import { MenuComponent } from './menu/menu.component';
import { MenuSidebarAdminComponent } from "./menu-sidebar/admin/menu-sidebar-admin/menu-sidebar-admin.component";
import { MenuSidebarCooperativeComponent } from "./menu-sidebar/cooperative/menu-sidebar-cooperative/menu-sidebar-cooperative.component";
import { MenuSidebarLogisticComponent } from "./menu-sidebar/logistic/menu-sidebar-logistic/menu-sidebar-logistic.component";
import { FooterComponent } from './footer/footer.component';
import { NotFoundComponent } from './not-found/not-found.component';

import { MenuService } from "./menu/menu.service";

@NgModule({
    declarations: [
        MenuComponent,
        MenuSidebarAdminComponent,
        MenuSidebarCooperativeComponent,
        MenuSidebarLogisticComponent,
        FooterComponent,
        NotFoundComponent,
        AcessoNegadoComponent
    ],
    imports: [
        CommonModule,
        FontAwesomeModule,
        FormsModule,
        RouterModule,
        NgbModule
    ],
    exports: [
        MenuComponent,
        MenuSidebarAdminComponent,
        MenuSidebarCooperativeComponent,
        MenuSidebarLogisticComponent,
        FooterComponent,
        NotFoundComponent,
        AcessoNegadoComponent
    ],
    providers: [
        MenuService
    ]
})
export class NavigationModule { }
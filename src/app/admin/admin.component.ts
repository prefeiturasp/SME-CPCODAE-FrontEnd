import { Component } from '@angular/core';

@Component({ selector: 'app-root', template: 
`
    <app-menu-sidebar-admin></app-menu-sidebar-admin>
    <app-menu></app-menu>
    <div class="container-fluid page-body-wrapper full-body-wrapper full-page-wrapper" style="transition: all 0.3s;">
        <ngx-spinner size="medium" color="#fff" type="ball-beat"></ngx-spinner>
        <div class="main-panel">
            <div class="content-wrapper">
                <div class="row">
                    <div class="col">
                        <div class="card text-center">
                            <router-outlet></router-outlet>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <app-footer></app-footer>
` })
export class AdminComponent
{}

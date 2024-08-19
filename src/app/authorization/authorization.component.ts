import { Component } from '@angular/core';

@Component({ selector: 'app-root', template: 
`
    <app-menu-sidebar-admin></app-menu-sidebar-admin>
    <app-menu-sidebar-cooperative></app-menu-sidebar-cooperative>
    <app-menu-sidebar-logistic></app-menu-sidebar-logistic>
    <app-menu></app-menu>
    <div class="container-fluid page-body-wrapper full-body-wrapper full-page-wrapper">
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
export class AuthorizationComponent
{}

import { Component, Input, OnInit } from '@angular/core';

@Component({ selector: 'app-cooperative-registration-completion-step2-view', templateUrl: './registration-completion-step2-view.component.html', styleUrls: ['./registration-completion-step2-view.component.scss'] })
export class CooperativeRegistrationCompletionStep2ViewComponent implements OnInit {
  @Input() pdfSrc: string = '';

  constructor() { 
  }

  ngOnInit(): void {
  }
}
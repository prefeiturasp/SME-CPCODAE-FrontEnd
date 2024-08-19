import { Component, Input, OnInit } from '@angular/core';

@Component({ selector: 'app-cooperative-proposal-upload-members-error', templateUrl: './proposal-upload-members-error.component.html', styleUrls: ['./proposal-upload-members-error.component.scss'] })
export class ProposalUploadMembersErrorComponent implements OnInit {
    @Input() errors: any[] = [];
    @Input() modal: any;

    constructor() { }

    ngOnInit(): void { }
}

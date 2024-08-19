import { Component, Input, OnInit } from '@angular/core';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({ selector: 'app-circle-progress', templateUrl: './circle-progress.component.html', styleUrls: ['./circle-progress.component.scss'] })
export class CircleProgressComponent implements OnInit {
    @Input() percentage: number = 0;
    @Input() color_class: string = 'red';
    @Input() showPercentage: boolean = true;

    public progressDegree: string = '0deg';

    ngOnInit(): void {
        this.progressDegree = `${ this.percentage * 360.0 / 100 }deg`;
    }
}

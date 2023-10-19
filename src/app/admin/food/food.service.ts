import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SMEFood } from 'src/app/_models/food.model';

import { SettingsService } from 'src/app/_services/settings.service';

@Injectable({ providedIn: 'root', })
export class AdminFoodService {
    private domain: string = 'alimento';

    constructor(private settingsService: SettingsService) { }

    add(food: SMEFood) {
        const body = { category_id: food.category_id, name: food.name, measure_unit: food.measure_unit };
        return this.settingsService.executePost(this.domain, body);
    }

    delete(id: string): Observable<any> {
        const url = `${this.domain}/${id}`;
        return this.settingsService.executeDelete(url);
    }

    get(id: string): Observable<any> {
        const url = `${this.domain}/${id}`;
        return this.settingsService.executeGet(url);
    }

    getAll(): Observable<any> {
        return this.settingsService.executeGet(this.domain);
    }

    update(food: SMEFood) {
        const body = {
            id: food.id,
            category_id: food.category_id,
            name: food.name,
            measure_unit: food.measure_unit,
            is_active: food.is_active
        };
        return this.settingsService.executePut(this.domain, body);
    }
}

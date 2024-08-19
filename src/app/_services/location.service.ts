import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Address, City, State } from '../_models/location.model';

@Injectable()
export class LocationService {

    constructor(private http: HttpClient) {
    }

    public getAddressDataFromCep(cep: string) : Observable<Address> {
        return this.http.get<Address>(`https://viacep.com.br/ws/${cep}/json`);
    }

    public getCitiesFromIbge() {
        this.http.get<any>("https://servicodados.ibge.gov.br/api/v1/localidades/estados").subscribe({
            next: (ret: any[]) => {
                ret.forEach(r => {
                    this.http.get<any>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${r.id}/municipios`)
                        .pipe(
                            map(
                                (data: any) => 
                                    data.map(
                                        (d: any) => ({ id: d.id, name: d.nome, state_acronym: d.microrregiao.mesorregiao.UF.sigla })
                                    )
                                )
                            ).subscribe({
                                next: (retC) => {
                                    console.log(JSON.stringify(retC));
                                }
                            })
                });
            }
        })
    }

    public getCitiesJSON(state_acronym: string): Observable<City[]> {
        const acronym = state_acronym?.toUpperCase() || '';
        return this.http.get<any>("./assets/json/cidades.json")
            .pipe(map(data => data.filter((c: City) => c.state_acronym == acronym)));
    }

    public getCityById(city_id: number): Observable<City> {
        return this.http.get<any>("./assets/json/cidades.json")
            .pipe(map(data => data.find((c: City) => c.id == city_id)));
    }

    public getStatesJSON(): Observable<State[]> {
        return this.http.get<State[]>("./assets/json/estados.json");
    }
}
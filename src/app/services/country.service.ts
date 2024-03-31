import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class CountryService {

    constructor(private http: HttpClient) { }

    getCountryListWithFields(fields: string) {
        const url = `https://restcountries.com/v3.1/all?fields=${fields}`

        return this.http.get(url);
    }

    getCountryByCode(code: string, fields?: string) {
        let url: string;
        if (fields) {
            url = `https://restcountries.com/v3.1/alpha/${code}?fields=${fields}`
        } else {
            url = `https://restcountries.com/v3.1/alpha/${code}`
        }

        return this.http.get(url);
    }

}
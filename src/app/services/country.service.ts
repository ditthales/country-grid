import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { Country, countries } from "src/utils/globals";

@Injectable({
    providedIn: 'root'
})
export class CountryService {

    constructor(private http: HttpClient) { }

    getCountryListWithFields(fields: string) {
        const url = `https://restcountries.com/v3.1/all?fields=${fields}`

        return this.http.get(url);
    }

    getCountryByCode(code: string): Country | undefined {
        return countries.find(country => country.cca3 === code);
      }

    getCountryByName(name: string) {
        let url: string;
        url = `https://restcountries.com/v3.1/name/${name}?fullText=true`
        return this.http.get(url);
    }

    findCountriesByName(searchName: string): Country[] {
        const searchResults: Country[] = [];

        countries.forEach(country => {
            // Função para remover conteúdo entre parênteses
            const removeParenthesesContent = (str: string): string => {
                return str.replace(/\([^)]*\)/, '').trim();
            };

            // Verifica se o nome comum contém a substring desejada
            if (country.name?.common.toLowerCase().includes(searchName.toLowerCase())) {
                searchResults.push(country);
            } else {
                // Verifica se alguma tradução contém a substring desejada
                for (const translationKey in country.translations) {
                    const translation = country.translations[translationKey];
                    const translatedName = removeParenthesesContent(translation.common?.toLowerCase() || '');
                    if (translatedName.includes(searchName.toLowerCase())) {
                        searchResults.push(country);
                        break;
                    }
                }
            }
        });

        return searchResults;
    }

    findCountriesByNameAndTranslation(searchName: string, translationKey: string): Country[] {
        const searchResults: Country[] = [];

        countries.forEach(country => {
            // Verifica se o nome comum contém a substring desejada
            if (country.name?.common.toLowerCase().includes(searchName.toLowerCase())) {
                searchResults.push(country);
            } else {
                // Verifica se a tradução especificada contém a substring desejada
                if (country.translations) {
                    const translation = country.translations[translationKey];
                    if (translation) {
                        const translatedName = translation.common?.toLowerCase();
                        if (translatedName?.includes(searchName.toLowerCase())) {
                            searchResults.push(country);
                        }
                    }
                }
            }
        });

        return searchResults;
    }


    searchCountriesExclusive(searchTerm: string, excludedCountries: string[]): Country[] {
        // Primeiro, buscamos todos os países que correspondem ao termo de pesquisa
        const searchResults = this.findCountriesByName(searchTerm);

        // Filtramos os países excluídos
        const filteredResults = searchResults.filter(country => !excludedCountries.includes(country.cca3 || "asdasda"));

        // Retornamos os resultados filtrados como um Observable
        return filteredResults;
    }

    searchCountriesExclusiveByLanguage(searchTerm: string, excludedCountries: string[], translation: string): Country[] {
        // Primeiro, buscamos todos os países que correspondem ao termo de pesquisa
        const searchResults = this.findCountriesByNameAndTranslation(searchTerm, translation);

        // Filtramos os países excluídos
        const filteredResults = searchResults.filter(country => !excludedCountries.includes(country.cca3 || "asdasda"));

        // Retornamos os resultados filtrados como um Observable
        return filteredResults;
    }

    translateCountryByCode(code: string, language: string): string {
        if (language == 'eng') {
            return this.getCountryByCode(code)?.name?.common || ""
        }
        return this.getCountryByCode(code)?.translations?.[language].common || "";
    }

}
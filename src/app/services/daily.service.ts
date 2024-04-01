import { Injectable } from "@angular/core";
import { CountryService } from "./country.service";

interface Challenge {
    type: string;
    data: string;
}

@Injectable({
    providedIn: "root"
})
export class DailyService {

    constructor(private countryService: CountryService) {}

    generateDailyChallenge() {
        
    }

    generateLettersChalenge(): Challenge {
        let letters = 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'.split(' ');
        // Generate a random letter
        return {
            type: 'Letter',
            data: letters[Math.floor(Math.random() * letters.length)]
        }
    }

    generateBordersChallenges(): Challenge {
        const countries = this.countryService.getAtLeast4BordersCountries();

        if (countries.length > 0) {
            const randomCountryIndex = Math.floor(Math.random() * countries.length);
            return {
                type: 'Border',
                data: countries[randomCountryIndex].cca3 || ''
            };
        } else {
            // Handle case when no country with at least 4 borders is found
            return {
                type: 'None',
                data: 'No country found'
            };
        }
    }

}
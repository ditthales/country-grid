import { Component, ElementRef, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CountryService } from 'src/app/services/country.service';
import { language } from 'src/utils/globals';

interface GridValue {
  image: string;
  caption: string;
  code?: string;
}

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit {

  characteristicsX = ['Começa com A', 'É uma ilha', 'Fala Português'];
  characteristicsY = ['País 1', 'País 2', 'País 3'];

  rows: GridValue[][] = [
    [
      { image: 'https://via.placeholder.com/150', caption: '' },
      { image: 'https://via.placeholder.com/150', caption: '' },
      { image: 'https://via.placeholder.com/150', caption: '' },
    ],
    [
      { image: 'https://via.placeholder.com/150', caption: '' },
      { image: 'https://via.placeholder.com/150', caption: '' },
      { image: 'https://via.placeholder.com/150', caption: '' },
    ],
    [
      { image: 'https://via.placeholder.com/150', caption: '' },
      { image: 'https://via.placeholder.com/150', caption: '' },
      { image: 'https://via.placeholder.com/150', caption: '' },
    ]
  ];

  isModalOpen = false;
  countryName: string = '';

  language = language

  countrySuggestions: any[] = [];

  selectedCell: {x: number, y: number} | undefined;

  constructor(
    private countryService: CountryService,
    private elementRef: ElementRef
  ) {

  }
  ngOnInit(): void {
    //this.populateGrid();
    this.populateTitles()
  }

  populateGrid() {
    this.countryService.getCountryListWithFields("name,flags,cca3,borders").subscribe((data: any) => {
      const firstTenCountries = data.slice(0, 10);

      this.rows = [];

      for (let i = 0; i < 3; i++) {
        const newRow: GridValue[] = [];
        for (let j = 0; j < 3; j++) {
          const randomIndex = Math.floor(Math.random() * data.length);
          newRow.push({ image: data[randomIndex].flags.svg, caption: data[randomIndex].name.common });
        }
        // Adicionar a linha à matriz
        this.rows.push(newRow);
      }
    });
  }

  populateTitles() {
    this.characteristicsX = ['Começa com A', 'É uma ilha', 'Fala francês'];
    this.characteristicsY = ['Tem amarelo na bandeira', 'Fala inglês', 'Faz fronteira com a França'];
  }

  cellClicked(row: number, col: number) {
    console.log(`Clicou na linha ${row + 1}, coluna ${col + 1}`);
    this.selectedCell = {x: row, y: col};
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  submitCountry() {
    this.countrySuggestions = []
    this.closeModal()
  }

  onInputChange(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    let codes: string[] = [];
    for (const row of this.rows) {
      for (const cell of row) {
        if(cell.code) {
          codes.push(cell.code);
        }
      }
    }
    this.countrySuggestions = this.countryService.searchCountriesExclusiveByLanguage(searchTerm, codes, language)
    // this.countryService.getCountryListWithFields("name,cca3,flags").subscribe((data: any) => {
    //   console.log(data);
    //   this.countrySuggestions = data.filter((country: { name: { common: string; }; }) => {
    //     const matchesGridContent = this.rows.some(row =>
    //       row.some(cell => cell.caption.includes(country.name.common))
    //     );
    //     return country.name.common.toLowerCase().includes(searchTerm) && !matchesGridContent;
    //   });
    // })
  }

  selectSuggestion(suggestion: any) {
    if (this.selectedCell) {
      this.rows[this.selectedCell.x][this.selectedCell.y].caption = this.countryService.translateCountryByCode(suggestion.cca3, language);
      this.rows[this.selectedCell.x][this.selectedCell.y].image = suggestion.flags.svg;
      this.rows[this.selectedCell.x][this.selectedCell.y].code = suggestion.cca3;
    }
    this.submitCountry();
  }

  translateCountryName(suggestion: any) {
    return this.countryService.translateCountryByCode(suggestion.cca3, language);
  }


}


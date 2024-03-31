import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { CountryService } from 'src/app/services/country.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent  implements OnInit {

  @Input() levelMap: number[] = [];
  @Input() columns: number = 3;

  chosenCountryFlag: string = "";
  chosenCountryName: string = "";
  chosenCountryCode: string = "";
  chosenCountryBorders: any;
  chosenCountryFlags: any[] = [];

  screenWidth: number = window.innerWidth;
  cellHeight: number = 128;
  fontSize: number = 16;

  constructor(
    private countryService: CountryService,
    private elementRef: ElementRef
    ) {

  }
  ngOnInit(): void {
    this.countryService.getCountryListWithFields("name,flags,cca3,borders").subscribe((data: any) => {
      const randomIndex = Math.floor(Math.random() * data.length);
      this.chosenCountryFlag = data[randomIndex].flags.svg;
      this.chosenCountryName = "Federate States of Micronesia and Furtuna" //data[randomIndex].name.common;
      this.chosenCountryCode = data[randomIndex].cca3;
      this.chosenCountryBorders = data[randomIndex].borders;
      const firstTenCountries = data.slice(0, 10);
      this.chosenCountryFlags = firstTenCountries.map((country: { flags: { svg: any; }; }) => country.flags.svg);
      console.log(this.chosenCountryCode);
      console.log(this.chosenCountryName);
      console.log(this.chosenCountryBorders);
      this.resizeCells();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Atualiza a largura da tela sempre que ocorrer um evento de redimensionamento
    this.resizeCells();
  }

  resizeCells() {
    this.screenWidth = window.innerWidth;
    console.log('Largura da tela:', this.screenWidth);
    if (this.screenWidth < 400) {
      this.cellHeight = this.screenWidth / 4.8;
      this.fontSize = this.screenWidth / 40;
    } else {
      this.cellHeight = 128;
    }
  }

  getGridColumns(): string {
    return `repeat(${this.columns}, 1fr)`;
  }

  getAsset(asset:number, index:number): string {

    let imageName: string = "";

    if (index === 1) {
      imageName = "https://flagcdn.com/qa.svg";
    } else {
      imageName = this.chosenCountryFlags[index];
    }

    return imageName;
  }

  cellClicked(index: number): void {
    console.log(`Cell clicked at (${index})`);
    // Aqui você pode adicionar lógica adicional para lidar com o clique na célula
  }
}


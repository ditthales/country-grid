import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { GridComponent } from "./grid/grid.component";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [GridComponent],
  imports: [
    CommonModule,
    IonicModule,
    HttpClientModule
],
  exports: [GridComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
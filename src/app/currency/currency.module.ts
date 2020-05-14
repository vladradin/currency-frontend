import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrencyRoutingModule } from './currency-routing.module';
import { CurrencyConverterComponent } from './components/currency-converter/currency-converter.component';
import { CurrencyService } from './services/currency.service';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [CurrencyConverterComponent],
  imports: [
    CommonModule,
    CurrencyRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    CurrencyService
  ]
})
export class CurrencyModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CurrencyModule,
      providers: [
        CurrencyService
      ]
    }
  }
}

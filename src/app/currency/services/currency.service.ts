import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, Subject, of } from 'rxjs';
import { map, exhaustMap, shareReplay, tap, delay } from 'rxjs/operators';

import { CurrencyConversion, CurrenciesTypes, CurrencySymbol, Currency } from '../models/currency';

@Injectable()
export class CurrencyService extends Subject<CurrencyConversion>{

  readonly baseUrl = 'api/currency/';

  private currencySelectedSubject = new Subject<Currency>();
  private currencySelected$ = this.currencySelectedSubject.asObservable();

  private currencyTypes$ = this.httpClient.get<CurrenciesTypes>(`${this.baseUrl}list`)
    .pipe(shareReplay(1));

  constructor(private httpClient: HttpClient) {
    super();
    this.currencySelected$.pipe(
      exhaustMap(currencySymbol => this.getCurrencyConverted(currencySymbol))
    ).subscribe(conversion => this.next(conversion));
  }

  private getCurrencyConverted(fromCurrency: Currency) {
    return this.httpClient.post<CurrencyConversion>(`${this.baseUrl}converter`, fromCurrency);
  }

  getCurrenciesTypes(): Observable<CurrenciesTypes> {
    return this.currencyTypes$;
  }

  selectCurrencyToConvert(fromCurrency: Currency): this {
    this.currencySelectedSubject.next(fromCurrency);
    return this;
  }
}

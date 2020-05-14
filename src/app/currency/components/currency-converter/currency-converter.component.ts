import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable, EMPTY, of, Subject } from 'rxjs';
import { CurrencyService } from '../../services/currency.service';
import { first, filter, map, takeUntil, scan, tap, distinctUntilChanged } from 'rxjs/operators';
import { CurrencyConversion } from '../../models/currency';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.scss']
})
export class CurrencyConverterComponent implements OnInit, OnDestroy {
  currencyForm: FormGroup;

  readonly amountControlName = 'amount';
  readonly currencyControlName = 'symbol';

  currencies: Observable<string[]>;
  converterCurrency!: Observable<CurrencyConversion>;

  stop$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private currencyService: CurrencyService) {
  }

  ngOnInit() {
    this.currencies = this.currencyService.getCurrenciesTypes();

    this.currencyForm = this.createCurrencyForm();

    this.onLoadSelectTheFirstCurrencyFromList();

    this.enforceOnlyValidNumberForAmountControl();

    this.converterCurrency = this.currencyService
      .asObservable()
      .pipe(takeUntil(this.stop$));
  }
  enforceOnlyValidNumberForAmountControl() {
    const amountControl = this.currencyForm.get(this.amountControlName);
    amountControl.valueChanges.pipe(
      distinctUntilChanged(),
      scan((prev, next) => this.allowOnlyValidNumbers(prev, next), '1'),
      tap(val => amountControl.patchValue(val))
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.stop$.next();
  }

  createCurrencyForm() {
    return this.fb.group({
      [this.amountControlName]: ['1', Validators.required],
      [this.currencyControlName]: ['', Validators.required]
    });
  }

  onLoadSelectTheFirstCurrencyFromList() {
    this.currencies.pipe(
      first(),
      filter(firstCurrencySet => !!firstCurrencySet[0]),
      map(firstCurrencySet => firstCurrencySet[0]),
      tap(firstCurrency => this.currencyService.selectCurrencyToConvert({ amount: 1, symbol: firstCurrency }))
    ).subscribe(firstCurrencyType => this.currencyForm.get(this.currencyControlName).patchValue(firstCurrencyType));
  }


  convertCurrency() {
    this.currencyService.selectCurrencyToConvert(this.currencyForm.value);
  }


  private allowOnlyValidNumbers(previousValue: string, newValue: string) {
    const isValidNumberInput = /^\d*(\.\d*)?$/.test(newValue);
    if (isValidNumberInput) {
      return newValue;
    } else {
      return previousValue;
    }
  }

}

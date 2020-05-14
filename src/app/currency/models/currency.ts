export type CurrencySymbol = string;

export type CurrenciesTypes = Array<CurrencySymbol>;

export interface Currency {
  symbol: CurrencySymbol;
  amount: number;
}

export interface CurrencyConversion {
  fromCurrency: Currency;
  date: Date;
  rates: Array<Currency>;
}

import { config } from "proenv";

config(undefined, { keysToLowercase: true });

type Currencies = {
  [key: string]: {
    precision: string | number;
    currency: string;
  };
};

type ENV = {
  origin: string;
  db: {
    username: string;
    password: string;
    name: string;
  };
  app: {
    status: string;
  };
  cookie: {
    name: string;
    domain: string;
  };
  currencies: Currencies;
};

const env = {
  origin: process.env.origin,
  db: process.env.db,
  app: process.env.app,
  cookie: process.env.cookie,
  currencies: (() => {
    const currencies = process.env.currencies as unknown as Currencies;
    return Object.keys(currencies).reduce((formattedCurrencies, key) => {
      const currency = currencies[key];
      const precision = Number(currency.precision);
      return {
        ...formattedCurrencies,
        [key]: {
          ...currency,
          precision: isNaN(precision) ? 0 : precision,
        },
      };
    }, {});
  })(),
} as unknown as ENV;

export default env;

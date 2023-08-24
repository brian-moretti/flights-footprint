export interface Airports {
  code: string;
  lat: string; //number
  lon: string; //number
  name: string;
  city: string;
  state: string | null;
  country: string;
  woeid: string; //number
  tz: string;
  phone: string; //number
  type: string;
  email: string;
  url: string;
  runway_length: string | null; //number
  elev: string | null; //number
  icao: string;
  direct_flights: string; //number
  carriers: string; //number
}

export interface AirportCodes {
  continent: string;
  coordinates: string; //number []
  elevation_ft: string | null; //number
  gps_code: string | null;
  iata_code: string | null;
  ident: string;
  iso_country: string;
  iso_region: string;
  local_code: string | null;
  munucipality: string;
  name: string;
  type: string;
}

export interface Airplane {
  name: string;
  passengers: number;
}

export interface Footprint {
  footprint: number;
  offset_prices: [
    {
      amount: number;
      currency: string;
      offset_url: string;
      locale: string;
    }
  ];
}

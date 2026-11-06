import { USE_MOCK } from './config';
import { api } from './api';
import { mockStorage } from './storage';
import { MandiPrice } from '../types';

export interface MarketFilterParams {
  state?: string;
  district?: string;
  market?: string;
  commodity?: string;
  search?: string;
}

export interface MarketFiltersResponse {
  states: string[];
  commodities: string[];
  markets: string[];
}

export const marketService = {
  async getPrices(params: MarketFilterParams = {}): Promise<{
    data: MandiPrice[];
    isSampleData: boolean;
    total: number;
  }> {
    if (!USE_MOCK) {
      const q = new URLSearchParams();
      if (params.state) q.set('state', params.state);
      if (params.district) q.set('district', params.district);
      if (params.market) q.set('market', params.market);
      if (params.commodity) q.set('commodity', params.commodity);
      if (params.search) q.set('search', params.search);
      return api.get(`/market?${q.toString()}`);
    }

    let prices = mockStorage.getMandiPrices();

    if (params.state && params.state !== 'All') {
      prices = prices.filter((p) => p.state.toLowerCase() === params.state!.toLowerCase());
    }
    if (params.district && params.district !== 'All') {
      prices = prices.filter((p) => p.district.toLowerCase() === params.district!.toLowerCase());
    }
    if (params.market && params.market !== 'All') {
      prices = prices.filter((p) => p.market.toLowerCase().includes(params.market!.toLowerCase()));
    }
    if (params.commodity && params.commodity !== 'All') {
      prices = prices.filter(
        (p) => p.commodity.toLowerCase() === params.commodity!.toLowerCase()
      );
    }
    if (params.search) {
      const s = params.search.toLowerCase();
      prices = prices.filter(
        (p) =>
          p.commodity.toLowerCase().includes(s) ||
          p.market.toLowerCase().includes(s) ||
          p.variety.toLowerCase().includes(s) ||
          p.state.toLowerCase().includes(s) ||
          p.district.toLowerCase().includes(s)
      );
    }

    return {
      data: prices,
      isSampleData: true,
      total: prices.length,
    };
  },

  async getFilters(): Promise<MarketFiltersResponse> {
    if (!USE_MOCK) {
      return api.get('/market/filters');
    }

    const prices = mockStorage.getMandiPrices();
    const states = Array.from(new Set(prices.map((p) => p.state))).sort();
    const commodities = Array.from(new Set(prices.map((p) => p.commodity))).sort();
    const markets = Array.from(new Set(prices.map((p) => p.market))).sort();

    return { states, commodities, markets };
  },
};

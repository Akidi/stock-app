import type { NewStock } from '$lib/server/db/schema/stocks';

export function mapToNewStock(data: any, companyId: number): NewStock {
  return {
    symbol: data.Symbol,
    price: data.AnalystTargetPrice || "0",
    currency: data.Currency || 'USD',
    marketCap: data.MarketCapitalization || null,
    peRatio: data.PERatio || null,
    eps: data.EPS || null,
    dividendYield: data.DividendYield || null,
    beta: data.Beta || null,
    analystTargetPrice: data.AnalystTargetPrice || null,
    fiscalYearEnd: data.FiscalYearEnd ? new Date(`01 ${data.FiscalYearEnd}`) : null,
    latestQuarter: data.LatestQuarter ? new Date(data.LatestQuarter).toDateString() : null,
    companyId: companyId // This must be set separately or mapped before insertion
  };
}

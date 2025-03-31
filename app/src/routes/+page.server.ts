import type { Actions } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getStockBySymbol, insertStock } from '$lib/server/db/queries/stocks';
import { ToastType } from '$lib/components/Toast/Toast.types';
import { cache } from '$lib/server/redis';
import { mapToNewStock } from '$lib/server/utils/stock-mapper';
import { getOrCreateCompany } from '$lib/server/utils/get-or-create-company';

export const actions: Actions = {
  default: async (event) => {
    const form = await event.request.formData();
    const symbol = form.get('symbol')?.toString().toUpperCase();
    let message = ""

    if (!symbol) {
      return {
        status: 400,
        type: 'error',
        toast: {
          message: 'Missing stock symbol.',
          type: ToastType.Error
        }
      };
    }

    const cached = await cache.get(`stock:${symbol}`);
    message = `${symbol} loaded from cache`;
    if (cached) {
      return {
        type: 'success',
        stock: cached,
        toast: {
          message,
          type: ToastType.Success
        }
      };
    }

    const stock = await getStockBySymbol(symbol);
    message = `${symbol} loaded from database`;
    if (stock) {
      await cache.set(`stock:${symbol}`, stock, 3600);
      return {
        type: 'success',
        stock,
        toast: {
          message,
          type: ToastType.Success
        }
      };
    }

    const res = await fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${env.ALPHA_ADVANTAGE_API_KEY}`);
    const apiData = await res.json();

    if (!res.ok || !apiData?.Symbol || apiData.Note || apiData.Information) {
      return {
        status: 400,
        type: 'error',
        toast: {
          message: 'Stock not found or Alpha Vantage API limit reached.',
          type: ToastType.Error
        }
      };
    }

    const companyId = await getOrCreateCompany(apiData);
    const newStock = mapToNewStock(apiData, companyId);
    const inserted = await insertStock(newStock);
    await cache.set(`stock:${symbol}`, inserted, 3600);

    message = `${symbol} data fetched from Alpha Vantage and saved.`;
    return {
      type: 'success',
      stock: inserted,
      toast: {
        message,
        type: ToastType.Success
      }
    };
  }
};

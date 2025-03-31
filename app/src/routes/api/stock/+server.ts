import { json } from '@sveltejs/kit';
import { cache } from '$lib/server/redis';
import { stocks, type Stock } from '$lib/server/db/schema/stocks';
import { getStockBySymbol } from '$lib/server/db/queries/stocks.js';
import { ToastType } from '$lib/components/Toast/Toast.types.js';

export async function GET({ url }) {
	const symbol = url.searchParams.get('symbol')?.toUpperCase();
	if (!symbol) return json({ error: 'Missing symbol' }, { status: 400 });

	const cacheKey = `stock:${symbol}`;
	let data = await cache.get<typeof stocks.$inferSelect>(cacheKey);
	let from = 'redis';

	if (!data) {
		const result: Stock | null = await getStockBySymbol(symbol);
		if (!result) {
			return json({
				from,
				data: null,
				toast: {
					message: `No data for ${symbol} was found.`,
					type: ToastType.Error
				}
			});
		}
		data = result;
		from = 'database';
		await cache.set(cacheKey, data, 3600);
	}

	return json({
		from,
		data,
		toast: {
			message: `Successfully retrieve ${symbol} data from ${from}`,
			type: ToastType.Info
		}
	});
}

import { json } from '@sveltejs/kit';
import { cache } from '$lib/server/redis';
import type { Ping } from '$lib/server/db/schema/pings';
import { getPingByLabel, insertPing } from '$lib/server/db/queries/ping';

export async function GET() {
  const key = 'test:ping';

  let data: Ping | null = await cache.get(key);
  let from = 'redis';

  if (!data) {
    // Fallback: check DB
    const existing: Ping | null = await getPingByLabel("demo");

    if (!existing) {
      // Insert if not present
      await insertPing({label: "demo"});
    }

    const fresh: Ping = (await getPingByLabel("demo"))!;
    data = fresh;
    from = 'database (fallback)';
    await cache.set(key, data, 10);
  }

  return json({ message: 'Redis test result', from, result: data });
}

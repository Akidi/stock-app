<script lang="ts">
  import { enhance } from '$app/forms';
  import { toastStore } from '$lib/stores/toast.store';
  import { formatNumber } from '$lib/utils/format';
  import type { SubmitFunction } from '@sveltejs/kit';

  let symbol = $state('');
  let stockData = $state<any>(null);
  let isLoading = $state(false);
  let errorMsg = $state<string | null>(null);
  const locale = navigator.language || 'en-US';

  const featured = [
    'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META', 'TSLA', 'NVDA', 'NFLX'
  ];

  const handleSubmit: SubmitFunction = () => {
    isLoading = true;
    return async ({ update, result }) => {
      await update();
      isLoading = false;

      if (result.type === 'success' && result.data) {
        stockData = result.data.stock;
        errorMsg = null;
        toastStore.add(result.data.toast);
        return;
      }

      stockData = null;
      if (result.type === "error") {errorMsg = result?.error?.toast ?? 'An unexpected error occurred.';
      toastStore.add(result?.error?.toast ?? { message: 'Unknown error', type: 'error' });}
    };
  };

  function quickSelect(sym: string) {
    symbol = sym;
    const form = document.querySelector('form');
    form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  }
</script>

<div class="max-w-xl mx-auto p-4">
  <form
    method="POST"
    use:enhance={handleSubmit}
    class="flex gap-2 mb-4"
  >
    <input
      name="symbol"
      bind:value={symbol}
      placeholder="Search stock symbol (e.g., AAPL)"
      class="flex-1 border border-gray-300 rounded px-3 py-2"
    />
    <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
      Search
    </button>
  </form>

  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
    {#each featured as f}
    <form
    method="POST"
    use:enhance={handleSubmit}
  >
    <input type="hidden" name="symbol" value="{f}" />
      <button
        type="button"
        class="bg-gray-100 hover:bg-gray-200 text-sm rounded px-3 py-2 shadow"
      >{f}</button>
      </form>
    {/each}
  </div>

  {#if isLoading}
    <p class="text-gray-600">Loading...</p>
  {:else if errorMsg}
    <p class="text-red-600">{errorMsg}</p>
  {:else if stockData}
    <div class="bg-white shadow rounded p-4">
      <h2 class="text-xl font-bold mb-2">{stockData.symbol} - {stockData.companyId}</h2>
      <ul class="text-sm space-y-1">
        <li><strong>Price:</strong> {formatNumber(stockData.price, locale)} {stockData.currency}</li>
        <li><strong>Market Cap:</strong> {formatNumber(stockData.marketCap, locale)}</li>
        <li><strong>PE Ratio:</strong> {formatNumber(stockData.peRatio, locale)}</li>
        <li><strong>EPS:</strong> {formatNumber(stockData.eps, locale)}</li>
        <li><strong>Dividend Yield:</strong> {formatNumber(stockData.dividendYield, locale)}</li>
        <li><strong>Beta:</strong> {formatNumber(stockData.beta, locale)}</li>
        <li><strong>Latest Quarter:</strong> {stockData.latestQuarter}</li>
        {#if stockData.financialMetrics}
          <li><strong>Revenue:</strong> {formatNumber(stockData.financialMetrics.revenue, locale)}</li>
          <li><strong>Profit Margin:</strong> {formatNumber(stockData.financialMetrics.profitMargin, locale)}</li>
          <li><strong>Return on Equity:</strong> {formatNumber(stockData.financialMetrics.returnOnEquity, locale)}</li>
        {/if}
      </ul>
    </div>
  {/if}
</div>

<style>
  input:focus {
    outline: none;
    border-color: #2563eb;
  }
</style>
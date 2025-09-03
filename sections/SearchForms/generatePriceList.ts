import currency from "currency.js";

export const generatePriceList = (): { value: number; label: string }[] => {
  const prices: { value: number; label: string }[] = [{ value: 0, label: 'Any' }];

  const addPrice = (price: number) => {
    let label = '';

    if (price >= 1_000_000) {
      const millionValue = price / 1_000_000;
      // Use 1 decimal if not whole number
      label = `${millionValue % 1 === 0 ? millionValue : millionValue.toFixed(1)} Million`;
    } else {
      label = currency(price, { symbol: "", precision: 0 }).format(); // e.g. "500,000"
    }

    prices.push({ value: price, label: `₦${label}` });
  };

  const ranges = [
    { max: 1_000_000, step: 100_000 },     
    { max: 10_000_000, step: 1_000_000 },  
    { max: 100_000_000, step: 10_000_000 },
    { max: 300_000_000, step: 50_000_000 },
  ];

  ranges.forEach(({ max, step }) => {
    let lastPrice = prices[prices.length - 1].value;
    let start = lastPrice === 0 ? 100_000 : lastPrice + step;

    for (let price = start; price <= max; price += step) {
      addPrice(price);
    }
  });

  return prices;
};

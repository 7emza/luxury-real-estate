export interface PriceOption {
  label: string;
  value: number;
}

// Generate smart price options like professional real estate sites
export function generatePriceOptions(
  minPrice: number,
  maxPrice: number,
  formatter: (price: number) => string
): PriceOption[] {
  const options: PriceOption[] = [];

  // Define nice price steps based on magnitude
  const getPriceSteps = (min: number, max: number): number[] => {
    const range = max - min;
    const magnitude = Math.pow(10, Math.floor(Math.log10(range)));

    // Create steps at different levels
    const steps: number[] = [];
    const baseSteps = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];

    for (const base of baseSteps) {
      const step = base * magnitude;
      if (step >= magnitude / 10 && step <= range) {
        for (let price = Math.ceil(min / step) * step; price <= max; price += step) {
          if (price >= min && price <= max) {
            steps.push(price);
          }
        }
      }
    }

    return [...new Set(steps)].sort((a, b) => a - b);
  };

  const steps = getPriceSteps(minPrice, maxPrice);

  // Add options
  steps.forEach(price => {
    options.push({
      label: formatter(price),
      value: price
    });
  });

  // Ensure we have at least 8-12 options
  if (options.length < 8) {
    const step = (maxPrice - minPrice) / 10;
    for (let i = 1; i <= 10; i++) {
      const price = Math.round(minPrice + (step * i));
      if (!options.find(o => o.value === price)) {
        options.push({
          label: formatter(price),
          value: price
        });
      }
    }
    options.sort((a, b) => a.value - b.value);
  }

  return options;
}

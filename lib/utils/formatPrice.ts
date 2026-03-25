export function formatIndianPrice(price: number): string {
  if (price < 100000) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  } else if (price < 10000000) {
    const lakh = price / 100000;
    return `₹${lakh.toFixed(2)} Lakh`;
  } else {
    const crore = price / 10000000;
    return `₹${crore.toFixed(2)} Crore`;
  }
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // remove accents
    .replace(/[\u0300-\u036f]/g, '') // remove accent characters
    .trim()
    .replace(/\s+/g, '-') // replace spaces with -
    .replace(/[^\w\-]+/g, '') // remove all non-word chars
    .replace(/\-\-+/g, '-'); // replace multiple - with single -
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(price);
}

export interface ProductLike {
  name: string;
  presentations: string[] | null;
  categorySlug?: string | null;
}

export function getUnitForProduct(product: ProductLike): 'LT' | 'kg' {
  const nameLower = product.name.toLowerCase();
  
  if (product.presentations) {
    const hasKG = product.presentations.some(p => p.toLowerCase().includes('kg'));
    const hasLTS = product.presentations.some(p => p.toLowerCase().includes('lts') || p.toLowerCase().includes('lt'));
    if (hasKG && !hasLTS) return 'kg';
  }

  if (
    nameLower.includes('oxalico') || 
    nameLower.includes('sal de limon') || 
    nameLower.includes('sal de limón') || 
    nameLower.includes('dsc concentrado') ||
    nameLower.includes('cremoso')
  ) {
    return 'kg';
  }

  return 'LT';
}

export function cleanPresentations(rawList: string[] | null | undefined): string[] {
  if (!rawList || rawList.length === 0) return [];
  const result: string[] = [];
  for (let i = 0; i < rawList.length; i++) {
    const current = rawList[i].trim();
    const next = rawList[i + 1]?.trim();

    if (current.toUpperCase() === 'X1' && next === '2') {
      result.push('x 1/2 LT');
      i++;
      continue;
    }
    if (current.toUpperCase() === 'X1' && (next === '4' || next === '4 C' || next === '4 LTS')) {
      result.push('x 1/4 LT');
      i++;
      continue;
    }
    result.push(current);
  }
  return Array.from(new Set(result));
}

export function formatPresentation(p: string, product?: ProductLike): string {
  let formatted = p.trim();
  const lower = formatted.toLowerCase();

  // If "x lt", "x kg", "lt" or "kg" -> "A granel"
  if (
    lower === 'x lt' || 
    lower === 'xlt' || 
    lower === 'lt' || 
    lower === 'x kg' || 
    lower === 'xkg' || 
    lower === 'kg'
  ) {
    return 'A granel';
  }

  // Ensure lowercase 'x' with a space when prefixing a quantity: e.g. "x 5 LTS"
  if (/^x\s*/i.test(formatted)) {
    formatted = formatted.replace(/^x\s*/i, 'x ');
  }

  // Handle bare numbers or shorthand
  if (/^\d+$/.test(formatted)) {
    const unit = product ? getUnitForProduct(product) : 'LT';
    const finalUnit = unit === 'LT' ? 'LTS' : 'kg';
    return `x ${formatted} ${finalUnit}`;
  }

  if (/^x\s*12$/i.test(formatted)) {
    return 'x 12';
  }

  if (/^x\s*\d+$/i.test(formatted)) {
    const num = formatted.replace(/^x\s*/i, '');
    const unit = product ? (getUnitForProduct(product) === 'LT' ? (num === '1' ? 'LT' : 'LTS') : 'kg') : (num === '1' ? 'LT' : 'LTS');
    return `x ${num} ${unit}`;
  }

  if (/^\d+\s*lts?$/i.test(formatted)) {
    const num = formatted.replace(/\D/g, '');
    return `x ${num} LTS`;
  }

  if (/^\d+\s*kgs?$/i.test(formatted)) {
    const num = formatted.replace(/\D/g, '');
    return `x ${num} kg`;
  }

  if (/^\d+\s*(gr?s?|gramos?)\b/i.test(formatted)) {
    const num = formatted.replace(/\D/g, '');
    return `x ${num} gr`;
  }

  if (formatted.toUpperCase() === '4 C') {
    return 'x 4 LTS';
  }

  if (lower === 'spray') {
    return 'Spray';
  }

  if (lower.startsWith('caja')) {
    formatted = formatted.replace(/^caja\s*/i, 'Caja ');
  }

  // Lowercase 'x' in patterns like 3x5 or internal X
  formatted = formatted.replace(/(\d)\s*x\s*(\d)/gi, '$1x$2');

  // Format liters correctly: 1 LT (and fractions like 1/2 LT, 1/4 LT), multiple liters as LTS
  formatted = formatted.replace(/(1\s*\/\s*[248])\s*lts?\b/gi, '$1 LT');
  formatted = formatted.replace(/\b1\s*lts?\b/gi, '1 LT');
  formatted = formatted.replace(/(?<!\/)\b([2-9]|\d{2,})\s*lt(s)?\b/gi, '$1 LTS');

  // Ensure standard spacing and strictly lowercase 'kg'
  formatted = formatted.replace(/(\d)\s*kg(s)?\b/gi, '$1 kg');
  formatted = formatted.replace(/\bkg(s)?\b/gi, 'kg');

  // Ensure standard spacing and lowercase 'gr'
  formatted = formatted.replace(/(\d)\s*(gr?s?|gramos?)\b/gi, '$1 gr');

  // Ensure ALL occurrences of X are strictly lowercase 'x'
  formatted = formatted.replace(/X/g, 'x');

  // Fix '(a pedido)'
  if (formatted.toLowerCase().includes('a pedido')) {
    formatted = formatted.replace(/\(a pedido\)/i, '(a pedido)');
  }

  return formatted;
}

export function formatProductName(name: string): string {
  if (!name) return '';
  const trimmed = name.trim();
  if (trimmed.length === 0) return '';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}


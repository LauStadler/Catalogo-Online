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

export function getUnitForProduct(product: ProductLike): 'LT' | 'KG' {
  const nameLower = product.name.toLowerCase();
  
  if (product.presentations) {
    const hasKG = product.presentations.some(p => p.toLowerCase().includes('kg'));
    const hasLTS = product.presentations.some(p => p.toLowerCase().includes('lts') || p.toLowerCase().includes('lt'));
    if (hasKG && !hasLTS) return 'KG';
  }

  if (
    nameLower.includes('oxalico') || 
    nameLower.includes('sal de limon') || 
    nameLower.includes('sal de limón') || 
    nameLower.includes('dsc concentrado') ||
    nameLower.includes('cremoso')
  ) {
    return 'KG';
  }

  return 'LT';
}

export function formatPresentation(p: string, product: ProductLike): string {
  const lower = p.toLowerCase();
  if (lower.includes('lt') || lower.includes('kg') || lower.includes('gr') || lower.includes('spray')) {
    return p;
  }
  
  const numericRegex = /^x?\s*[\d\/\.]+$/i;
  if (numericRegex.test(p.trim())) {
    const unit = getUnitForProduct(product);
    return `${p} ${unit}`;
  }
  
  return p;
}

'use server';

import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { eq, or, and, ilike, desc, asc } from 'drizzle-orm';
import { slugify } from './utils';
import { revalidatePath } from 'next/cache';

// --- CATEGORIES ---

export async function getCategories() {
  try {
    return await db.select().from(categories).orderBy(desc(categories.createdAt));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function createCategory(data: { name: string; description?: string }) {
  try {
    const slug = slugify(data.name);
    const result = await db.insert(categories).values({
      name: data.name,
      slug,
      description: data.description || null,
    }).returning();
    
    revalidatePath('/');
    return { success: true, category: result[0] };
  } catch (error) {
    console.error('Error creating category:', error);
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return { success: false, error: message };
  }
}

export async function updateCategory(id: string, data: { name: string; description?: string }) {
  try {
    const slug = slugify(data.name);
    const result = await db.update(categories)
      .set({
        name: data.name,
        slug,
        description: data.description || null,
      })
      .where(eq(categories.id, id))
      .returning();
      
    revalidatePath('/');
    return { success: true, category: result[0] };
  } catch (error) {
    console.error('Error updating category:', error);
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return { success: false, error: message };
  }
}

export async function deleteCategory(id: string) {
  try {
    await db.delete(categories).where(eq(categories.id, id));
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    const message = error instanceof Error ? error.message : 'Error al eliminar la categoría';
    return { success: false, error: message };
  }
}

// --- PRODUCTS ---

export async function getProducts(options?: {
  search?: string;
  categorySlug?: string;
  onlyActive?: boolean;
}) {
  try {
    const search = options?.search;
    const categorySlug = options?.categorySlug;
    const onlyActive = options?.onlyActive ?? false;

    let query = db.select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      presentations: products.presentations,
      active: products.active,
      createdAt: products.createdAt,
      categoryId: products.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .$dynamic();

    const conditions = [];

    if (onlyActive) {
      conditions.push(eq(products.active, true));
    }

    if (categorySlug) {
      conditions.push(eq(categories.slug, categorySlug));
    }

    if (search) {
      conditions.push(
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.description, `%${search}%`)
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(asc(products.name));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const result = await db.select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      presentations: products.presentations,
      active: products.active,
      createdAt: products.createdAt,
      categoryId: products.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

export async function createProduct(data: {
  name: string;
  description: string;
  presentations?: string[];
  categoryId: string;
  active?: boolean;
}) {
  try {
    const baseSlug = slugify(data.name);
    // Append unique suffix to prevent route conflicts
    const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
    
    const result = await db.insert(products).values({
      name: data.name,
      slug: uniqueSlug,
      description: data.description,
      presentations: data.presentations || null,
      categoryId: data.categoryId,
      active: data.active ?? true,
    }).returning();

    // Revalidate public catalog lists and the single product page
    revalidatePath('/');
    revalidatePath(`/producto/${uniqueSlug}`);
    return { success: true, product: result[0] };
  } catch (error) {
    console.error('Error creating product:', error);
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return { success: false, error: message };
  }
}

export async function updateProduct(
  id: string,
  data: {
    name: string;
    description: string;
    presentations?: string[];
    categoryId: string;
    active: boolean;
  }
) {
  try {
    // We update the product details. We don't change the slug to prevent broken links
    const result = await db.update(products)
      .set({
        name: data.name,
        description: data.description,
        presentations: data.presentations || null,
        categoryId: data.categoryId,
        active: data.active,
      })
      .where(eq(products.id, id))
      .returning();

    const updatedProduct = result[0];
    
    // Revalidate public catalog lists and the specific details page
    revalidatePath('/');
    if (updatedProduct) {
      revalidatePath(`/producto/${updatedProduct.slug}`);
    }
    
    return { success: true, product: updatedProduct };
  } catch (error) {
    console.error('Error updating product:', error);
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return { success: false, error: message };
  }
}

export async function deleteProduct(id: string, slug?: string) {
  try {
    await db.delete(products).where(eq(products.id, id));
    revalidatePath('/');
    if (slug) {
      revalidatePath(`/producto/${slug}`);
    }
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    const message = error instanceof Error ? error.message : 'Error al eliminar el producto';
    return { success: false, error: message };
  }
}

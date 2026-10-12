import type { Category, Industry, Subcategory } from "@/lib/types";

export interface NavSubcategory {
  name: string;
  href: string;
}

export interface NavCategory {
  name: string;
  href: string;
  subcategories: NavSubcategory[];
}

export interface NavIndustry {
  name: string;
  href: string;
  categories: NavCategory[];
}

/**
 * Builds the Industry -> Category -> Subcategory tree used by the navbar.
 * Industries/subcategories arrive already ordered by display_order from the
 * API; categories without an industry (legacy rows) are left out since they
 * have no top-level menu to live under.
 */
export function buildNavTree(
  industries: Industry[],
  categories: Category[],
  subcategories: Subcategory[]
): NavIndustry[] {
  const subsByCategory = new Map<string, NavSubcategory[]>();
  for (const sub of subcategories) {
    if (!sub.is_active || !sub.category) continue;
    const list = subsByCategory.get(sub.category.slug) ?? [];
    list.push({ name: sub.name, href: `/category/${sub.category.slug}/${sub.slug}` });
    subsByCategory.set(sub.category.slug, list);
  }

  const catsByIndustry = new Map<string, NavCategory[]>();
  for (const cat of categories) {
    if (!cat.is_active || !cat.industry) continue;
    const list = catsByIndustry.get(cat.industry.slug) ?? [];
    list.push({
      name: cat.name,
      href: `/category/${cat.slug}`,
      subcategories: subsByCategory.get(cat.slug) ?? [],
    });
    catsByIndustry.set(cat.industry.slug, list);
  }

  return industries
    .filter((i) => i.is_active)
    .map((i) => ({
      name: i.name,
      href: `/industry/${i.slug}`,
      categories: catsByIndustry.get(i.slug) ?? [],
    }));
}

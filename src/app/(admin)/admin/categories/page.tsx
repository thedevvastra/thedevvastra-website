import { getMainCategories } from "./actions"; // Action we created earlier
import { CategoryClient } from "@/components/admin/categories/category-client";

export default async function CategoriesPage() {
  // Database call: Fetch Main Categories with their Children
  const categories = await getMainCategories();

  return <CategoryClient categories={categories} />;
}

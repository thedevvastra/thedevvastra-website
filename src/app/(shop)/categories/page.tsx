import Link from "next/link";
import { getMainCategories } from "@/app/(admin)/admin/categories/actions"; // Action reuse kar rahe hain
import { ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AllCategoriesPage() {
  // Database se categories fetch karo
  const categories = await getMainCategories();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-muted/30 py-10 text-center border-b">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
          All Categories
        </h1>
        <p className="text-muted-foreground">
          Explore our wide range of collections.
        </p>
      </div>

      <div className="container mx-auto px-4 py-10 space-y-12">
        {categories.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No categories found.
          </div>
        ) : (
          categories.map((mainCat) => (
            <div key={mainCat.id} className="space-y-6">
              {/* Main Category Header */}
              <div className="flex items-center justify-between border-b pb-2">
                <Link
                  href={`/category/${mainCat.slug}`}
                  className="flex items-center gap-3 group"
                >
                  {/* Round Small Image */}
                  <div className="h-12 w-12 rounded-full overflow-hidden border bg-muted">
                    {mainCat.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={mainCat.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center font-bold text-primary">
                        {mainCat.name[0]}
                      </div>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">
                    {mainCat.name}
                  </h2>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              </div>

              {/* Sub Categories Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {mainCat.children && mainCat.children.length > 0 ? (
                  mainCat.children.map((sub: any) => (
                    <Link
                      key={sub.id}
                      href={`/category/${mainCat.slug}/${sub.slug}`}
                      className="flex flex-col items-center gap-3 group text-center"
                    >
                      <div className="h-28 w-28 md:h-32 md:w-32 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary bg-muted transition-all shadow-sm">
                        {sub.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={sub.imageUrl}
                            alt={sub.name}
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center font-bold text-xl text-muted-foreground">
                            {sub.name[0]}
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-sm md:text-base group-hover:text-primary transition-colors">
                        {sub.name}
                      </span>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground col-span-full">
                    No sub-categories yet.
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

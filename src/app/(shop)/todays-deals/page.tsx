import { getTodaysDealsForUser } from "@/app/(admin)/admin/todays-deal/actions";
import { DealCard } from "@/components/home/deal-card";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function TodaysDealsPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  const deals = await getTodaysDealsForUser();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 py-12 text-center border-b border-red-100">
        <h1 className="text-3xl md:text-5xl font-extrabold text-red-600 mb-2 tracking-tight">
          Flash Sale!
        </h1>
        <p className="text-muted-foreground font-medium">
          Grab these offers before they expire in 24 hours.
        </p>
      </div>

      <div className="container mx-auto px-4 py-10">
        {deals.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No active deals right now. Check back later!
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} user={userData.user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

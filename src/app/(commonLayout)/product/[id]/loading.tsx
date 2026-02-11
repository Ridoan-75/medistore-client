import { Skeleton } from "@/src/components/ui/skeleton";
import { ChevronRight } from "lucide-react";

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <main className="flex-1">
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 py-6">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
          <div className="container mx-auto px-4 relative">
            <nav className="flex items-center gap-2 text-sm">
              <Skeleton className="h-4 w-12" />
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
              <Skeleton className="h-4 w-10" />
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
              <Skeleton className="h-4 w-32" />
            </nav>
          </div>
        </div>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
              <div className="space-y-4">
                <div className="relative">
                  <Skeleton className="aspect-square w-full rounded-2xl" />
                  <Skeleton className="absolute top-4 right-4 h-8 w-24 rounded-full" />
                </div>
              </div>

              <div className="space-y-6">
                <Skeleton className="h-8 w-28 rounded-full" />

                <Skeleton className="h-12 w-full max-w-md" />
                <Skeleton className="h-12 w-3/4" />

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-5 w-5 rounded" />
                    ))}
                  </div>
                  <Skeleton className="h-5 w-px" />
                  <Skeleton className="h-4 w-24" />
                </div>

                <Skeleton className="h-14 w-36" />

                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>

                <div className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-2/3" />
                </div>

                <div className="pt-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-36 rounded-xl" />
                    <Skeleton className="h-12 flex-1 rounded-xl" />
                  </div>
                  <div className="flex gap-3">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <Skeleton className="h-12 w-12 rounded-xl" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-border">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border"
                    >
                      <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 mb-8 border-b border-border pb-4">
              <Skeleton className="h-12 w-32 rounded-none" />
              <Skeleton className="h-12 w-36 rounded-none" />
              <Skeleton className="h-12 w-28 rounded-none" />
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <Skeleton className="h-7 w-48 mb-6" />
              <div className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
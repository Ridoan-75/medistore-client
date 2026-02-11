import { Skeleton } from "@/src/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <main className="flex-1">
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 py-12 md:py-16">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
          <div className="container mx-auto px-4 relative">
            <div className="space-y-3">
              <Skeleton className="h-8 w-32 rounded-full" />
              <Skeleton className="h-12 w-64" />
              <Skeleton className="h-5 w-96 max-w-full" />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-24 space-y-6">
                <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-5 w-12 rounded-full" />
                    </div>
                    <div className="space-y-3">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 rounded-xl border border-border"
                        >
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-5 w-5 rounded" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                          <Skeleton className="h-5 w-6 rounded-full" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Skeleton className="h-6 w-28" />
                    <div className="space-y-3">
                      <Skeleton className="h-2 w-full rounded-full" />
                      <div className="flex items-center justify-between gap-4">
                        <Skeleton className="h-10 flex-1 rounded-xl" />
                        <Skeleton className="h-10 flex-1 rounded-xl" />
                      </div>
                    </div>
                  </div>

                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              </div>
            </aside>

            <div className="flex-1 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <Skeleton className="h-6 w-48" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-32 rounded-xl" />
                    <div className="flex gap-2">
                      <Skeleton className="h-10 w-10 rounded-xl" />
                      <Skeleton className="h-10 w-10 rounded-xl" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-2xl overflow-hidden group"
                  >
                    <div className="relative">
                      <Skeleton className="aspect-square w-full" />
                      <Skeleton className="absolute top-4 right-4 h-8 w-20 rounded-full" />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <Skeleton className="h-9 w-9 rounded-xl" />
                        <Skeleton className="h-9 w-9 rounded-xl" />
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <Skeleton className="h-5 w-24 rounded-full" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-3/4" />

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, j) => (
                            <Skeleton key={j} className="h-4 w-4 rounded" />
                          ))}
                        </div>
                        <Skeleton className="h-4 w-12" />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-4 w-20" />
                      </div>

                      <Skeleton className="h-11 w-full rounded-xl mt-4" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 pt-6">
                <Skeleton className="h-10 w-10 rounded-xl" />
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-10 rounded-xl" />
                ))}
                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
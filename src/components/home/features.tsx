import { CreditCard, Truck, Headphones, Percent, LucideIcon, Shield, Clock, Award } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

const FEATURES: Feature[] = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over ৳500",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% protected",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated help",
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    icon: Percent,
    title: "Best Prices",
    description: "Guaranteed savings",
    gradient: "from-amber-500 to-orange-500",
  },
];

export function Features() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-muted/50 to-background border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="group relative flex items-center gap-4 p-5 md:p-6 bg-card rounded-2xl border-2 border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                <div
                  className={`relative w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 shrink-0`}
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>

                <div className="relative">
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
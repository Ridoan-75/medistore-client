import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { Features } from "@/src/components/home/features";
import { Button } from "@/src/components/ui/button";
import {
  ChevronRight,
  CheckCircle,
  Users,
  Award,
  Clock,
  Heart,
  Sparkles,
  Shield,
  Zap,
  LucideIcon,
  Target,
  TrendingUp,
  Globe,
  Star,
} from "lucide-react";

interface Stat {
  value: string;
  label: string;
}

interface Value {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const STATS: Stat[] = [
  { value: "15+", label: "Years of Experience" },
  { value: "50K+", label: "Happy Customers" },
  { value: "10K+", label: "Products Available" },
  { value: "24/7", label: "Customer Support" },
];

const VALUES: Value[] = [
  {
    icon: Target,
    title: "Customer First",
    description:
      "We prioritize our customers health and well-being above everything else.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Star,
    title: "Quality Products",
    description:
      "We source only the highest quality medical supplies and healthcare products.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: TrendingUp,
    title: "Fast Delivery",
    description:
      "Quick and reliable delivery to ensure you get your products when you need them.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Globe,
    title: "Expert Team",
    description:
      "Our team of healthcare professionals is always ready to assist you.",
    gradient: "from-fuchsia-500 to-pink-500",
  },
];

const TEAM: TeamMember[] = [
  {
    name: "Dr. Robert Wilson",
    role: "Chief Pharmacist",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
  },
  {
    name: "Sarah Johnson",
    role: "Operations Manager",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
  },
  {
    name: "Dr. Emily Chen",
    role: "Healthcare Advisor",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
  },
];

const FEATURES_LIST: string[] = [
  "FDA-approved products only",
  "Licensed pharmacists on staff",
  "Secure and encrypted transactions",
  "Fast nationwide delivery",
];

const BREADCRUMB_ITEMS: BreadcrumbItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us" },
];

export const metadata: Metadata = {
  title: "About Us | MediStore",
  description:
    "Learn about MediStore - Your trusted partner in healthcare since 2010. Quality medical supplies and exceptional service.",
  openGraph: {
    title: "About Us | MediStore",
    description: "Your trusted partner in healthcare since 2010.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <main className="flex-1">
        <nav
          aria-label="Breadcrumb"
          className="relative overflow-hidden bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10 py-8 border-b border-slate-200/50 dark:border-slate-800/50"
        >
          <div className="absolute inset-0 backdrop-blur-3xl" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <ol className="flex items-center gap-3 text-sm font-medium">
              {BREADCRUMB_ITEMS.map((item, index) => (
                <Fragment key={item.label}>
                  {index > 0 && (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  )}
                  <li>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="text-slate-600 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors duration-200"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-slate-900 dark:text-white font-semibold">
                        {item.label}
                      </span>
                    )}
                  </li>
                </Fragment>
              ))}
            </ol>
          </div>
        </nav>

        <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-100 via-transparent to-transparent dark:from-cyan-950/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-violet-100 via-transparent to-transparent dark:from-violet-950/30" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-6 lg:space-y-8">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 backdrop-blur-xl rounded-full border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
                  <Heart className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-cyan-700 dark:text-cyan-300 font-semibold text-sm tracking-wide">
                    ABOUT MEDISTORE
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.05] tracking-tighter">
                  Redefining{" "}
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">
                      Healthcare
                    </span>
                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full" />
                  </span>{" "}
                  Excellence
                </h1>

                <div className="space-y-4">
                  <p className="text-slate-700 dark:text-slate-300 text-lg md:text-xl leading-relaxed font-medium">
                    Since 2010, MediStore has been dedicated to providing
                    high-quality medical supplies and healthcare products to
                    families across the nation.
                  </p>

                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Our mission is to make healthcare accessible and convenient
                    for everyone. With our extensive range of products and expert
                    team, we ensure that you and your loved ones have everything
                    you need to stay healthy and safe.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button
                    asChild
                    size="lg"
                    className="group relative overflow-hidden bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-700 hover:to-violet-700 text-white shadow-2xl shadow-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/50 hover:scale-[1.02] font-semibold px-8"
                  >
                    <Link href="/shop">
                      <span className="relative z-10 flex items-center">
                        Explore Products
                        <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500 transition-all duration-300 hover:scale-[1.02] font-semibold px-8"
                  >
                    <Link href="/contact">Get in Touch</Link>
                  </Button>
                </div>
              </div>

              <div className="relative lg:pl-8">
                <div className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl group border-4 border-white dark:border-slate-800">
                  <Image
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=800&fit=crop"
                    alt="MediStore healthcare facility"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-violet-500/20" />
                </div>

                <div className="absolute -bottom-8 -right-8 md:-bottom-12 md:-right-12 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-slate-200 dark:border-slate-800 max-w-xs backdrop-blur-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/30">
                      <Shield className="h-7 w-7 md:h-8 md:w-8 text-white" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white text-xl">
                        Certified
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        100% Authentic Products
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-gradient-to-br from-violet-400/30 to-purple-500/30 rounded-full blur-3xl" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-blue-600 to-violet-600" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {STATS.map((stat, index) => (
                <div
                  key={stat.label}
                  className="group text-center p-6 md:p-8 lg:p-10 rounded-3xl bg-white/10 backdrop-blur-2xl border-2 border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-default"
                >
                  <div className="text-3xl md:text-4xl lg:text-6xl font-black text-white mb-2 md:mb-4 transition-transform duration-300 group-hover:scale-110">
                    {stat.value}
                  </div>
                  <div className="text-white/95 font-bold text-xs md:text-sm lg:text-base tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 lg:py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 backdrop-blur-xl rounded-full border border-violet-500/30 mb-6 shadow-lg shadow-violet-500/10">
                <Zap className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                <span className="text-violet-700 dark:text-violet-300 font-semibold text-sm tracking-wide">
                  CORE VALUES
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                Why Choose{" "}
                <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
                  MediStore
                </span>
              </h2>

              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                We are committed to excellence in everything we do, from product
                quality to customer service.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {VALUES.map((value, index) => {
                const Icon = value.icon;
                return (
                  <article
                    key={value.title}
                    className="group relative bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-500 overflow-hidden hover:-translate-y-3 hover:border-violet-500/50"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500`}
                    />

                    <div className="relative">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </div>

                      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 transition-colors duration-300">
                        {value.title}
                      </h3>

                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[150px]" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="order-2 lg:order-1 space-y-6 lg:space-y-8">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl rounded-full border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
                  <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-cyan-700 dark:text-cyan-300 font-semibold text-sm tracking-wide">
                    OUR JOURNEY
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                  Excellence Through{" "}
                  <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">
                    Innovation
                  </span>
                </h2>

                <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed font-medium">
                  MediStore was founded with a simple vision: to make quality
                  healthcare products accessible to everyone. What started as a
                  small family pharmacy has grown into a trusted online
                  destination for medical supplies.
                </p>

                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Over the years, we have expanded our product range, improved
                  our services, and built lasting relationships with our
                  customers. Today, we serve thousands of families, helping them
                  maintain their health and well-being.
                </p>

                <div className="space-y-3 pt-4">
                  {FEATURES_LIST.map((feature, index) => (
                    <div
                      key={feature}
                      className="group flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-slate-900 dark:text-white font-bold">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-1 lg:order-2 relative">
                <div className="grid grid-cols-2 gap-6">
                  <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl group border-4 border-white dark:border-slate-800">
                    <Image
                      src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&h=800&fit=crop"
                      alt="Healthcare products"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl mt-12 group border-4 border-white dark:border-slate-800">
                    <Image
                      src="https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&h=800&fit=crop"
                      alt="Medical supplies"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                </div>

                <div className="absolute -inset-8 bg-gradient-to-br from-cyan-500/20 to-violet-500/20 rounded-[3rem] blur-3xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 lg:py-32 relative">
          <div className="absolute inset-0 bg-white dark:bg-slate-950" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500/20 to-fuchsia-500/20 backdrop-blur-xl rounded-full border border-pink-500/30 mb-6 shadow-lg shadow-pink-500/10">
                <Users className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                <span className="text-pink-700 dark:text-pink-300 font-semibold text-sm tracking-wide">
                  LEADERSHIP TEAM
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                Led by{" "}
                <span className="bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-600 bg-clip-text text-transparent">
                  Industry Experts
                </span>
              </h2>

              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                Our dedicated team of healthcare professionals is committed to
                providing you with the best service and advice.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto">
              {TEAM.map((member, index) => (
                <article
                  key={member.name}
                  className="group relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-500 text-center overflow-hidden hover:-translate-y-4 hover:border-violet-500/50"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative">
                    <div className="relative w-36 h-36 rounded-full overflow-hidden mx-auto mb-6 ring-4 ring-violet-500/30 group-hover:ring-violet-500/60 transition-all duration-500 shadow-2xl">
                      <Image
                        src={member.image}
                        alt={`${member.name} - ${member.role}`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="144px"
                      />
                    </div>

                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 transition-colors duration-300">
                      {member.name}
                    </h3>

                    <p className="text-violet-600 dark:text-violet-400 font-bold text-sm tracking-wide">
                      {member.role}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(255,255,255,0.2),transparent_60%)]" />

          <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px]" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                Transform Your Healthcare Experience Today
              </h2>

              <p className="text-white/95 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-medium">
                Browse our extensive collection of medical supplies and
                healthcare products. Quality products, competitive prices, and
                exceptional service await you.
              </p>

              <Button
                asChild
                size="lg"
                className="group bg-white text-violet-600 hover:bg-slate-50 font-black text-lg px-12 py-7 rounded-2xl shadow-2xl shadow-black/30 transition-all duration-300 hover:scale-105"
              >
                <Link href="/shop">
                  Start Shopping Now
                  <ChevronRight className="ml-2 h-6 w-6 transition-transform duration-300 group-hover:translate-x-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <Features />
      </main>
    </div>
  );
}
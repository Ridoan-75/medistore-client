import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Send,
  Heart,
  ShieldCheck,
  Truck,
  CreditCard,
  Clock,
  ArrowRight,
  LucideIcon,
} from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

interface SocialLink {
  icon: LucideIcon;
  href: string;
  label: string;
}

interface QuickLink {
  label: string;
  href: string;
}

interface ContactInfo {
  icon: LucideIcon;
  text: string;
  href?: string;
}

interface TrustBadge {
  icon: LucideIcon;
  text: string;
}

const SOCIAL_LINKS: SocialLink[] = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

const QUICK_LINKS: QuickLink[] = [
  { label: "About Us", href: "/about" },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
  { label: "FAQs", href: "/faq" },
];

const CUSTOMER_LINKS: QuickLink[] = [
  { label: "My Account", href: "/account" },
  { label: "Track Order", href: "/orders/track" },
  { label: "My Orders", href: "/orders" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Returns", href: "/returns" },
];

const CONTACT_INFO: ContactInfo[] = [
  {
    icon: MapPin,
    text: "Merul Badda, Dhaka, Bangladesh",
  },
  {
    icon: Phone,
    text: "(+880) 123-4567",
    href: "tel:+880123456789",
  },
  {
    icon: Mail,
    text: "support@medistore.com",
    href: "mailto:support@medistore.com",
  },
  {
    icon: Clock,
    text: "Mon - Sat: 8AM - 10PM",
  },
];

const TRUST_BADGES: TrustBadge[] = [
  { icon: ShieldCheck, text: "Secure Payment" },
  { icon: Truck, text: "Fast Delivery" },
  { icon: CreditCard, text: "Easy Returns" },
];

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="bg-foreground text-background relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] -z-10" />

      <div className="border-b border-background/10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {TRUST_BADGES.map((badge) => {
              const Icon = badge.icon;
              return (
                <div key={badge.text} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="font-semibold text-background/90">
                    {badge.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-background group-hover:text-primary transition-colors">
                MediStore
              </span>
            </Link>

            <p className="text-background/70 mb-6 leading-relaxed max-w-sm">
              Your trusted online pharmacy for quality medical supplies,
              healthcare products, and wellness essentials. FDA approved
              products with nationwide delivery.
            </p>

            <div className="flex items-center gap-3 mb-6">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-background/10 rounded-xl flex items-center justify-center hover:bg-primary hover:scale-110 transition-all"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>

            <div className="bg-background/5 rounded-2xl p-5 border border-background/10">
              <h4 className="font-semibold text-background mb-3 flex items-center gap-2">
                <Send className="h-4 w-4 text-primary" />
                Subscribe to Newsletter
              </h4>
              <p className="text-background/60 text-sm mb-4">
                Get health tips and exclusive offers directly in your inbox.
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/50 h-11 rounded-xl"
                />
                <Button className="bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 text-white h-11 px-5 rounded-xl shadow-lg shadow-primary/25">
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-background mb-5 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-primary rounded-full" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-primary hover:pl-2 transition-all inline-flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-background mb-5 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-primary rounded-full" />
              Customer
            </h3>
            <ul className="space-y-3">
              {CUSTOMER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-primary hover:pl-2 transition-all inline-flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-background mb-5 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-primary rounded-full" />
              Contact Us
            </h3>
            <ul className="space-y-4">
              {CONTACT_INFO.map((info, index) => {
                const Icon = info.icon;
                const content = (
                  <div className="flex items-start gap-3 group">
                    <div className="w-9 h-9 bg-background/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-background/70 text-sm group-hover:text-background transition-colors">
                      {info.text}
                    </span>
                  </div>
                );

                return (
                  <li key={index}>
                    {info.href ? (
                      <Link href={info.href} className="block">
                        {content}
                      </Link>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-background/60 text-sm flex items-center gap-1">
              © {CURRENT_YEAR} MediStore. Made with{" "}
              <Heart className="h-4 w-4 text-red-500 fill-red-500" /> in
              Bangladesh
            </p>

            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-background/60 hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="w-1 h-1 rounded-full bg-background/30" />
              <Link
                href="/terms"
                className="text-background/60 hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
              <span className="w-1 h-1 rounded-full bg-background/30" />
              <Link
                href="/returns"
                className="text-background/60 hover:text-primary transition-colors"
              >
                Return Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  LucideIcon,
  Linkedin,
} from "lucide-react";

/* ---------- Types ---------- */
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

/* ---------- Data ---------- */
const SOCIAL_LINKS: SocialLink[] = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

const QUICK_LINKS: QuickLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

const SPECIALTIES: QuickLink[] = [
  { label: "Anesthesiology", href: "/specialties/anesthesiology" },
  { label: "Psychiatry", href: "/specialties/psychiatry" },
  { label: "General surgery", href: "/specialties/general-surgery" },
  { label: "Family medicine", href: "/specialties/family-medicine" },
  { label: "Pediatrics", href: "/specialties/pediatrics" },
];

const SERVICES: QuickLink[] = [
  { label: "Medical", href: "/services/medical" },
  { label: "Operation", href: "/services/operation" },
  { label: "Laboratory", href: "/services/laboratory" },
  { label: "ICU", href: "/services/icu" },
  { label: "Patient Ward", href: "/services/patient-ward" },
];

const CONTACT_INFO: ContactInfo[] = [
  { icon: MapPin, text: "123 Road, Dhaka, Bangladesh" },
  { icon: Phone, text: "(+880)0000000", href: "tel:+8800000000" },
  { icon: Mail, text: "sajiburbedsr02@gmail.com", href: "mailto:sajiburbedsr02@gmail.com" },
];

const CURRENT_YEAR = new Date().getFullYear();

/* ---------- Component ---------- */
export function Footer() {
  return (
    <footer className="bg-[#2d5f4f] text-white mt-16">
      {/* ================= MAIN FOOTER ================= */}
      <div className="container mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Contact Section */}
          <div className="lg:col-span-1">
            <h3 className="font-bold text-white mb-6 text-base">
              Contact
            </h3>
            <ul className="space-y-4 text-sm">
              {CONTACT_INFO.map((info, index) => {
                const Icon = info.icon;
                const content = (
                  <div className="flex items-start gap-3 text-gray-300 hover:text-white transition">
                    <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{info.text}</span>
                  </div>
                );

                return (
                  <li key={index}>
                    {info.href ? (
                      <Link href={info.href}>
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

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-6 text-base">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h3 className="font-bold text-white mb-6 text-base">
              Specialties
            </h3>
            <ul className="space-y-3 text-sm">
              {SPECIALTIES.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-white mb-6 text-base">
              Services
            </h3>
            <ul className="space-y-3 text-sm">
              {SERVICES.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold text-white mb-6 text-base">
              Social Media
            </h3>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:bg-white hover:text-[#2d5f4f] transition"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="border-t border-gray-600">
        <div className="container mx-auto px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-3 text-sm">
          <p className="text-gray-300">
            © {CURRENT_YEAR} HEALTHU. All rights reserved.
          </p>

          <div className="flex gap-6">
            <Link href="/terms" className="text-gray-300 hover:text-white transition">
              Terms and Conditions
            </Link>
            <Link href="/privacy" className="text-gray-300 hover:text-white transition">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
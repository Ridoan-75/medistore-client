"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import {
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  HelpCircle,
  Headphones,
  ExternalLink,
  User,
  FileText,
  LucideIcon,
  Sparkles,
  Zap,
  Globe,
} from "lucide-react";

interface ContactAction {
  label: string;
  href: string;
}

interface ContactInfo {
  icon: LucideIcon;
  title: string;
  details: string[];
  action: ContactAction | null;
  gradient: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const CONTACT_INFO: ContactInfo[] = [
  {
    icon: MapPin,
    title: "Our Location",
    details: ["123 Healthcare Ave", "Medical District, NY 10001"],
    action: { label: "Get Directions", href: "#" },
    gradient: "from-indigo-400 to-purple-600",
  },
  {
    icon: Phone,
    title: "Phone Number",
    details: ["(+880) 123-4567", "+1 (800) 987-6543"],
    action: { label: "Call Now", href: "tel:+18001234567" },
    gradient: "from-cyan-400 to-blue-600",
  },
  {
    icon: Mail,
    title: "Email Address",
    details: ["support@medistore.com", "info@medistore.com"],
    action: { label: "Send Email", href: "mailto:support@medistore.com" },
    gradient: "from-orange-400 to-red-600",
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: ["Mon - Fri: 8:00 AM - 8:00 PM", "Sat - Sun: 9:00 AM - 6:00 PM"],
    action: null,
    gradient: "from-violet-400 to-fuchsia-600",
  },
];

const FAQS: FAQ[] = [
  {
    question: "How long does delivery take?",
    answer:
      "Standard delivery takes 3-5 business days. Express delivery is available for 1-2 business days at an additional cost.",
  },
  {
    question: "Do you offer returns?",
    answer:
      "Yes, we offer a 30-day return policy for unopened items in their original packaging. Some medical supplies may have different return policies.",
  },
  {
    question: "Are your products FDA approved?",
    answer:
      "Yes, all our medical supplies and healthcare products are FDA approved and sourced from licensed manufacturers.",
  },
  {
    question: "Do you offer prescription services?",
    answer:
      "Yes, we have licensed pharmacists on staff who can help with prescription medications. Please contact us for more details.",
  },
];

const INITIAL_FORM_DATA: FormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    setFormSubmitted(true);
    setFormData(INITIAL_FORM_DATA);

    setTimeout(() => setFormSubmitted(false), 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50/30 dark:from-indigo-950/20 dark:via-slate-900 dark:to-purple-950/20">
      <main className="flex-1">
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-fuchsia-500/10 py-8 border-b border-indigo-200/50 dark:border-indigo-800/50">
          <div className="absolute inset-0 backdrop-blur-3xl" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <nav className="flex items-center gap-3 text-sm font-medium">
              <Link
                href="/"
                className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
              >
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <span className="text-slate-900 dark:text-white font-semibold">Contact Us</span>
            </nav>
          </div>
        </div>

        <section className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-transparent dark:from-indigo-950/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-100 via-transparent to-transparent dark:from-purple-950/30" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-xl rounded-full border border-indigo-500/30 mb-8 shadow-lg shadow-indigo-500/10">
              <MessageCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-indigo-700 dark:text-indigo-300 font-semibold text-sm tracking-wide">
                CONTACT US
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white mb-8 leading-[1.1] tracking-tighter">
              Lets Start a{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Conversation
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-full" />
              </span>
            </h1>

            <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
              Have questions about our products or services? We&apos;re here to help.
              Reach out to us and our team will get back to you as soon as possible.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {CONTACT_INFO.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div
                    key={info.title}
                    className="group bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-500 hover:-translate-y-3"
                  >
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${info.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>

                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">
                      {info.title}
                    </h3>

                    <div className="space-y-2 mb-5">
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                          {detail}
                        </p>
                      ))}
                    </div>

                    {info.action && (
                      <Link
                        href={info.action.href}
                        className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:gap-3 transition-all duration-300"
                      >
                        {info.action.label}
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 md:p-10 shadow-2xl">
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30">
                    <Send className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                      Send Message
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 font-semibold">
                      Response within 24 hours
                    </p>
                  </div>
                </div>

                {formSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 rounded-full blur-2xl animate-pulse" />
                      <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center shadow-2xl">
                        <CheckCircle className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                      Message Delivered!
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-center max-w-sm font-medium">
                      Thank you for contacting us. We&apos;ll get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                          <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          Your Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                          className="h-14 text-base border-2 rounded-xl border-slate-300 dark:border-slate-700"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="email" className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                          <Mail className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                          className="h-14 text-base border-2 rounded-xl border-slate-300 dark:border-slate-700"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="phone" className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                          <Phone className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="(+880) 123-4567"
                          className="h-14 text-base border-2 rounded-xl border-slate-300 dark:border-slate-700"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="subject" className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                          <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          Subject <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="How can we help?"
                          required
                          className="h-14 text-base border-2 rounded-xl border-slate-300 dark:border-slate-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="message" className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                        <MessageCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        Your Message <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        required
                        className="text-base border-2 rounded-xl resize-none border-slate-300 dark:border-slate-700"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-16 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-2xl shadow-indigo-500/30 font-black text-lg rounded-2xl transition-all duration-300 hover:scale-105"
                    >
                      {isLoading ? (
                        <>
                          <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="h-6 w-6 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>

              <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 border-2 border-indigo-500 rounded-[2rem] overflow-hidden shadow-2xl relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />

                <div className="relative h-full min-h-[600px] flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="relative inline-block mb-8">
                      <div className="absolute inset-0 bg-white/20 rounded-3xl blur-2xl scale-150 animate-pulse" />
                      <div className="relative w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-2xl border-2 border-white/30">
                        <MapPin className="h-12 w-12 text-white" />
                      </div>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
                      Visit Our Office
                    </h3>

                    <p className="text-white/90 text-lg mb-8 max-w-sm mx-auto font-medium">
                      123 Healthcare Ave, Medical District, NY 10001
                    </p>

                    <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-white/90 font-black shadow-2xl mb-12 px-8 h-14 rounded-2xl">
                      <Link
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="h-5 w-5 mr-2" />
                        Open Google Maps
                        <ExternalLink className="h-5 w-5 ml-2" />
                      </Link>
                    </Button>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20">
                        <div className="text-4xl font-black text-white mb-2">24/7</div>
                        <div className="text-white/90 font-bold">Support</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20">
                        <div className="text-4xl font-black text-white mb-2">{"<"}1hr</div>
                        <div className="text-white/90 font-bold">Response</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500/20 to-purple-500/20 backdrop-blur-xl rounded-full border border-violet-500/30 mb-8 shadow-lg shadow-violet-500/10">
                <HelpCircle className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                <span className="text-violet-700 dark:text-violet-300 font-semibold text-sm tracking-wide">
                  COMMON QUESTIONS
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                Frequently Asked{" "}
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Questions
                </span>
              </h2>

              <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                Find quick answers to common questions about our services.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-5">
              {FAQS.map((faq, index) => (
                <div
                  key={index}
                  className="group bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      <span className="text-white font-black text-lg">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {faq.question}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(255,255,255,0.15),transparent_60%)]" />

          <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px]" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-white/20 rounded-3xl blur-2xl scale-150 animate-pulse" />
                <div className="relative w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto shadow-2xl border-2 border-white/30">
                  <Headphones className="h-10 w-10 text-white" />
                </div>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                Need Urgent Help?
              </h2>

              <p className="text-white/95 text-lg md:text-xl max-w-2xl mx-auto font-semibold">
                Our customer support team is available 24/7 to help you with any questions.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center pt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-indigo-600 hover:bg-white/95 font-black text-lg shadow-2xl h-16 px-10 rounded-2xl hover:scale-105 transition-all duration-300"
                >
                  <Link href="tel:+18001234567">
                    <Phone className="h-6 w-6 mr-2" />
                    Call (+880) 123-4567
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  className="bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white hover:bg-white/20 font-black text-lg h-16 px-10 rounded-2xl hover:scale-105 transition-all duration-300"
                >
                  <Link href="mailto:support@medistore.com">
                    <Mail className="h-6 w-6 mr-2" />
                    Email Support
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { ArrowRight } from "lucide-react";

export function PromoBanners() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* COVID-19 Banner */}
          <div className="relative rounded-2xl overflow-hidden bg-accent/20 min-h-47.5">
            <Image
              src="/images/covid-banner.jpg"
              alt="COVID-19 Prevention"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-foreground/80 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center p-8">
              <span className="text-background/80 text-sm font-medium mb-2">
                Home Medical Supplies
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-background mb-2">
                CORONA COVID-19
              </h2>
              <p className="text-background/80 text-lg mb-4">
                Prevention & Care Supplies
              </p>
              <Link href="/shop?category=covid">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-fit">
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Home Medical Banner */}
          <div className="relative rounded-2xl overflow-hidden bg-primary/20 min-h-47.5">
            <Image
              src="/images/home-medical-banner.jpg"
              alt="Home Medical"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-foreground/70 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center p-8">
              <span className="text-background/80 text-sm font-medium mb-2">
                Home Medical Supplies
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-background mb-2">
                Home Medical
              </h2>
              <p className="text-background/80 text-lg mb-4">
                Essential Medical Supplies for Your Home
              </p>
              <Link href="/shop?category=home-medical">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-fit">
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Quote,
  Star,
  MessageSquare,
  Pause,
  Play,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface Testimonial {
  id: number;
  content: string;
  author: string;
  role: string;
  rating: number;
  image?: string;
  location?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    content:
      "I ordered my diabetes medicine and it arrived within 2 days. All products are genuine and prices are very reasonable. Great service!",
    author: "Karim Ahmed",
    role: "Regular Customer",
    rating: 5,
    location: "Dhaka",
  },
  {
    id: 2,
    content:
      "Best online medicine store in Bangladesh. I regularly buy my father's heart medicines here. Fast delivery and authentic products every time.",
    author: "Fatima Rahman",
    role: "Verified Buyer",
    rating: 5,
    location: "Sylhet",
  },
  {
    id: 3,
    content:
      "Excellent customer service and quality medical supplies. I bought a blood pressure monitor and it works perfectly. Highly recommended!",
    author: "Rahim Islam",
    role: "Healthcare Professional",
    rating: 5,
    location: "Chittagong",
  },
];

const AUTO_SLIDE_INTERVAL = 5000;

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const totalSlides = TESTIMONIALS.length;
  const activeTestimonial = TESTIMONIALS[activeIndex];

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying((prev) => !prev);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextSlide, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-muted/50 to-background relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-4">
            <MessageSquare className="h-4 w-4 text-primary" />
            <span className="text-primary font-medium text-sm">
              Customer Reviews
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our{" "}
            <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Customers
            </span>{" "}
            Say
          </h2>

          <p className="text-muted-foreground max-w-md mx-auto">
            Trusted by thousands of customers across Bangladesh
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-card border-2 border-border rounded-3xl p-6 md:p-10 lg:p-12 shadow-xl">
            <div className="absolute top-6 right-6 md:top-8 md:right-8">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Quote className="h-8 w-8 md:h-10 md:w-10 text-primary" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center">
              <div className="shrink-0">
                {activeTestimonial.image ? (
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden ring-4 ring-primary/20">
                    <Image
                      src={activeTestimonial.image}
                      alt={activeTestimonial.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center ring-4 ring-primary/20 shadow-lg shadow-primary/25">
                    <span className="text-2xl md:text-3xl font-bold text-white">
                      {getInitials(activeTestimonial.author)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex gap-1 justify-center md:justify-start mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < activeTestimonial.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium text-amber-600 dark:text-amber-400">
                    {activeTestimonial.rating}.0
                  </span>
                </div>

                <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-6">
                  &ldquo;{activeTestimonial.content}&rdquo;
                </blockquote>

                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <div>
                    <p className="font-bold text-foreground text-lg">
                      {activeTestimonial.author}
                    </p>
                    <p className="text-sm text-primary font-medium">
                      {activeTestimonial.role}
                    </p>
                  </div>

                  {activeTestimonial.location && (
                    <>
                      <div className="hidden md:block w-px h-8 bg-border" />
                      <p className="text-sm text-muted-foreground">
                        📍 {activeTestimonial.location}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevSlide}
                  className="h-10 w-10 rounded-xl border-2 hover:bg-primary/5 hover:border-primary/50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextSlide}
                  className="h-10 w-10 rounded-xl border-2 hover:bg-primary/5 hover:border-primary/50"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center gap-3">
                {TESTIMONIALS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? "w-8 bg-primary"
                        : "w-2 bg-primary/30 hover:bg-primary/50"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleAutoPlay}
                className="h-10 w-10 rounded-xl hover:bg-primary/5"
              >
                {isAutoPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 md:gap-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">10K+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div className="w-px h-10 bg-border hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">4.9</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="w-px h-10 bg-border hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">99%</div>
              <div className="text-sm text-muted-foreground">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
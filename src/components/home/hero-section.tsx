'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const slides = [
  {
    id: 1,
    title: "Your Prescription for Affordable Health Solutions!",
    description: "Elevate your health journey with exclusive discounts and unparalleled convenience. Your path to well-being starts here, where every purchase is a prescription for savings.",
    buttonText: "Start Shopping",
    image: "/images/doctor-004.png",
    gradient: "from-emerald-600 via-teal-600 to-cyan-600"
  },
  {
    id: 2,
    title: "Quality Medicines Delivered to Your Doorstep",
    description: "Get genuine medications delivered fast and secure. Your health is our priority, with verified products and professional care every step of the way.",
    buttonText: "Order Now",
    image: "/images/doctor-003.png",
    gradient: "from-blue-600 via-indigo-600 to-purple-600"
  },
  {
    id: 3,
    title: "Save More on Healthcare Essentials Today",
    description: "Exclusive deals on medicines, supplements, and wellness products. Join thousands of satisfied customers saving on their health needs every day.",
    buttonText: "Explore Deals",
    image: "/images/doctor-002.png",
    gradient: "from-violet-600 via-purple-600 to-fuchsia-600"
  },
  {
    id: 4,
    title: "Expert Medical Consultation Available 24/7",
    description: "Connect with certified healthcare professionals anytime. Get instant medical advice and prescription services right from the comfort of your home.",
    buttonText: "Consult Now",
    image: "/images/doctor-001.png",
    gradient: "from-rose-600 via-pink-600 to-red-600"
  }
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [currentSlide])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <section className={`bg-gradient-to-r ${slides[currentSlide].gradient} relative overflow-hidden transition-all duration-1000 ease-in-out`}>
      {/* Fixed Height Container - Same size for all slides */}
      <div className="container mx-auto px-4 h-[600px] md:h-[650px] lg:h-[700px] flex items-center">
        
        {/* Slides Container */}
        <div className="w-full grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Content - Text (Fixed Width) */}
          <div className="text-white space-y-6 max-w-2xl">
            <h1 
              key={`title-${currentSlide}`}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fadeIn"
            >
              {slides[currentSlide].title}
            </h1>
            
            <p 
              key={`desc-${currentSlide}`}
              className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed animate-fadeIn"
            >
              {slides[currentSlide].description}
            </p>

            <div 
              key={`btn-${currentSlide}`}
              className="pt-4 animate-fadeIn"
            >
              <Button 
                size="lg" 
                className="bg-white text-gray-900 cursor-pointer hover:bg-white/90 font-semibold text-base md:text-lg px-6 md:px-8 py-5 md:py-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                {slides[currentSlide].buttonText}
              </Button>
            </div>
          </div>

          {/* Right Content - Image (Fixed Size Container) */}
          <div className="relative h-[400px] md:h-[500px] lg:h-[550px] w-full flex items-center justify-center">
            <div 
              key={`img-${currentSlide}`}
              className="relative w-full h-full animate-fadeIn"
            >
              <Image 
                src={slides[currentSlide].image}
                alt="Doctor"
                fill
                className="object-contain drop-shadow-2xl"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 right-2 md:right-4 flex justify-between items-center pointer-events-none z-10">
          <Button
            onClick={prevSlide}
            variant="ghost"
            size="icon"
            className="pointer-events-auto cursor-pointer bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full w-10 h-10 md:w-12 md:h-12 transition-all duration-300 shadow-lg"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </Button>

          <Button
            onClick={nextSlide}
            variant="ghost"
            size="icon"
            className="pointer-events-auto cursor-pointer bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full w-10 h-10 md:w-12 md:h-12 transition-all duration-300 shadow-lg"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </Button>
        </div>
      </div>

      {/* Dots Indicator - Outside container */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex justify-center gap-2 md:gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === index 
                ? 'bg-white w-8 md:w-10 h-2 md:h-2.5' 
                : 'bg-white/50 w-2 md:w-2.5 h-2 md:h-2.5 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
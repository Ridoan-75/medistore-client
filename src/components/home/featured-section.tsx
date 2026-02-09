// components/featured-section.tsx

import { Truck, Shield, Tag, Clock } from 'lucide-react'

export default function FeaturedSection() {
  const features = [
    { 
      icon: Truck, 
      title: 'Fast Delivery',
      color: 'from-emerald-500 to-teal-500',
    },
    { 
      icon: Shield, 
      title: 'Quality Products',
      color: 'from-blue-500 to-cyan-500',
    },
    { 
      icon: Tag, 
      title: 'Best Price',
      color: 'from-violet-500 to-purple-500',
    },
    { 
      icon: Clock, 
      title: '24/7 Support',
      color: 'from-rose-500 to-pink-500',
    },
  ]

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-2xl md:text-3xl font-bold mb-8 text-gray-900">
          Why Choose Us
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative"
            >
              <div className={`
                bg-gradient-to-br ${feature.color}
                text-white p-6 rounded-xl text-center
                transform transition-all duration-300
                hover:scale-105 hover:-translate-y-1
                hover:shadow-xl
                cursor-pointer
              `}>
                <feature.icon className="
                  w-10 h-10 md:w-12 md:h-12 mx-auto mb-3
                  transition-transform duration-300
                  group-hover:scale-110
                " />
                <p className="font-semibold text-sm md:text-base">
                  {feature.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
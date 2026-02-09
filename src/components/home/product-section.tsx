// components/sections/product-section.tsx

import MedicineCard from '@/components/shared/medicine-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ProductSection() {
  const featuredMedicines = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      price: 50,
      image: '/images/medicine-1.png',
      manufacturer: 'Square Pharmaceuticals',
      stock: 100,
    },
    {
      id: '2',
      name: 'Napa Extend 665mg',
      price: 80,
      image: '/images/medicine-2.png',
      manufacturer: 'Beximco Pharma',
      stock: 15,
    },
    {
      id: '3',
      name: 'Sergel 20mg',
      price: 120,
      image: '/images/medicine-3.png',
      manufacturer: 'Incepta Pharma',
      stock: 50,
    },
    {
      id: '4',
      name: 'Maxpro 20mg',
      price: 150,
      image: '/images/medicine-4.png',
      manufacturer: 'Renata Limited',
      stock: 3,
    },
    {
      id: '5',
      name: 'Ace 5mg',
      price: 60,
      image: '/images/medicine-5.png',
      manufacturer: 'Square Pharmaceuticals',
      stock: 200,
    },
    {
      id: '6',
      name: 'Filmet 400mg',
      price: 90,
      image: '/images/medicine-6.png',
      manufacturer: 'ACI Limited',
      stock: 75,
    },
    {
      id: '7',
      name: 'Fexo 120mg',
      price: 45,
      image: '/images/medicine-7.png',
      manufacturer: 'Opsonin Pharma',
      stock: 120,
    },
    {
      id: '8',
      name: 'Monas 10mg',
      price: 110,
      image: '/images/medicine-8.png',
      manufacturer: 'Healthcare Pharma',
      stock: 40,
    },
  ]

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Featured Medicines
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Quality medications at best prices
          </p>
        </div>

        {/* Medicine Grid - Perfect Responsive */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {featuredMedicines.map((medicine) => (
            <MedicineCard key={medicine.id} medicine={medicine} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8 md:mt-12">
          <Button 
            asChild 
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto cursor-pointer"
          >
            <Link href="/products">
              View All Medicines
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Heart, X } from 'lucide-react'
import MedicineCard from '@/components/shared/medicine-card'
import { Button } from '@/components/ui/button'

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([
    { id: '1', name: 'Paracetamol 500mg', price: 50, image: '/images/medicine-1.jpg', manufacturer: 'Square Pharmaceuticals', stock: 100 },
    { id: '2', name: 'Napa Extend 665mg', price: 80, image: '/images/medicine-2.jpg', manufacturer: 'Beximco Pharma', stock: 15 },
    { id: '3', name: 'Sergel 20mg', price: 120, image: '/images/medicine-3.jpg', manufacturer: 'Incepta Pharma', stock: 50 },
    { id: '4', name: 'Maxpro 20mg', price: 150, image: '/images/medicine-4.jpg', manufacturer: 'Renata Limited', stock: 3 },
  ])

  const removeFromWishlist = (id: string) => {
    setWishlistItems(items => items.filter(item => item.id !== id))
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <Heart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8">
              Save medicines you love to buy them later
            </p>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/shop">Browse Medicines</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">Wishlist</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="text-muted-foreground">{wishlistItems.length} items</p>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="relative">
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="absolute top-2 right-2 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <X className="w-4 h-4 text-red-600" />
              </button>
              <MedicineCard medicine={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
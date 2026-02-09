import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Medicine {
  id: string
  name: string
  price: number
  image: string
  manufacturer: string
  stock: number
}

interface MedicineCardProps {
  medicine: Medicine
}

export default function MedicineCard({ medicine }: MedicineCardProps) {
  // Stock badge color
  const getStockBadge = () => {
    if (medicine.stock > 20) return <Badge className="bg-green-500">In Stock</Badge>
    if (medicine.stock > 5) return <Badge className="bg-yellow-500">Low Stock</Badge>
    return <Badge className="bg-red-500">Out of Stock</Badge>
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        {/* Image */}
        <div className="relative aspect-square mb-4 cursor-pointer">
          <Image 
            src={medicine.image} 
            alt={medicine.name}
            fill
            className="object-cover rounded"
          />
          {/* Stock Badge - Top Right */}
          <div className="absolute top-2 right-2">
            {getStockBadge()}
          </div>
        </div>

        {/* Medicine Name */}
        <Link href={`/shop/${medicine.id}`}>
          <h3 className="font-bold text-lg mb-2 hover:text-blue-600 line-clamp-1 cursor-pointer">
            {medicine.name}
          </h3>
        </Link>

        {/* Price */}
        <p className="text-2xl font-bold text-green-600 mb-1">
          ৳{medicine.price}
        </p>

        {/* Manufacturer */}
        <p className="text-sm text-gray-600 mb-4">
          {medicine.manufacturer}
        </p>

        {/* Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className='cursor-pointer'>
            <Heart className="w-4 h-4" />
          </Button>
          <Button className="flex-1 cursor-pointer">
            <ShoppingCart className="w-4 h-4 mr-2 " />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
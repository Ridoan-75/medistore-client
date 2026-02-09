'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Heart, ShoppingCart, Truck, RotateCcw, ShieldCheck, Star, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import MedicineCard from '@/components/shared/medicine-card'

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [rating, setRating] = useState(0)

  // Mock product data - ekhane pore API theke fetch hobe
  const product = {
    id: params.id,
    name: 'Paracetamol 500mg',
    category: 'Pain Relief',
    manufacturer: 'Square Pharmaceuticals',
    price: 50,
    originalPrice: 65,
    stock: 100,
    rating: 4.5,
    reviewsCount: 24,
    description: 'Paracetamol is a common painkiller used to treat aches and pain. It can also be used to reduce a high temperature. It is available combined with other painkillers and anti-sickness medicines.',
    images: [
      '/images/medicine-1.jpg',
      '/images/medicine-2.jpg',
      '/images/medicine-3.jpg',
      '/images/medicine-4.jpg',
    ],
    specifications: {
      'Generic Name': 'Paracetamol',
      'Strength': '500mg',
      'Dosage Form': 'Tablet',
      'Pack Size': '10 tablets',
      'Prescription Required': 'No',
      'Manufacturer': 'Square Pharmaceuticals Ltd.',
      'Country of Origin': 'Bangladesh'
    },
    features: [
      'Effective pain relief',
      'Reduces fever',
      'Suitable for adults and children over 12 years',
      'Can be taken with or without food'
    ]
  }

  // Mock related products
  const relatedProducts = [
    {
      id: '2',
      name: 'Napa Extend 665mg',
      price: 80,
      image: '/images/medicine-2.jpg',
      manufacturer: 'Beximco Pharma',
      stock: 15,
    },
    {
      id: '3',
      name: 'Sergel 20mg',
      price: 120,
      image: '/images/medicine-3.jpg',
      manufacturer: 'Incepta Pharma',
      stock: 50,
    },
    {
      id: '4',
      name: 'Maxpro 20mg',
      price: 150,
      image: '/images/medicine-4.jpg',
      manufacturer: 'Renata Limited',
      stock: 3,
    },
    {
      id: '5',
      name: 'Ace 5mg',
      price: 60,
      image: '/images/medicine-5.jpg',
      manufacturer: 'Square Pharmaceuticals',
      stock: 200,
    },
  ]

  // Mock reviews
  const reviews = [
    {
      id: 1,
      name: 'John Doe',
      rating: 5,
      date: '2024-01-15',
      comment: 'Very effective medicine. Quick relief from headache.',
      avatar: '/images/avatar-1.jpg'
    },
    {
      id: 2,
      name: 'Jane Smith',
      rating: 4,
      date: '2024-01-10',
      comment: 'Good quality product. Recommended!',
      avatar: '/images/avatar-2.jpg'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      rating: 5,
      date: '2024-01-05',
      comment: 'Fast delivery and authentic product.',
      avatar: '/images/avatar-3.jpg'
    },
  ]

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase' && quantity < product.stock) {
      setQuantity(quantity + 1)
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const getStockBadge = () => {
    if (product.stock > 20) return <Badge className="bg-green-500">In Stock</Badge>
    if (product.stock > 5) return <Badge className="bg-yellow-500">Low Stock</Badge>
    return <Badge className="bg-red-500">Out of Stock</Badge>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/shop" className="hover:text-emerald-600">Shop</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Left - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-emerald-600 ring-2 ring-emerald-200' 
                      : 'border-gray-200 hover:border-emerald-400'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right - Product Details */}
          <div className="space-y-6">
            {/* Category Badge */}
            <Badge variant="outline" className="text-emerald-600 border-emerald-600">
              {product.category}
            </Badge>

            {/* Product Name */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              {/* Rating & Reviews */}
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewsCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-emerald-600">
                ৳{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ৳{product.originalPrice}
                </span>
              )}
              <Badge className="bg-red-500">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </Badge>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {getStockBadge()}
              <span className="text-sm text-muted-foreground">
                {product.stock} units available
              </span>
            </div>

            {/* Short Description */}
            <p className="text-muted-foreground">{product.description}</p>

            {/* Manufacturer */}
            <div>
              <p className="text-sm text-muted-foreground">Manufacturer</p>
              <p className="font-semibold">{product.manufacturer}</p>
            </div>

            <Separator />

            {/* Quantity Selector */}
            <div>
              <Label className="mb-2 block">Quantity</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange('decrease')}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-xl font-semibold w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange('increase')}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1"
              >
                <Heart className="w-5 h-5 mr-2" />
                Add to Wishlist
              </Button>
              <Button 
                size="lg" 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-3 gap-3">
              <Card>
                <CardContent className="p-4 text-center">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
                  <p className="text-xs font-medium">Free Delivery</p>
                  <p className="text-xs text-muted-foreground">On orders over ৳500</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <ShieldCheck className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
                  <p className="text-xs font-medium">100% Authentic</p>
                  <p className="text-xs text-muted-foreground">Genuine products</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <RotateCcw className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
                  <p className="text-xs font-medium">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">7 days return</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Card className="mb-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger 
                value="description" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent"
              >
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="specifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger 
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent"
              >
                Reviews ({product.reviewsCount})
              </TabsTrigger>
            </TabsList>

            {/* Description Tab */}
            <TabsContent value="description" className="p-6">
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                <p className="mb-4">{product.description}</p>
                
                <h4 className="font-semibold mb-2">Key Features:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            {/* Specifications Tab */}
            <TabsContent value="specifications" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b">
                    <span className="font-medium">{key}:</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="p-6">
              <div className="space-y-6">
                {/* Write Review Form */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                    
                    {/* Star Rating */}
                    <div className="mb-4">
                      <Label className="mb-2 block">Your Rating</Label>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setRating(i + 1)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                i < rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Review Text */}
                    <div className="mb-4">
                      <Label htmlFor="review" className="mb-2 block">Your Review</Label>
                      <Textarea 
                        id="review"
                        placeholder="Share your experience with this product..."
                        rows={4}
                      />
                    </div>

                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      Submit Review
                    </Button>
                  </CardContent>
                </Card>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-semibold text-emerald-600">
                              {review.name.charAt(0)}
                            </span>
                          </div>

                          {/* Review Content */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{review.name}</h4>
                              <span className="text-sm text-muted-foreground">
                                {review.date}
                              </span>
                            </div>

                            {/* Stars */}
                            <div className="flex mb-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>

                            <p className="text-muted-foreground">{review.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <MedicineCard key={product.id} medicine={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
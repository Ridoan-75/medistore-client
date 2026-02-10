'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')

  // Mock order data
  const order = {
    id: params.id,
    date: '2024-02-08',
    status: 'delivered',
    items: [
      { id: 1, name: 'Paracetamol 500mg', quantity: 2, price: 50, image: '/images/medicine-1.jpg' },
      { id: 2, name: 'Napa Extend 665mg', quantity: 1, price: 80, image: '/images/medicine-2.jpg' },
    ],
    shippingAddress: '123 Main Street, Gulshan, Dhaka - 1212, Bangladesh',
    paymentMethod: 'Cash on Delivery',
    subtotal: 180,
    delivery: 50,
    total: 230
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, string> = {
      delivered: 'bg-green-100 text-green-700',
      shipped: 'bg-blue-100 text-blue-700',
      processing: 'bg-yellow-100 text-yellow-700',
      placed: 'bg-purple-100 text-purple-700',
      cancelled: 'bg-red-100 text-red-700',
    }
    return config[status] || ''
  }

  const handleReviewSubmit = (itemId: number) => {
    console.log('Review submitted:', { itemId, rating, review })
    setRating(0)
    setReview('')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/orders">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Order Details</h1>
            <p className="text-muted-foreground">Order {params.id}</p>
          </div>
          <Badge className={`${getStatusBadge(order.status)} text-base px-4 py-2`}>
            {order.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Order Placed', status: 'completed', date: '2024-02-08, 10:30 AM' },
                    { label: 'Processing', status: 'completed', date: '2024-02-08, 02:15 PM' },
                    { label: 'Shipped', status: 'completed', date: '2024-02-09, 09:00 AM' },
                    { label: 'Delivered', status: 'completed', date: '2024-02-10, 03:45 PM' },
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.status === 'completed' 
                          ? 'bg-green-100 dark:bg-green-900/30' 
                          : 'bg-gray-100'
                      }`}>
                        <div className={`w-3 h-3 rounded-full ${
                          step.status === 'completed' ? 'bg-green-600' : 'bg-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1 pt-2">
                        <p className="font-semibold">{step.label}</p>
                        <p className="text-sm text-muted-foreground">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id}>
                    <div className="flex gap-4 pb-4">
                      <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-gray-100">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        <p className="text-lg font-bold text-emerald-600 mt-1">
                          ৳{item.price * item.quantity}
                        </p>
                      </div>
                    </div>

                    {/* Review Section (if delivered) */}
                    {order.status === 'delivered' && (
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Label className="block mb-2">Rate this product</Label>
                        <div className="flex gap-1 mb-3">
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
                        <Textarea
                          placeholder="Write your review..."
                          value={review}
                          onChange={(e) => setReview(e.target.value)}
                          rows={3}
                          className="mb-2"
                        />
                        <Button 
                          size="sm" 
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleReviewSubmit(item.id)}
                        >
                          Submit Review
                        </Button>
                      </div>
                    )}
                    
                    {order.items.length > 1 && item.id !== order.items[order.items.length - 1].id && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{order.shippingAddress}</p>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">{order.paymentMethod}</p>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">৳{order.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-semibold">৳{order.delivery}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-emerald-600">৳{order.total}</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {order.status === 'delivered' && (
              <Button variant="outline" className="w-full">
                Download Invoice
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
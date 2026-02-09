'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MedicineForm from '@/components/seller/medicine-form'
import Link from 'next/link'

export default function EditMedicinePage({ params }: { params: { id: string } }) {
  const router = useRouter()

  // Mock existing medicine data
  const medicineData = {
    id: params.id,
    name: 'Paracetamol 500mg',
    category: 'Pain Relief',
    manufacturer: 'Square Pharmaceuticals',
    price: 50,
    stock: 100,
    description: 'Paracetamol is a common painkiller used to treat aches and pain.',
    specifications: 'Generic Name: Paracetamol\nStrength: 500mg\nDosage Form: Tablet',
    image: '/images/medicine-1.jpg'
  }

  const handleSubmit = (data: any) => {
    console.log('Update medicine:', params.id, data)
    router.push('/seller/medicines')
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/seller/medicines">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Edit Medicine</h2>
          <p className="text-muted-foreground">Update medicine information</p>
        </div>
      </div>

      {/* Form */}
      <MedicineForm 
        initialData={medicineData}
        onSubmit={handleSubmit} 
        onCancel={handleCancel} 
      />
    </div>
  )
}
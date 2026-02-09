'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MedicineForm from '@/components/seller/medicine-form'
import Link from 'next/link'

export default function AddMedicinePage() {
  const router = useRouter()

  const handleSubmit = (data: any) => {
    console.log('Add medicine:', data)
    // Pore API call hobe
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
          <h2 className="text-2xl font-bold">Add New Medicine</h2>
          <p className="text-muted-foreground">Fill in the details to add a new medicine</p>
        </div>
      </div>

      {/* Form */}
      <MedicineForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  )
}
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import FilterSidebar from '@/components/shared/filter-sidebar'
import MedicineCard from '@/components/shared/medicine-card'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Filter } from 'lucide-react'

export default function ShopPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('featured')

  // Mock medicines data (expanded for pagination)
  const allMedicines = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      price: 50,
      image: '/images/medicine-1.jpg',
      manufacturer: 'Square Pharmaceuticals',
      stock: 100,
    },
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
    {
      id: '6',
      name: 'Filmet 400mg',
      price: 90,
      image: '/images/medicine-6.jpg',
      manufacturer: 'ACI Limited',
      stock: 75,
    },
    {
      id: '7',
      name: 'Fexo 120mg',
      price: 45,
      image: '/images/medicine-7.jpg',
      manufacturer: 'Opsonin Pharma',
      stock: 120,
    },
    {
      id: '8',
      name: 'Monas 10mg',
      price: 110,
      image: '/images/medicine-8.jpg',
      manufacturer: 'Healthcare Pharma',
      stock: 40,
    },
    {
      id: '9',
      name: 'Amdocal 500mg',
      price: 95,
      image: '/images/medicine-9.jpg',
      manufacturer: 'Square Pharmaceuticals',
      stock: 85,
    },
    {
      id: '10',
      name: 'Vitacal Plus',
      price: 180,
      image: '/images/medicine-10.jpg',
      manufacturer: 'Renata Limited',
      stock: 25,
    },
    {
      id: '11',
      name: 'Cotrim 480mg',
      price: 55,
      image: '/images/medicine-11.jpg',
      manufacturer: 'Beximco Pharma',
      stock: 150,
    },
    {
      id: '12',
      name: 'Flonida Nasal Spray',
      price: 220,
      image: '/images/medicine-12.jpg',
      manufacturer: 'Incepta Pharma',
      stock: 8,
    },
  ]

  const itemsPerPage = 9
  const totalPages = Math.ceil(allMedicines.length / itemsPerPage)
  
  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentMedicines = allMedicines.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-emerald-600">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">Shop</span>
        </div>

        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">All Medicines</h1>
            <p className="text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, allMedicines.length)} of {allMedicines.length} medicines
            </p>
          </div>

          {/* Sort Dropdown - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name-az">Name: A to Z</SelectItem>
                <SelectItem value="name-za">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Filter Sidebar - Desktop Only */}
          <aside className="hidden lg:block lg:col-span-1">
            <FilterSidebar />
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            
            {/* Mobile Filter & Sort Bar */}
            <div className="lg:hidden flex gap-2 mb-6">
              {/* Mobile Filter Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Filters</DialogTitle>
                  </DialogHeader>
                  <FilterSidebar />
                </DialogContent>
              </Dialog>

              {/* Mobile Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name-az">Name: A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Medicine Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentMedicines.map((medicine) => (
                <MedicineCard key={medicine.id} medicine={medicine} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
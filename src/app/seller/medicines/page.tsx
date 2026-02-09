'use client'

import { useState } from 'react'
import { Search, Plus, Edit, Trash2, MoreVertical } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function SellerMedicinesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState<number | null>(null)

  // Mock medicines data
  const medicines = [
    { id: 1, name: 'Paracetamol 500mg', category: 'Pain Relief', price: 50, stock: 100, status: 'active', image: '/images/medicine-1.jpg' },
    { id: 2, name: 'Napa Extend 665mg', category: 'Pain Relief', price: 80, stock: 15, status: 'active', image: '/images/medicine-2.jpg' },
    { id: 3, name: 'Sergel 20mg', category: 'Digestive', price: 120, stock: 50, status: 'active', image: '/images/medicine-3.jpg' },
    { id: 4, name: 'Maxpro 20mg', category: 'Digestive', price: 150, stock: 3, status: 'active', image: '/images/medicine-4.jpg' },
    { id: 5, name: 'Ace 5mg', category: 'Heart', price: 60, stock: 0, status: 'inactive', image: '/images/medicine-5.jpg' },
    { id: 6, name: 'Filmet 400mg', category: 'Pain Relief', price: 90, stock: 75, status: 'active', image: '/images/medicine-6.jpg' },
    { id: 7, name: 'Fexo 120mg', category: 'Allergy', price: 45, stock: 120, status: 'active', image: '/images/medicine-7.jpg' },
    { id: 8, name: 'Monas 10mg', category: 'Respiratory', price: 110, stock: 8, status: 'active', image: '/images/medicine-8.jpg' },
  ]

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'low-stock' && medicine.stock <= 10) ||
      (filterStatus === 'out-of-stock' && medicine.stock === 0)
    return matchesSearch && matchesFilter
  })

  const getStockBadge = (stock: number) => {
    if (stock === 0) return <Badge className="bg-red-500">Out of Stock</Badge>
    if (stock <= 10) return <Badge className="bg-yellow-500">Low Stock</Badge>
    return <Badge className="bg-green-500">In Stock</Badge>
  }

  const handleDelete = (id: number) => {
    setSelectedMedicine(id)
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    console.log('Delete medicine:', selectedMedicine)
    setShowDeleteDialog(false)
    setSelectedMedicine(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Medicines</h2>
          <p className="text-muted-foreground">Manage your medicine inventory</p>
        </div>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
          <Link href="/seller/medicines/add">
            <Plus className="w-4 h-4 mr-2" />
            Add Medicine
          </Link>
        </Button>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search medicines..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Medicines</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Medicines Table */}
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedicines.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No medicines found
                  </TableCell>
                </TableRow>
              ) : (
                filteredMedicines.map((medicine) => (
                  <TableRow key={medicine.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={medicine.image}
                            alt={medicine.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium">{medicine.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{medicine.category}</TableCell>
                    <TableCell className="font-semibold">৳{medicine.price}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStockBadge(medicine.stock)}
                        <span className="text-sm text-muted-foreground">{medicine.stock} units</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={medicine.status === 'active' ? 'default' : 'secondary'}>
                        {medicine.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/seller/medicines/${medicine.id}/edit`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDelete(medicine.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Medicine</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this medicine? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
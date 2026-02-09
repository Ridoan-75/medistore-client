'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Package } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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

export default function AdminCategoriesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)

  // Mock categories
  const categories = [
    { id: 1, name: 'Pain Relief', description: 'Medicines for pain management', medicineCount: 45, icon: '💊' },
    { id: 2, name: 'Cold & Flu', description: 'Cold and flu medications', medicineCount: 32, icon: '🤧' },
    { id: 3, name: 'Vitamins & Supplements', description: 'Health supplements', medicineCount: 78, icon: '💪' },
    { id: 4, name: 'First Aid', description: 'First aid essentials', medicineCount: 23, icon: '🩹' },
    { id: 5, name: 'Baby Care', description: 'Baby care products', medicineCount: 56, icon: '👶' },
    { id: 6, name: 'Personal Care', description: 'Personal hygiene products', medicineCount: 89, icon: '🧴' },
    { id: 7, name: 'Digestive Health', description: 'Digestive system medicines', medicineCount: 41, icon: '🫁' },
    { id: 8, name: 'Diabetes Care', description: 'Diabetes management', medicineCount: 34, icon: '💉' },
  ]

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: ''
  })

  const handleEdit = (category: any) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (category: any) => {
    setSelectedCategory(category)
    setIsDeleteDialogOpen(true)
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Add category:', formData)
    setIsAddDialogOpen(false)
    setFormData({ name: '', description: '', icon: '' })
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Edit category:', selectedCategory?.id, formData)
    setIsEditDialogOpen(false)
    setFormData({ name: '', description: '', icon: '' })
  }

  const confirmDelete = () => {
    console.log('Delete category:', selectedCategory?.id)
    setIsDeleteDialogOpen(false)
    setSelectedCategory(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Categories Management</h2>
          <p className="text-muted-foreground">Manage medicine categories</p>
        </div>

        {/* Add Category Button */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>Create a new medicine category</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Pain Relief"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the category"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon (Emoji)</Label>
                  <Input
                    id="icon"
                    placeholder="💊"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Add Category
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="relative group hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              {/* Icon */}
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-3xl">{category.icon}</span>
              </div>

              {/* Name */}
              <h3 className="font-bold text-lg mb-2">{category.name}</h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {category.description}
              </p>

              {/* Medicine Count */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="w-4 h-4" />
                <span>{category.medicineCount} medicines</span>
              </div>

              {/* Actions */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => handleEdit(category)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 text-red-600 hover:text-red-700"
                  onClick={() => handleDelete(category)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Category Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-icon">Icon (Emoji)</Label>
                <Input
                  id="edit-icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be undone.
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
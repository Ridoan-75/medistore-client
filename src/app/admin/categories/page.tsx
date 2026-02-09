'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Package, Search, Grid3x3, List } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
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

interface Category {
  id: number
  name: string
  description: string
  medicineCount: number
  icon: string
  color: string
}

interface FormData {
  name: string
  description: string
  icon: string
}

export default function AdminCategoriesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Mock categories
  const categories: Category[] = [
    { id: 1, name: 'Pain Relief', description: 'Medicines for pain management', medicineCount: 45, icon: '💊', color: 'from-rose-400 to-rose-600' },
    { id: 2, name: 'Cold & Flu', description: 'Cold and flu medications', medicineCount: 32, icon: '🤧', color: 'from-blue-400 to-blue-600' },
    { id: 3, name: 'Vitamins & Supplements', description: 'Health supplements', medicineCount: 78, icon: '💪', color: 'from-amber-400 to-amber-600' },
    { id: 4, name: 'First Aid', description: 'First aid essentials', medicineCount: 23, icon: '🩹', color: 'from-red-400 to-red-600' },
    { id: 5, name: 'Baby Care', description: 'Baby care products', medicineCount: 56, icon: '👶', color: 'from-pink-400 to-pink-600' },
    { id: 6, name: 'Personal Care', description: 'Personal hygiene products', medicineCount: 89, icon: '🧴', color: 'from-purple-400 to-purple-600' },
    { id: 7, name: 'Digestive Health', description: 'Digestive system medicines', medicineCount: 41, icon: '🫁', color: 'from-teal-400 to-teal-600' },
    { id: 8, name: 'Diabetes Care', description: 'Diabetes management', medicineCount: 34, icon: '💉', color: 'from-indigo-400 to-indigo-600' },
  ]

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    icon: ''
  })

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (category: Category) => {
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
    <div className="flex-1 space-y-6 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground mt-1">
            Manage and organize your medicine categories
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>Create a new medicine category for your inventory</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Pain Relief"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the category"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
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
                    maxLength={2}
                  />
                  <p className="text-xs text-muted-foreground">Choose an emoji to represent this category</p>
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

      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            {filteredCategories.length} {filteredCategories.length === 1 ? 'Category' : 'Categories'}
          </Badge>
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Categories Display */}
      {filteredCategories.length === 0 ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No categories found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery ? 'Try adjusting your search terms' : 'Get started by creating your first category'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            )}
          </div>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-2 hover:border-emerald-200">
              <CardContent className="p-6">
                {/* Icon with gradient background */}
                <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-4 shadow-md`}>
                  <span className="text-2xl filter drop-shadow-sm">{category.icon}</span>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-lg mb-1 line-clamp-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                      {category.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Package className="w-4 h-4" />
                      <span className="font-medium">{category.medicineCount}</span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-emerald-50 hover:text-emerald-600"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDelete(category)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredCategories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors group">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <span className="text-xl">{category.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base mb-1">{category.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{category.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="px-3 py-1">
                      <Package className="w-3 h-3 mr-1.5" />
                      {category.medicineCount}
                    </Badge>
                    
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-emerald-50 hover:text-emerald-600"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDelete(category)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Category Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-icon">Icon (Emoji)</Label>
                <Input
                  id="edit-icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  maxLength={2}
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
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category <span className="font-semibold">"{selectedCategory?.name}"</span> and remove it from all associated medicines. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete Category
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
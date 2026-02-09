'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

export default function FilterSidebar() {
  const [priceRange, setPriceRange] = useState([0, 5000])

  // Mock categories
  const categories = [
    'Pain Relief',
    'Cold & Flu',
    'Vitamins & Supplements',
    'First Aid',
    'Baby Care',
    'Personal Care',
    'Digestive Health',
    'Diabetes Care'
  ]

  // Mock manufacturers
  const manufacturers = [
    'Square Pharmaceuticals',
    'Beximco Pharma',
    'Incepta Pharma',
    'Renata Limited',
    'ACI Limited',
    'Opsonin Pharma'
  ]

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="text-xl">Filters</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        
        {/* Categories Section */}
        <div>
          <h3 className="font-semibold mb-3 text-sm">Categories</h3>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox id={category} />
                <Label 
                  htmlFor={category} 
                  className="text-sm font-normal cursor-pointer"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Price Range Section */}
        <div>
          <h3 className="font-semibold mb-3 text-sm">Price Range</h3>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={5000}
            step={100}
            className="mb-3"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>৳{priceRange[0]}</span>
            <span>৳{priceRange[1]}</span>
          </div>
        </div>

        <Separator />

        {/* Manufacturer Section */}
        <div>
          <h3 className="font-semibold mb-3 text-sm">Manufacturer</h3>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select manufacturer" />
            </SelectTrigger>
            <SelectContent>
              {manufacturers.map((manufacturer) => (
                <SelectItem key={manufacturer} value={manufacturer}>
                  {manufacturer}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Stock Status Section */}
        <div>
          <h3 className="font-semibold mb-3 text-sm">Availability</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="in-stock" defaultChecked />
              <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
                In Stock
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="low-stock" />
              <Label htmlFor="low-stock" className="text-sm font-normal cursor-pointer">
                Low Stock
              </Label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-4">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
            Apply Filters
          </Button>
          <Button variant="outline" className="w-full">
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
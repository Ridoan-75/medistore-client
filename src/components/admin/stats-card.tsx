import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { ArrowUp, ArrowDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  change?: number
  trend?: 'up' | 'down'
}

export default function StatsCard({ title, value, icon: Icon, change, trend }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
            
            {change !== undefined && trend && (
              <div className="flex items-center mt-2 text-sm">
                {trend === 'up' ? (
                  <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-600 mr-1" />
                )}
                <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {change}%
                </span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            )}
          </div>

          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
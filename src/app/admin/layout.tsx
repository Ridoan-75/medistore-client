'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  FolderTree,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

interface AdminLayoutProps {
  children: React.ReactNode
}

// Navigation items - shudhu Dashboard, Users, Orders, Categories
const navigationItems = [
  { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Users', href: '/admin/users', icon: Users },
  { title: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { title: 'Categories', href: '/admin/categories', icon: FolderTree },
]

// Admin user data
const adminUser = {
  name: 'Admin User',
  email: 'admin@medistore.com',
  avatar: 'AD',
}

// AppSidebar Component
function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <Sidebar collapsible="offcanvas" className="border-r" {...props}>
      <SidebarHeader className="border-b px-3 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="hover:bg-sidebar-accent">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex aspect-square size-6 items-center justify-center rounded-md overflow-hidden">
                  <Image 
                    src="/logo.png" 
                    alt="MediStore Logo" 
                    width={24} 
                    height={24}
                    className="object-contain"
                  />
                </div>
                <span className="font-semibold text-sm">MediStore</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Quick Create Button with Logo */}
        <div className="px-2 py-3">
          <SidebarMenuButton 
            className="w-full justify-start gap-3 bg-sidebar-accent hover:bg-sidebar-accent/80 border border-sidebar-border h-10"
          >
            <div className="flex aspect-square size-5 items-center justify-center rounded overflow-hidden bg-background">
              <Image 
                src="/logo.png" 
                alt="Quick Create" 
                width={20} 
                height={20}
                className="object-contain"
              />
            </div>
            <span className="text-sm font-medium">Quick Create</span>
          </SidebarMenuButton>
        </div>

        {/* Main Navigation - Dashboard, Users, Orders, Categories */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={active}
                      className="hover:bg-sidebar-accent"
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <Icon className="size-4" />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t px-2 py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton 
                  size="lg" 
                  className="hover:bg-sidebar-accent"
                >
                  <Avatar className="h-7 w-7 rounded-md">
                    <AvatarFallback className="bg-foreground text-background text-xs font-medium rounded-md">
                      {adminUser.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 leading-none text-left flex-1">
                    <span className="text-sm font-medium">{adminUser.name}</span>
                    <span className="text-xs text-muted-foreground">{adminUser.email}</span>
                  </div>
                  <ChevronDown className="size-4 ml-auto opacity-50" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

// SiteHeader Component
function SiteHeader() {
  const pathname = usePathname()
  const currentPage = navigationItems.find(item => pathname === item.href)

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <h1 className="text-sm font-semibold">
        {currentPage?.title || 'Dashboard'}
      </h1>
    </header>
  )
}

// Main Layout Component
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-1 flex-col p-4 bg-muted/40">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
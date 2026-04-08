"use client"

import * as React from "react"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  FileBarChart,
  Settings,
  LogOut,
  ChevronRight,
  Store,
  Menu,
  Globe
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"


export function AppSidebar() {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  const { language, setLanguage, t, isRTL } = useLanguage()

  const items = [
    {
      title: t('nav.dashboard'),
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: t('nav.posTerminal'),
      url: "/sales",
      icon: ShoppingCart,
    },
    {
      title: t('nav.inventory'),
      url: "/inventory",
      icon: Package,
    },
    {
      title: t('nav.customers'),
      url: "/customers",
      icon: Users,
    },
    {
      title: t('nav.reports'),
      url: "/reports",
      icon: FileBarChart,
    },
    {
      title: t('nav.settings'),
      url: "/settings",
      icon: Settings,
    },
  ]

  // Close sidebar on mobile when route changes
  React.useEffect(() => {
    setOpenMobile(false)
  }, [pathname, setOpenMobile])

  return (
    <Sidebar collapsible="icon">
      
      <SidebarHeader className="h-16 flex items-center justify-center border-b">
        <div className="flex items-center gap-3">
          <div className="w-auto h-8 rounded flex items-center justify-center overflow-hidden">
            <img src="/Logoo.png" alt="Software Elites" className="w-full h-full object-cover" />
          </div>
          {/* <span className="font-headline font-bold text-xl group-data-[collapsible=icon]:hidden">
            Software Elites
          </span> */}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className="py-5"
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {/* Language Toggle */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              tooltip={language === 'en' ? 'اردو' : 'English'}
              className="py-5"
            >
              <Globe />
              <span>{language === 'en' ? 'اردو' : 'English'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* Sign Out */}
          <SidebarMenuItem>
            <SidebarMenuButton className="text-destructive hover:text-destructive">
              <LogOut />
              <span>{t('nav.signOut')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

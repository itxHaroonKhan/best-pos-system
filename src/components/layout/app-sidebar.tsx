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
  Globe,
  UserPlus,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"


import { useRouter } from "next/navigation"

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  const { language, setLanguage, t, isRTL } = useLanguage()
  const { toast } = useToast()
  const [userRole] = React.useState<string>("admin")

  // Create Cashier Dialog State
  const [isCashierOpen, setIsCashierOpen] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [cashierData, setCashierData] = React.useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  })

  const handleCreateCashier = (e: React.FormEvent) => {
    e.preventDefault()
    // No backend call - just close dialog
    setIsCashierOpen(false)
    setCashierData({ name: "", email: "", phone: "", password: "" })
  }

  const handleSignOut = () => {
    router.push("/login")
  }

  const items = [
    {
      title: t('nav.dashboard'),
      url: "/dashboard",
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
      <SidebarContent className="pt-4">
        <SidebarGroupLabel className="font-bold text-base pb-7">Management</SidebarGroupLabel>

        <SidebarMenu className="space-y-4">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                tooltip={item.title}
                className="py-5"
              >
                <Link href={item.url}>
                  {(() => { const Icon = item.icon; return <Icon />; })()}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {/* Create Cashier Button - Admin Only */}
          {userRole === "admin" && (
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setIsCashierOpen(true)}
                tooltip="Create Cashier"
                className="py-5 bg-purple-500/10 hover:bg-purple-500 text-black dark:text-white transition-all duration-200"
              >
                <UserPlus />
                <span>Create Cashier</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
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
            <SidebarMenuButton
              onClick={handleSignOut}
              className="text-destructive hover:text-destructive"
            >
              <LogOut />
              <span>{t('nav.signOut')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Create Cashier Dialog */}
      <Dialog open={isCashierOpen} onOpenChange={setIsCashierOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Create New Cashier
            </DialogTitle>
            <DialogDescription>
              Fill in the details to add a new cashier to your team.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCashier}>
            <div className="space-y-4 py-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="cashier-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cashier-name"
                    type="text"
                    placeholder="Enter full name"
                    className="pl-10"
                    value={cashierData.name}
                    onChange={(e) => setCashierData({ ...cashierData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="cashier-email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cashier-email"
                    type="email"
                    placeholder="cashier@example.com"
                    className="pl-10"
                    value={cashierData.email}
                    onChange={(e) => setCashierData({ ...cashierData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="cashier-phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cashier-phone"
                    type="tel"
                    placeholder="+92 300 1234567"
                    className="pl-10"
                    value={cashierData.phone}
                    onChange={(e) => setCashierData({ ...cashierData, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="cashier-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cashier-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="pl-10 pr-10"
                    value={cashierData.password}
                    onChange={(e) => setCashierData({ ...cashierData, password: e.target.value })}
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" type="button" onClick={() => setIsCashierOpen(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Create Cashier
                  </span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Sidebar>
  )
}

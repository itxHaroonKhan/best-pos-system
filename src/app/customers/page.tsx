"use client"

import * as React from "react"
import { Search, Mail, Phone, Calendar, DollarSign, Loader2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import api from "@/lib/api"
import { AxiosError } from "axios"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  city?: string
  pincode?: string
  gst_number?: string
  created_at?: string
  joinedDate: string
  totalOrders: number
  totalSpent: number
  status: "active" | "inactive"
  avatar?: string
}

export default function CustomersPage() {
  const { toast } = useToast()
  const { t, isRTL } = useLanguage()
  const [customers, setCustomers] = React.useState<Customer[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [searchTerm, setSearchTerm] = React.useState("")

  // Fetch customers on mount
  React.useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await api.get("/customers")
        let data = res.data.data || res.data.customers || res.data || []
        
        // Map DB response to frontend format
        if (Array.isArray(data)) {
          data = data.map((c: any) => ({
            id: c.id?.toString() || String(Math.random()),
            name: c.name || 'Unknown',
            email: c.email || '',
            phone: c.phone || '',
            address: c.address || '',
            city: c.city || '',
            pincode: c.pincode || '',
            gst_number: c.gst_number || '',
            created_at: c.created_at || c.createdAt || new Date().toISOString(),
            joinedDate: c.created_at || c.createdAt || new Date().toISOString(),
            totalOrders: c.totalOrders || c.total_orders || 0,
            totalSpent: c.totalSpent || c.total_spent || 0,
            status: c.status || "active",
            avatar: c.avatar || '',
          }))
        }
        
        setCustomers(Array.isArray(data) ? data : [])
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>
        const message = axiosError.response?.data?.message || "Failed to load customers"
        setError(message)
        setCustomers([])
        toast({
          title: "Error",
          description: "Failed to connect to server. Please ensure the backend is running.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchCustomers()
  }, [toast])

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === "active").length,
    inactive: customers.filter(c => c.status === "inactive").length,
    revenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
  }

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  )

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
  }

  if (loading) {
    return (
      <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex flex-col gap-1">
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-4 w-64 bg-muted rounded animate-pulse mt-2" />
        </div>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="h-4 w-24 bg-muted rounded animate-pulse mb-2" />
                <div className="h-8 w-16 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="h-10 w-full bg-muted rounded animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                  <div className="flex-1">
                    <div className="h-5 w-32 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">{t('customers.totalCustomers')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{t('customers.allTime')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">{t('customers.active')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-500">{stats.active}</div>
            <p className="text-xs text-muted-foreground">{t('customers.activeCustomers')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">{t('customers.totalRevenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">Rs. {stats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{t('customers.fromAllCustomers')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('customers.searchPlaceholder')}
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Customers Grid */}
      {filteredCustomers.length === 0 && customers.length > 0 && searchTerm && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-muted-foreground">No customers match &ldquo;{searchTerm}&rdquo;</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={customer.avatar} />
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                      {getInitials(customer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{customer.name}</CardTitle>
                    <Badge variant={customer.status === "active" ? "default" : "secondary"} className="mt-1">
                      {customer.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date(customer.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                  <p className="text-lg font-bold">{customer.totalOrders}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                  <p className="text-lg font-bold text-primary">Rs. {customer.totalSpent.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

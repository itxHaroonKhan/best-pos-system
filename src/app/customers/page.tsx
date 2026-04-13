"use client"

import * as React from "react"
import { Search, Plus, Edit, Trash2, Mail, Phone, Calendar, DollarSign, Loader2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [editingCustomer, setEditingCustomer] = React.useState<Customer | null>(null)
  const [newCustomer, setNewCustomer] = React.useState<Partial<Customer>>({
    name: "",
    email: "",
    phone: "",
    totalOrders: 0,
    totalSpent: 0,
    status: "active",
  })
  const [submitting, setSubmitting] = React.useState(false)

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

  const handleAddCustomer = async () => {
    if (!newCustomer.name) {
      toast({
        title: "Missing fields",
        description: "Customer name is required.",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      const res = await api.post("/customers", {
        name: newCustomer.name,
        email: newCustomer.email || "",
        phone: newCustomer.phone || "",
        address: "",
        city: "",
        pincode: "",
        gst_number: "",
      })
      const backendData = res.data.data
      const newCustomerObj: Customer = {
        id: backendData.id?.toString() || String(Date.now()),
        name: backendData.name || newCustomer.name,
        email: backendData.email || "",
        phone: backendData.phone || "",
        address: backendData.address || "",
        city: backendData.city || "",
        pincode: backendData.pincode || "",
        gst_number: backendData.gst_number || "",
        created_at: backendData.created_at || new Date().toISOString(),
        joinedDate: backendData.created_at || new Date().toISOString(),
        totalOrders: 0,
        totalSpent: 0,
        status: "active",
      }
      setCustomers(prev => [...prev, newCustomerObj])
      setIsAddOpen(false)
      setNewCustomer({ name: "", email: "", phone: "", totalOrders: 0, totalSpent: 0, status: "active" })

      toast({
        title: "Customer added",
        description: `${newCustomerObj.name} has been added.`,
      })
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>
      const message = axiosError.response?.data?.message || "Failed to add customer"
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateCustomer = async () => {
    if (!editingCustomer) return

    try {
      setSubmitting(true)
      const res = await api.put(`/customers/${editingCustomer.id}`, {
        name: editingCustomer.name,
        email: editingCustomer.email || "",
        phone: editingCustomer.phone || "",
        address: editingCustomer.address || "",
        city: editingCustomer.city || "",
        pincode: editingCustomer.pincode || "",
        gst_number: editingCustomer.gst_number || "",
      })
      const backendData = res.data.data
      if (backendData) {
        setCustomers(prev => prev.map(c =>
          c.id === backendData.id.toString() ? {
            ...c,
            name: backendData.name,
            email: backendData.email,
            phone: backendData.phone,
            address: backendData.address,
            city: backendData.city,
            pincode: backendData.pincode,
            gst_number: backendData.gst_number,
          } : c
        ))
      } else {
        setCustomers(prev => prev.map(c =>
          c.id === editingCustomer.id ? { ...editingCustomer } : c
        ))
      }

      toast({
        title: "Customer updated",
        description: `${editingCustomer.name}'s details have been updated.`,
      })
      setEditingCustomer(null)
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>
      const message = axiosError.response?.data?.message || "Failed to update customer"
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteCustomer = async (id: string, name: string) => {
    try {
      await api.delete(`/customers/${id}`)
      setCustomers(prev => prev.filter(c => c.id !== id))
      toast({
        title: "Customer deleted",
        description: `${name} has been removed.`,
        variant: "destructive",
      })
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>
      const message = axiosError.response?.data?.message || "Failed to delete customer"
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    }
  }

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
  }

  if (loading) {
    return (
      <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="h-8 w-48 bg-muted rounded animate-pulse" />
            <div className="h-4 w-64 bg-muted rounded animate-pulse mt-2" />
          </div>
          <div className="h-10 w-36 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">{t('customers.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('customers.subtitle')}</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="gap-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          <span>{t('customers.addCustomer')}</span>
        </Button>
      </div>

      {/* Error Banner */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Failed to load customers</p>
                <p className="text-sm opacity-80">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
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
            <CardTitle className="text-xs sm:text-sm font-medium">{t('customers.inactive')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-muted-foreground">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">{t('customers.noRecentOrders')}</p>
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

      {/* Empty State */}
      {!loading && !error && customers.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No customers found</h3>
            <p className="text-muted-foreground mb-4">Get started by adding your first customer</p>
            <Button onClick={() => setIsAddOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </CardContent>
        </Card>
      )}

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
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setEditingCustomer(customer)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-red-500 hover:text-red-600"
                  onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Customer Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-h-[unset]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Enter customer details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="w-full sm:w-auto" disabled={submitting}>Cancel</Button>
            <Button onClick={handleAddCustomer} className="w-full sm:w-auto" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={!!editingCustomer} onOpenChange={() => setEditingCustomer(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-h-[unset]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update customer details.
            </DialogDescription>
          </DialogHeader>
          {editingCustomer && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editingCustomer.name}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingCustomer.email}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={editingCustomer.phone}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={editingCustomer.status} onValueChange={(v: "active" | "inactive") => setEditingCustomer({ ...editingCustomer, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setEditingCustomer(null)} className="w-full sm:w-auto" disabled={submitting}>Cancel</Button>
            <Button onClick={handleUpdateCustomer} className="w-full sm:w-auto" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

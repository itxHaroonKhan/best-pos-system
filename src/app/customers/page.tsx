"use client"

import * as React from "react"
import { Search, Plus, Edit, Trash2, Mail, Phone, Calendar, DollarSign } from "lucide-react"
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

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  joinedDate: string
  totalOrders: number
  totalSpent: number
  status: "active" | "inactive"
  avatar?: string
}

const initialCustomers: Customer[] = [
  { id: "1", name: "Rajesh Kumar", email: "rajesh@email.com", phone: "+91 9876543210", joinedDate: "2024-01-15", totalOrders: 24, totalSpent: 4500, status: "active", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: "2", name: "Priya Sharma", email: "priya@email.com", phone: "+91 9876543211", joinedDate: "2024-02-20", totalOrders: 18, totalSpent: 3200, status: "active", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
  { id: "3", name: "Amit Patel", email: "amit@email.com", phone: "+91 9876543212", joinedDate: "2024-03-10", totalOrders: 32, totalSpent: 6800, status: "active", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
  { id: "4", name: "Sneha Reddy", email: "sneha@email.com", phone: "+91 9876543213", joinedDate: "2024-01-05", totalOrders: 0, totalSpent: 0, status: "inactive", avatar: "https://randomuser.me/api/portraits/women/4.jpg" },
  { id: "5", name: "Vikram Singh", email: "vikram@email.com", phone: "+91 9876543214", joinedDate: "2024-04-12", totalOrders: 15, totalSpent: 2800, status: "active", avatar: "https://randomuser.me/api/portraits/men/5.jpg" },
  { id: "6", name: "Ananya Das", email: "ananya@email.com", phone: "+91 9876543215", joinedDate: "2024-02-28", totalOrders: 8, totalSpent: 1500, status: "active", avatar: "https://randomuser.me/api/portraits/women/6.jpg" },
]

export default function CustomersPage() {
  const { toast } = useToast()
  const [customers, setCustomers] = React.useState<Customer[]>(initialCustomers)
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

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.email) {
      toast({
        title: "Missing fields",
        description: "Please fill in required fields.",
        variant: "destructive",
      })
      return
    }

    const customer: Customer = {
      id: Date.now().toString(),
      name: newCustomer.name!,
      email: newCustomer.email!,
      phone: newCustomer.phone || "",
      joinedDate: new Date().toISOString().split("T")[0],
      totalOrders: 0,
      totalSpent: 0,
      status: "active",
    }

    setCustomers(prev => [...prev, customer])
    setIsAddOpen(false)
    setNewCustomer({ name: "", email: "", phone: "", totalOrders: 0, totalSpent: 0, status: "active" })
    
    toast({
      title: "Customer added",
      description: `${customer.name} has been added.`,
    })
  }

  const handleUpdateCustomer = () => {
    if (!editingCustomer) return

    setCustomers(prev => prev.map(c => 
      c.id === editingCustomer.id ? editingCustomer : c
    ))

    toast({
      title: "Customer updated",
      description: `${editingCustomer.name}'s details have been updated.`,
    })
    setEditingCustomer(null)
  }

  const handleDeleteCustomer = (id: string, name: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id))
    toast({
      title: "Customer deleted",
      description: `${name} has been removed.`,
      variant: "destructive",
    })
  }

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">Customers</h1>
          <p className="text-sm text-muted-foreground">Manage your customer relationships</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="gap-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-500">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Active customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-muted-foreground">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">No recent orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">₹{stats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From all customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email or phone..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Customers Grid */}
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
                <span>Joined {new Date(customer.joinedDate).toLocaleDateString()}</span>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                  <p className="text-lg font-bold">{customer.totalOrders}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                  <p className="text-lg font-bold text-primary">₹{customer.totalSpent.toLocaleString()}</p>
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
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="w-full sm:w-auto">Cancel</Button>
            <Button onClick={handleAddCustomer} className="w-full sm:w-auto">Add Customer</Button>
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
            <Button variant="outline" onClick={() => setEditingCustomer(null)} className="w-full sm:w-auto">Cancel</Button>
            <Button onClick={handleUpdateCustomer} className="w-full sm:w-auto">Update Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

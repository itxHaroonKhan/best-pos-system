"use client"

import * as React from "react"
import { Search, UserPlus, Phone, Mail, History, ExternalLink, MoreVertical, Edit, Trash2, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { CustomerFormDialog } from "@/components/customers/customer-form-dialog"
import { CustomerDetailDialog } from "@/components/customers/customer-detail-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  spent: number
  visits: number
  last: string
}

const MOCK_CUSTOMERS: Customer[] = [
  { id: "1", name: "Anish Kumar", email: "anish@example.com", phone: "+91 9876543210", spent: 12500, visits: 12, last: "2 days ago" },
  { id: "2", name: "Priya Sharma", email: "priya@example.com", phone: "+91 9123456789", spent: 4500, visits: 3, last: "1 week ago" },
  { id: "3", name: "Rahul Verma", email: "rahul@example.com", phone: "+91 8888888888", spent: 32000, visits: 45, last: "Yesterday" },
  { id: "4", name: "Sneha Reddy", email: "sneha@example.com", phone: "+91 7777777777", spent: 1200, visits: 1, last: "3 weeks ago" },
]

export default function CustomersPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)
  const [editingCustomer, setEditingCustomer] = React.useState<Customer | null>(null)
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null)
  const [customers, setCustomers] = React.useState(MOCK_CUSTOMERS)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [customerToDelete, setCustomerToDelete] = React.useState<Customer | null>(null)

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  )

  const handleAddNew = () => {
    setEditingCustomer(null)
    setIsFormOpen(true)
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setIsFormOpen(true)
  }

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDetailOpen(true)
  }

  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (customerToDelete) {
      setCustomers(prev => prev.filter(c => c.id !== customerToDelete.id))
      toast({
        title: "Customer Deleted",
        description: `${customerToDelete.name} has been removed from database.`,
        variant: "destructive",
      })
      setDeleteDialogOpen(false)
      setCustomerToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Customer Relationship</h1>
          <p className="text-muted-foreground">Manage customer profiles and purchase histories.</p>
        </div>
        <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleAddNew}>
          <UserPlus className="w-4 h-4" />
          Register Customer
        </Button>
      </div>

      <CustomerFormDialog 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        editingCustomer={editingCustomer}
      />

      <CustomerDetailDialog
        customer={selectedCustomer}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Are You Sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the customer
              <strong> "{customerToDelete?.name}"</strong> along with their purchase history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <UserPlus className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+24</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Life Time Value</CardTitle>
            <History className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹8,450</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <History className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">High loyalty segment</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, phone or email..." 
                className="pl-10 h-11"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setSearchTerm("")}
                >
                  <span className="sr-only">Clear search</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px]">✕</span>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Contact Details</TableHead>
                <TableHead>Total Visits</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Purchase</TableHead>
                <TableHead className="text-right">History</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_CUSTOMERS.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Phone className="w-3 h-3" /> {customer.phone}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Mail className="w-3 h-3" /> {customer.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.visits}</TableCell>
                  <TableCell className="font-bold text-primary">₹{customer.spent.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{customer.last}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(customer)}>
                          <History className="w-4 h-4 mr-2" />
                          View History
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(customer)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteClick(customer)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Customer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
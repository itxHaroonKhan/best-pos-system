"use client"

import * as React from "react"
import { Plus, Search, Filter, AlertTriangle, MoreVertical, Package, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { ProductFormDialog } from "@/components/inventory/product-form-dialog"
import { useToast } from "@/hooks/use-toast"

interface InventoryItem {
  id: string
  sku: string
  name: string
  category: string
  price: number
  stock: number
  threshold: number
}

const MOCK_INVENTORY: InventoryItem[] = [
  { id: "1", sku: "WMS-001", name: "Wireless Mouse", category: "Electronics", price: 850, stock: 45, threshold: 10 },
  { id: "2", sku: "MKB-002", name: "Mechanical Keyboard", category: "Electronics", price: 4500, stock: 8, threshold: 10 },
  { id: "3", sku: "MON-003", name: "HD Monitor 24\"", category: "Electronics", price: 12000, stock: 5, threshold: 5 },
  { id: "4", sku: "USB-004", name: "USB-C Cable 2m", category: "Accessories", price: 450, stock: 150, threshold: 20 },
  { id: "5", sku: "HST-005", name: "Gaming Headset", category: "Electronics", price: 3200, stock: 15, threshold: 5 },
  { id: "6", sku: "LPS-006", name: "Laptop Stand", category: "Accessories", price: 1200, stock: 2, threshold: 5 },
]

export default function InventoryPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [editingProduct, setEditingProduct] = React.useState<InventoryItem | null>(null)
  const [inventory, setInventory] = React.useState(MOCK_INVENTORY)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [productToDelete, setProductToDelete] = React.useState<InventoryItem | null>(null)

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (product: InventoryItem) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const handleDeleteClick = (product: InventoryItem) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      setInventory(prev => prev.filter(item => item.id !== productToDelete.id))
      toast({
        title: "Product Deleted",
        description: `${productToDelete.name} has been removed from inventory.`,
      })
      setDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  const handleAddNew = () => {
    setEditingProduct(null)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Inventory Management</h1>
          <p className="text-muted-foreground">Manage products, track stock, and configure alerts.</p>
        </div>
        <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleAddNew}>
          <Plus className="w-4 h-4" />
          Add New Product
        </Button>
      </div>

      <ProductFormDialog 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        editingProduct={editingProduct}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Are You Sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              <strong> "{productToDelete?.name}"</strong> from your inventory.
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

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total SKUs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">+5 added this month</p>
          </CardContent>
        </Card>
        <Card className="bg-accent/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹12,45,200</div>
            <p className="text-xs text-muted-foreground">Current wholesale value</p>
          </CardContent>
        </Card>
        <Card className="bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">8</div>
            <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by SKU, Product Name, or Category..." 
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
              <Button variant="outline" size="icon" className="h-11 w-11 shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" className="h-11 shrink-0">
              <Package className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_INVENTORY.map((item) => {
                const isLow = item.stock <= item.threshold
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>₹{item.price}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{item.stock}</span>
                        {isLow && <AlertTriangle className="h-4 w-4 text-destructive" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      {isLow ? (
                        <Badge variant="destructive">Low Stock</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-accent/20 text-accent-foreground border-accent/20">In Stock</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(item)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Package className="w-4 h-4 mr-2" />
                            Update Stock
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteClick(item)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
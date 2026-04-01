"use client"

import * as React from "react"
import { Search, Plus, Edit, Trash2, AlertTriangle, Package, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  minStock: number
  sku: string
  status: "in-stock" | "low-stock" | "out-of-stock"
}

const initialProducts: Product[] = [
  { id: "1", name: "Grilled Salmon Steak", category: "Lunch", price: 15, stock: 25, minStock: 10, sku: "LUN-001", status: "in-stock" },
  { id: "2", name: "Tofu Poke Bowl", category: "Salad", price: 7, stock: 8, minStock: 10, sku: "SAL-002", status: "low-stock" },
  { id: "3", name: "Pasta with Roast Beef", category: "Pasta", price: 10, stock: 0, minStock: 15, sku: "PAS-003", status: "out-of-stock" },
  { id: "4", name: "Beef Steak", category: "Beef", price: 30, stock: 15, minStock: 10, sku: "BEE-004", status: "in-stock" },
  { id: "5", name: "Shrimp Rice Bowl", category: "Rice", price: 6, stock: 35, minStock: 20, sku: "RIC-005", status: "in-stock" },
  { id: "6", name: "Apple Stuffed Pancake", category: "Dessert", price: 35, stock: 5, minStock: 10, sku: "DES-006", status: "low-stock" },
  { id: "7", name: "Chicken Quinoa & Herbs", category: "Chicken", price: 12, stock: 22, minStock: 15, sku: "CHI-007", status: "in-stock" },
  { id: "8", name: "Vegetable Shrimp", category: "Salad", price: 10, stock: 28, minStock: 15, sku: "SAL-008", status: "in-stock" },
]

const categories = ["All", "Lunch", "Salad", "Pasta", "Beef", "Rice", "Dessert", "Chicken"]

export default function InventoryPage() {
  const { toast } = useToast()
  const [products, setProducts] = React.useState<Product[]>(initialProducts)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("All")
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null)
  const [newProduct, setNewProduct] = React.useState<Partial<Product>>({
    name: "",
    category: "Lunch",
    price: 0,
    stock: 0,
    minStock: 10,
    sku: "",
  })

  const stats = {
    total: products.length,
    inStock: products.filter(p => p.status === "in-stock").length,
    lowStock: products.filter(p => p.status === "low-stock").length,
    outOfStock: products.filter(p => p.status === "out-of-stock").length,
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.sku) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const status: Product["status"] = newProduct.stock === 0 ? "out-of-stock" : 
                                       newProduct.stock! <= newProduct.minStock! ? "low-stock" : "in-stock"

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name!,
      category: newProduct.category || "Lunch",
      price: newProduct.price || 0,
      stock: newProduct.stock || 0,
      minStock: newProduct.minStock || 10,
      sku: newProduct.sku!,
      status,
    }

    setProducts(prev => [...prev, product])
    setIsAddOpen(false)
    setNewProduct({ name: "", category: "Lunch", price: 0, stock: 0, minStock: 10, sku: "" })
    
    toast({
      title: "Product added",
      description: `${product.name} has been added to inventory.`,
    })
  }

  const handleUpdateProduct = () => {
    if (!editingProduct) return

    setProducts(prev => prev.map(p => 
      p.id === editingProduct.id ? editingProduct : p
    ))

    toast({
      title: "Product updated",
      description: `${editingProduct.name} has been updated.`,
    })
    setEditingProduct(null)
  }

  const handleDeleteProduct = (id: string, name: string) => {
    setProducts(prev => prev.filter(p => p.id !== id))
    toast({
      title: "Product deleted",
      description: `${name} has been removed from inventory.`,
      variant: "destructive",
    })
  }

  const getStatusBadge = (status: Product["status"]) => {
    switch (status) {
      case "in-stock":
        return <Badge className="bg-green-500 text-white">In Stock</Badge>
      case "low-stock":
        return <Badge className="bg-orange-500 text-white">Low Stock</Badge>
      case "out-of-stock":
        return <Badge className="bg-red-500 text-white">Out of Stock</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Inventory</h1>
          <p className="text-muted-foreground">Manage your products and stock levels</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.inStock}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.lowStock}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.outOfStock}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or SKU..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-6 gap-4 p-4 bg-muted/50 font-medium text-sm">
              <div className="col-span-2">Product</div>
              <div>SKU</div>
              <div>Category</div>
              <div>Price</div>
              <div>Stock</div>
              <div>Status</div>
              <div className="col-span-2">Actions</div>
            </div>
            <div className="divide-y">
              {filteredProducts.map((product) => (
                <div key={product.id} className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-muted/30 transition-colors">
                  <div className="col-span-2">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">Min: {product.minStock}</p>
                  </div>
                  <div className="text-sm font-mono">{product.sku}</div>
                  <div><Badge variant="secondary">{product.category}</Badge></div>
                  <div className="font-semibold">${product.price.toFixed(2)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${product.stock <= product.minStock ? 'text-red-500' : ''}`}>
                        {product.stock}
                      </span>
                      {product.stock <= product.minStock && (
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                      )}
                    </div>
                  </div>
                  <div>{getStatusBadge(product.status)}</div>
                  <div className="col-span-2 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingProduct(product)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Enter the product details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Enter product name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  placeholder="e.g., LUN-001"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={newProduct.category} onValueChange={(v) => setNewProduct({ ...newProduct, category: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c !== "All").map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="minStock">Min Stock</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={newProduct.minStock}
                  onChange={(e) => setNewProduct({ ...newProduct, minStock: parseInt(e.target.value) || 10 })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product details.
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Product Name</Label>
                <Input
                  id="edit-name"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-sku">SKU</Label>
                  <Input
                    id="edit-sku"
                    value={editingProduct.sku}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select value={editingProduct.category} onValueChange={(v) => setEditingProduct({ ...editingProduct, category: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c !== "All").map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Price</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-stock">Stock</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-minStock">Min Stock</Label>
                  <Input
                    id="edit-minStock"
                    type="number"
                    value={editingProduct.minStock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, minStock: parseInt(e.target.value) || 10 })}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingProduct(null)}>Cancel</Button>
            <Button onClick={handleUpdateProduct}>Update Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import * as React from "react"
import { Search, Plus, Edit, Trash2, AlertTriangle, Package, TrendingUp, TrendingDown, PackagePlus, Upload, X, Loader2 } from "lucide-react"
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
import { useLanguage } from "@/contexts/language-context"

interface Product {
  id: string
  name: string
  category: string
  price: number
  costPrice: number
  stock: number
  minStock: number
  sku: string
  barcode: string
  description: string
  unitType: string
  status: "in-stock" | "low-stock" | "out-of-stock"
  image?: string
}

const STORAGE_KEY = "pos_products"

function loadProducts(): Product[] {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveProducts(products: Product[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

export default function InventoryPage() {
  const { toast } = useToast()
  const { t, isRTL } = useLanguage()
  const [products, setProducts] = React.useState<Product[]>([])
  const [categories, setCategories] = React.useState<string[]>(["All"])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("All")
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null)
  const [restockingProduct, setRestockingProduct] = React.useState<Product | null>(null)
  const [restockQuantity, setRestockQuantity] = React.useState(0)
  const [newProduct, setNewProduct] = React.useState<Partial<Product>>({
    name: "",
    category: "",
    price: 0,
    costPrice: 0,
    stock: 0,
    minStock: 10,
    sku: "",
    barcode: "",
    description: "",
    unitType: "pcs",
    image: "",
  })
  const [productImage, setProductImage] = React.useState<string>("")
  const [saving, setSaving] = React.useState(false)

  // Load from localStorage on mount
  React.useEffect(() => {
    const loaded = loadProducts()
    setProducts(loaded)
    // Build categories list
    const cats = [...new Set(loaded.map(p => p.category).filter(Boolean))] as string[]
    setCategories(["All", ...cats])
  }, [])

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

  const getStatus = (stock: number, minStock: number): Product["status"] => {
    if (stock <= 0) return "out-of-stock"
    if (stock <= minStock) return "low-stock"
    return "in-stock"
  }

  const handleAddProduct = () => {
    if (!newProduct.name) {
      toast({ title: "Missing fields", description: "Product name is required.", variant: "destructive" })
      return
    }

    setSaving(true)
    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name || "",
      category: newProduct.category || "",
      price: newProduct.price || 0,
      costPrice: newProduct.costPrice || 0,
      stock: newProduct.stock || 0,
      minStock: newProduct.minStock || 10,
      sku: newProduct.sku || `SKU-${Date.now()}`,
      barcode: newProduct.barcode || "",
      description: newProduct.description || "",
      unitType: newProduct.unitType || "pcs",
      image: newProduct.image || productImage,
      status: getStatus(newProduct.stock || 0, newProduct.minStock || 10),
    }

    const updated = [...products, product]
    setProducts(updated)
    saveProducts(updated)

    // Update categories
    if (product.category && !categories.includes(product.category)) {
      setCategories(prev => [...prev, product.category])
    }

    setIsAddOpen(false)
    setNewProduct({ name: "", category: "", price: 0, costPrice: 0, stock: 0, minStock: 10, sku: "", barcode: "", description: "", unitType: "pcs", image: "" })
    setProductImage("")
    setSaving(false)

    toast({ title: "Product added", description: `${product.name} has been added to inventory.` })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Please select an image under 5MB.", variant: "destructive" })
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setProductImage(result)
        setNewProduct(prev => ({ ...prev, image: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setProductImage("")
    setNewProduct(prev => ({ ...prev, image: "" }))
  }

  const handleUpdateProduct = () => {
    if (!editingProduct) return
    setSaving(true)

    const updated = products.map(p =>
      p.id === editingProduct.id
        ? { ...editingProduct, status: getStatus(editingProduct.stock, editingProduct.minStock) }
        : p
    )
    setProducts(updated)
    saveProducts(updated)

    setEditingProduct(null)
    setSaving(false)
    toast({ title: "Product updated", description: `${editingProduct.name} has been updated.` })
  }

  const handleDeleteProduct = (id: string, name: string) => {
    const updated = products.filter(p => p.id !== id)
    setProducts(updated)
    saveProducts(updated)
    toast({ title: "Product deleted", description: `${name} has been removed from inventory.`, variant: "destructive" })
  }

  const handleRestockProduct = () => {
    if (!restockingProduct || restockQuantity <= 0) {
      toast({ title: "Invalid quantity", description: "Please enter a valid quantity.", variant: "destructive" })
      return
    }

    const updated = products.map(p => {
      if (p.id === restockingProduct.id) {
        const newStock = p.stock + restockQuantity
        return { ...p, stock: newStock, status: getStatus(newStock, p.minStock) }
      }
      return p
    })
    setProducts(updated)
    saveProducts(updated)

    toast({ title: "Product restocked", description: `${restockQuantity} units of ${restockingProduct.name} added to stock.` })
    setRestockingProduct(null)
    setRestockQuantity(0)
  }

  const quickRestockAmounts = [10, 25, 50, 100]

  const getStatusBadge = (status: Product["status"]) => {
    switch (status) {
      case "in-stock": return <Badge className="bg-green-500 text-white">In Stock</Badge>
      case "low-stock": return <Badge className="bg-orange-500 text-white">Low Stock</Badge>
      case "out-of-stock": return <Badge className="bg-red-500 text-white">Out of Stock</Badge>
    }
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">{t('inventory.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('inventory.subtitle')}</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="gap-2 w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          <span>{t('inventory.addProduct')}</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">{t('inventory.totalProducts')}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-xl sm:text-2xl font-bold">{stats.total}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">{t('inventory.inStock')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent><div className="text-xl sm:text-2xl font-bold text-green-500">{stats.inStock}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">{t('inventory.lowStock')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent><div className="text-xl sm:text-2xl font-bold text-orange-500">{stats.lowStock}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">{t('inventory.outOfStock')}</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent><div className="text-xl sm:text-2xl font-bold text-red-500">{stats.outOfStock}</div></CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t('inventory.searchPlaceholder')} className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder={t('inventory.category')} /></SelectTrigger>
          <SelectContent>
            {categories.map(cat => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader><CardTitle>{t('inventory.totalProducts')} ({filteredProducts.length})</CardTitle></CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No products found. Add your first product!</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block rounded-md border">
                <div className="grid grid-cols-7 gap-4 p-4 bg-muted/50 font-medium text-sm">
                  <div className="col-span-2">{t('inventory.product')}</div>
                  <div>{t('inventory.sku')}</div>
                  <div>{t('inventory.category')}</div>
                  <div>{t('inventory.price')}</div>
                  <div>{t('inventory.stock')}</div>
                  <div>{t('inventory.status')}</div>
                  <div className="col-span-2">{t('inventory.actions')}</div>
                </div>
                <div className="divide-y">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="grid grid-cols-7 gap-4 p-4 items-center hover:bg-muted/30 transition-colors">
                      <div className="col-span-2">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">Min: {product.minStock}</p>
                      </div>
                      <div className="text-sm font-mono">{product.sku}</div>
                      <div><Badge variant="secondary">{product.category}</Badge></div>
                      <div className="font-semibold">Rs. {product.price.toFixed(2)}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${product.stock <= product.minStock ? 'text-red-500' : ''}`}>{product.stock}</span>
                          {product.stock <= product.minStock && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                        </div>
                      </div>
                      <div>{getStatusBadge(product.status)}</div>
                      <div className="col-span-2 flex gap-2">
                        {product.status === "out-of-stock" ? (
                          <Button variant="default" size="sm" onClick={() => { setRestockingProduct(product); setRestockQuantity(10) }} className="bg-green-600 hover:bg-green-700">
                            <PackagePlus className="w-4 h-4" /><span className="ml-1">{t('inventory.restock')}</span>
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => setEditingProduct(product)}><Edit className="w-4 h-4" /></Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id, product.name)} className="text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{product.sku}</p>
                      </div>
                      {getStatusBadge(product.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Category</p>
                        <Badge variant="secondary">{product.category}</Badge>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Price</p>
                        <p className="font-semibold">Rs. {product.price.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Stock</p>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${product.stock <= product.minStock ? 'text-red-500' : ''}`}>{product.stock}</span>
                          {product.stock <= product.minStock && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                        </div>
                        <p className="text-xs text-muted-foreground">Min: {product.minStock}</p>
                      </div>
                      <div className="flex items-end justify-end">
                        <div className="flex gap-2">
                          {product.status === "out-of-stock" ? (
                            <Button variant="default" size="sm" onClick={() => { setRestockingProduct(product); setRestockQuantity(10) }} className="bg-green-600 hover:bg-green-700">
                              <PackagePlus className="w-4 h-4" /><span className="ml-1">{t('inventory.restock')}</span>
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => setEditingProduct(product)}><Edit className="w-4 h-4" /><span className="ml-1">{t('inventory.edit')}</span></Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id, product.name)} className="text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /><span className="ml-1">{t('inventory.delete')}</span></Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-h-[unset]">
          <DialogHeader>
            <DialogTitle>{t('inventory.addNewProduct')}</DialogTitle>
            <DialogDescription>{t('inventory.enterProductDetails')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t('inventory.productName')}</Label>
              <Input id="name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder={t('inventory.enterProductName')} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sku">{t('inventory.sku')}</Label>
                <Input id="sku" value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} placeholder={t('inventory.enterSku')} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">{t('inventory.category')}</Label>
                <Input id="category" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} placeholder="e.g. Electronics" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="minStock">{t('inventory.minStock')}</Label>
                <Input id="minStock" type="number" value={newProduct.minStock} onChange={(e) => setNewProduct({ ...newProduct, minStock: parseInt(e.target.value) || 10 })} />
              </div>
            </div>

            {/* Image Upload */}
            <div className="grid gap-2">
              <Label>Product Image</Label>
              {productImage ? (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-border">
                  <img src={productImage} alt="Product" className="w-full h-full object-cover" />
                  <button type="button" onClick={removeImage} className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer">
                  <label htmlFor="product-image" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload image</p>
                    </div>
                    <Input id="product-image" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsAddOpen(false)} disabled={saving} className="w-full sm:w-auto">{t('inventory.cancel')}</Button>
            <Button onClick={handleAddProduct} disabled={saving} className="w-full sm:w-auto">
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Adding...</> : t('inventory.add')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-h-[unset]">
          <DialogHeader>
            <DialogTitle>{t('inventory.editProduct')}</DialogTitle>
            <DialogDescription>{t('inventory.updateProduct')}</DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Product Name</Label>
                <Input value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>SKU</Label>
                  <Input value={editingProduct.sku} onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Input value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label>Price</Label>
                  <Input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })} />
                </div>
                <div className="grid gap-2">
                  <Label>Stock</Label>
                  <Input type="number" value={editingProduct.stock} onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="grid gap-2">
                  <Label>Min Stock</Label>
                  <Input type="number" value={editingProduct.minStock} onChange={(e) => setEditingProduct({ ...editingProduct, minStock: parseInt(e.target.value) || 10 })} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setEditingProduct(null)} disabled={saving} className="w-full sm:w-auto">{t('inventory.cancel')}</Button>
            <Button onClick={handleUpdateProduct} disabled={saving} className="w-full sm:w-auto">
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating...</> : t('inventory.update')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restock Dialog */}
      <Dialog open={!!restockingProduct} onOpenChange={() => { setRestockingProduct(null); setRestockQuantity(0) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><PackagePlus className="w-5 h-5 text-green-600" />{t('inventory.restock')}</DialogTitle>
            <DialogDescription>Restock <span className="font-semibold">{restockingProduct?.name}</span></DialogDescription>
          </DialogHeader>
          {restockingProduct && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Stock</span>
                  <span className="text-2xl font-bold text-red-600">{restockingProduct.stock}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Quick Restock Amounts</Label>
                <div className="grid grid-cols-4 gap-2">
                  {quickRestockAmounts.map(amount => (
                    <Button key={amount} variant="outline" size="sm" onClick={() => setRestockQuantity(amount)} className={restockQuantity === amount ? "border-green-600 bg-green-50 dark:bg-green-950" : ""}>{amount}</Button>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Custom Quantity</Label>
                <Input type="number" value={restockQuantity} onChange={(e) => setRestockQuantity(parseInt(e.target.value) || 0)} className="text-lg" />
              </div>
              {restockQuantity > 0 && (
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">New Stock Will Be</span>
                    <span className="text-2xl font-bold text-green-600">{restockingProduct.stock + restockQuantity}</span>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => { setRestockingProduct(null); setRestockQuantity(0) }} className="w-full sm:w-auto">Cancel</Button>
            <Button onClick={handleRestockProduct} className="w-full sm:w-auto bg-green-600 hover:bg-green-700"><PackagePlus className="w-4 h-4 mr-2" />Confirm Restock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import * as React from "react"
import Image from "next/image"
import { Search, Minus, Plus, Trash2, CreditCard, Banknote, ShoppingCart, Bell, Settings, LogOut, Edit2, Printer, QrCode } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { PaymentDialog } from "@/components/sales/payment-dialog"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  category: string
}

interface MenuItem {
  id: number
  name: string
  category: string
  price: number
  stock: number
  img: string
}

const initialMenuItems: MenuItem[] = [
  { id: 1, name: 'Grilled Salmon Steak', category: 'Special', price: 15, stock: 40, img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=250&fit=crop' },
  { id: 2, name: 'Tofu Poke Bowl', category: 'Soups', price: 7, stock: 30, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=250&fit=crop' },
  { id: 3, name: 'Pasta with Roast Beef', category: 'Special', price: 10, stock: 20, img: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=250&fit=crop' },
  { id: 4, name: 'Beef Steak', category: 'Special', price: 30, stock: 15, img: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=400&h=250&fit=crop' },
  { id: 5, name: 'Shrimp Rice Bowl', category: 'Soups', price: 6, stock: 35, img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=250&fit=crop' },
  { id: 6, name: 'Apple Stuffed Pancake', category: 'Desserts', price: 35, stock: 18, img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=250&fit=crop' },
  { id: 7, name: 'Chicken Quinoa & Herbs', category: 'Chickens', price: 12, stock: 22, img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=250&fit=crop' },
  { id: 8, name: 'Vegetable Shrimp', category: 'Soups', price: 10, stock: 0, img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=250&fit=crop' },
  { id: 9, name: 'Chocolate Lava Cake', category: 'Desserts', price: 8, stock: 25, img: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=250&fit=crop' },
  { id: 10, name: 'Tiramisu', category: 'Desserts', price: 9, stock: 20, img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=250&fit=crop' },
  { id: 11, name: 'Cheesecake', category: 'Desserts', price: 7, stock: 15, img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=250&fit=crop' },
  { id: 12, name: 'Grilled Chicken', category: 'Chickens', price: 14, stock: 30, img: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=250&fit=crop' },
  { id: 13, name: 'Chicken Wings', category: 'Chickens', price: 11, stock: 18, img: 'https://images.unsplash.com/photo-1567620832900-627979e3e12c?w=400&h=250&fit=crop' },
  { id: 14, name: 'Chicken Tikka', category: 'Chickens', price: 13, stock: 0, img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=250&fit=crop' },
  { id: 15, name: 'Tomato Soup', category: 'Soups', price: 5, stock: 40, img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=250&fit=crop' },
  { id: 16, name: 'Mushroom Soup', category: 'Soups', price: 6, stock: 28, img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=250&fit=crop' },
  { id: 17, name: 'Ice Cream Sundae', category: 'Desserts', price: 6, stock: 22, img: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400&h=250&fit=crop' },
  { id: 18, name: 'Butter Chicken', category: 'Chickens', price: 15, stock: 20, img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=250&fit=crop' },
]

const categories = [
  { id: 'all', name: '🍽️ All Menu', count: 18, color: 'from-gray-500 to-gray-600' },
  { id: 'special', name: '⭐ Special', count: 3, color: 'from-yellow-500 to-orange-500' },
  { id: 'soups', name: '🍲 Soups', count: 5, color: 'from-blue-500 to-cyan-500' },
  { id: 'desserts', name: '🍰 Desserts', count: 5, color: 'from-pink-500 to-rose-500' },
  { id: 'chickens', name: '🍗 Chickens', count: 5, color: 'from-amber-500 to-orange-500' },
]

const categoryMapping: Record<string, string[]> = {
  all: ['Special', 'Soups', 'Desserts', 'Chickens'],
  special: ['Special'],
  soups: ['Soups'],
  desserts: ['Desserts'],
  chickens: ['Chickens'],
}

export default function POSPage() {
  const { toast } = useToast()
  const [cart, setCart] = React.useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [discount, setDiscount] = React.useState(0)
  const [isPaymentOpen, setIsPaymentOpen] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState('all')
  const [cartItems, setCartItems] = React.useState<Record<string, number>>({})
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>(initialMenuItems)
  const [currentTable] = React.useState({ number: '04', order: 'F0030', people: 2 })

  const filteredProducts = menuItems.filter(p => {
    const matchesCategory = categoryMapping[selectedCategory]?.includes(p.category) || selectedCategory === 'all'
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const addToCart = (product: typeof menuItems[0]) => {
    if (product.stock <= 0) {
      toast({
        title: "Out of Stock",
        description: `${product.name} is currently unavailable.`,
        variant: "destructive",
      })
      return
    }

    // Stock ko 1 kam karo
    setMenuItems(prev => prev.map(m => 
      m.id === product.id ? { ...m, stock: m.stock - 1 } : m
    ))

    setCartItems(prev => {
      const current = prev[product.id.toString()] || 0
      return { ...prev, [product.id.toString()]: current + 1 }
    })
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id.toString())
      if (existing) {
        return prev.map(item => item.id === product.id.toString() ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { id: product.id.toString(), name: product.name, price: product.price, quantity: 1, category: product.category }]
    })
    toast({
      title: "Added to cart",
      description: `${product.name} added. Stock: ${product.stock - 1} left`,
    })
  }

  const updateQuantity = (id: string, delta: number) => {
    const cartItem = cart.find(i => i.id === id)
    if (!cartItem) return

    const menuItem = menuItems.find(m => m.id === parseInt(id))
    if (!menuItem) return

    // Agar delta positive hai aur stock nahi hai toh return
    if (delta > 0 && menuItem.stock <= 0) {
      toast({
        title: "Out of Stock",
        description: `Cannot add more. ${menuItem.name} is out of stock.`,
        variant: "destructive",
      })
      return
    }

    // Agar quantity 1 hai aur minus click kiya, toh item remove karo
    if (cartItem.quantity === 1 && delta === -1) {
      removeFromCart(id)
      return
    }

    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQty }
      }
      return item
    }))
    setCartItems(prev => {
      const current = prev[id] || 0
      return { ...prev, [id]: current + delta }
    })

    // Stock update karo
    setMenuItems(prev => prev.map(m => {
      if (m.id === parseInt(id)) {
        return delta > 0
          ? { ...m, stock: m.stock - 1 }  // Add more = stock -1
          : { ...m, stock: m.stock + 1 }  // Remove = stock +1
      }
      return m
    }))
  }

  const removeFromCart = (id: string) => {
    const cartItem = cart.find(i => i.id === id)
    if (cartItem) {
      // Stock wapas add karo
      setMenuItems(prev => prev.map(m => 
        m.id === parseInt(id) ? { ...m, stock: m.stock + cartItem.quantity } : m
      ))
    }

    setCart(prev => prev.filter(item => item.id !== id))
    setCartItems(prev => {
      const { [id]: _, ...rest } = prev
      return rest
    })
    toast({
      title: "Item removed",
      description: `${cartItem?.name || 'Item'} removed. Stock restored.`,
      variant: "destructive",
    })
  }

  const clearCart = () => {
    // Saara stock wapas karo
    setMenuItems(prev => {
      const updated = [...prev]
      cart.forEach(cartItem => {
        const idx = updated.findIndex(m => m.id.toString() === cartItem.id)
        if (idx !== -1) {
          updated[idx] = { ...updated[idx], stock: updated[idx].stock + cartItem.quantity }
        }
      })
      return updated
    })

    setCart([])
    setCartItems({})
    setDiscount(0)
    toast({
      title: "Cart cleared",
      description: "All items removed and stock restored.",
    })
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = 4
  const donation = 1
  const total = subtotal + tax + donation

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to proceed with payment.",
        variant: "destructive",
      })
      return
    }
    setIsPaymentOpen(true)
  }

  const handlePaymentComplete = () => {
    setCart([])
    setCartItems({})
    setDiscount(0)
    setMenuItems(prev => prev.map(m => m.stock < 0 ? { ...m, stock: 0 } : m)) // Stock negative nahi hona chahiye
    toast({
      title: "Payment successful",
      description: "Order has been placed successfully.",
    })
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">🍽️</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground leading-tight">Tasty Station</h1>
                <p className="text-[10px] text-muted-foreground font-medium">POS Terminal</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search menu, orders and more" 
                className="pl-10 h-10 text-sm border-border bg-muted/50 focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-full text-foreground"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-card animate-pulse" />
            </button>
            <button className="w-9 h-9 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors">
              <Settings className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="w-9 h-9 rounded-full bg-muted hover:bg-destructive/20 flex items-center justify-center transition-colors group">
              <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
            </button>
          </div>
        </div>
      </header>

      <PaymentDialog
        open={isPaymentOpen}
        onOpenChange={setIsPaymentOpen}
        cart={cart}
        subtotal={subtotal}
        tax={tax}
        discount={discount}
        total={total}
        onComplete={handlePaymentComplete}
      />

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 min-h-0 overflow-hidden">
        {/* Foodies Menu */}
        <div className="lg:col-span-8 flex flex-col gap-4 min-h-0">

          {/* Foodies Menu Section */}
          <Card className="border border-border bg-card rounded-2xl overflow-hidden shadow-xl flex-1 flex flex-col">
            <CardHeader className="pb-3 border-b border-border flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <span className="text-xl">🍕</span>
                  Foodies Menu
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4 flex-1 min-h-0 overflow-hidden flex flex-col">
              {/* Category Tabs */}
              <div className="grid grid-cols-5 gap-2 flex-shrink-0">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-2.5 rounded-xl border-2 transition-all ${
                      selectedCategory === cat.id 
                        ? `bg-gradient-to-r ${cat.color} border-transparent text-white shadow-lg scale-105` 
                        : 'bg-card border-border text-muted-foreground hover:border-primary'
                    }`}
                  >
                    <p className={`font-semibold text-xs ${selectedCategory === cat.id ? 'text-white' : 'text-foreground'}`}>{cat.name}</p>
                    <p className={`text-[10px] mt-0.5 ${selectedCategory === cat.id ? 'text-white/80' : 'text-muted-foreground'}`}>{cat.count} items</p>
                  </button>
                ))}
              </div>

              {/* Menu Grid */}
              <ScrollArea className="flex-1 min-h-0">
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {filteredProducts.map((product) => {
                    const quantity = cartItems[product.id.toString()] || 0
                    const isOutOfStock = product.stock <= 0
                    
                    return (
                      <div
                        key={product.id}
                        className={`group relative flex flex-col text-left p-3 rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                          isOutOfStock
                            ? 'opacity-60 border-border cursor-not-allowed'
                            : quantity > 0
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary bg-card'
                        }`}
                      >
                        <div className="relative h-36 mb-3 rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={product.img}
                            alt={product.name}
                            fill
                            className={`object-cover group-hover:scale-110 transition-transform duration-300 ${isOutOfStock ? 'grayscale' : ''}`}
                          />
                          {isOutOfStock && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Badge className="bg-red-500 text-white text-xs">❌ Out of Stock</Badge>
                            </div>
                          )}
                        </div>
                        <div className="mb-2 flex-1">
                          <Badge className={`text-[10px] mb-1.5 font-semibold border-0 ${
                            quantity > 0 ? 'bg-gradient-to-r from-primary to-secondary text-white' : 'bg-muted text-muted-foreground'
                          }`}>{product.category}</Badge>
                          <h3 className="font-semibold text-sm line-clamp-2 text-foreground leading-tight">{product.name}</h3>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <div>
                            <span className="text-primary font-bold text-base">Rs. {product.price}.00</span>
                            <p className={`text-[10px] font-semibold ${
                              isOutOfStock ? 'text-red-500' : product.stock <= 5 ? 'text-orange-500' : 'text-green-600'
                            }`}>
                              {isOutOfStock ? '❌ Out' : `✓ ${product.stock} left`}
                            </p>
                          </div>
                          {!isOutOfStock && (
                            <>
                              {quantity === 0 ? (
                                <div
                                  onClick={(e) => { e.stopPropagation(); addToCart(product) }}
                                  className="w-7 h-7 rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 flex items-center justify-center transition-all shadow-md cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5 text-white" />
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 bg-card rounded-full shadow-md border-2 border-primary">
                                  <div
                                    onClick={(e) => { e.stopPropagation(); updateQuantity(product.id.toString(), -1) }}
                                    className="w-6 h-6 rounded-full hover:bg-primary/10 flex items-center justify-center transition-colors cursor-pointer"
                                  >
                                    <Minus className="w-2.5 h-2.5 text-primary" />
                                  </div>
                                  <span className="w-4 text-center text-xs font-bold text-primary">{quantity}</span>
                                  <div
                                    onClick={(e) => { e.stopPropagation(); updateQuantity(product.id.toString(), 1) }}
                                    className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 flex items-center justify-center transition-all cursor-pointer"
                                  >
                                    <Plus className="w-2.5 h-2.5 text-white" />
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Cart / Order Summary Sidebar */}
        <Card className="lg:col-span-4 flex flex-col shadow-xl border border-border overflow-hidden bg-card rounded-2xl">
          {/* Table Info */}
          <div className="p-4 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-foreground">Table No #{currentTable.number}</h3>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                </button>
                <button 
                  onClick={clearCart}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-destructive/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Order #{currentTable.order}</p>
            <p className="text-sm font-medium text-foreground">{currentTable.people} People</p>
          </div>

          {/* Ordered Items */}
          <CardContent className="flex-1 p-4 min-h-0 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 min-h-0">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground">Ordered Items</h4>
                <span className="text-sm text-muted-foreground">{cart.length}</span>
              </div>
              
              {cart.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No items in cart</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-muted/50 p-3 rounded-xl">
                      <div>
                        <p className="font-medium text-sm text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-6 h-6 rounded-full hover:bg-destructive/20 flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Payment Summary */}
            <div className="mt-4 pt-4 border-t border-border flex-shrink-0">
              <h4 className="font-semibold text-foreground mb-3">Payment Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium text-foreground">Rs. {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Donation</span>
                  <span className="font-medium text-primary">Rs. {donation.toFixed(2)}</span>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between items-center">
                <span className="font-semibold text-foreground">Total Payable</span>
                <span className="text-xl font-bold text-primary">Rs. {total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col bg-muted/30 p-4 space-y-3 border-t border-border flex-shrink-0">
            {/* Payment Method */}
            <div>
              <h4 className="font-semibold text-foreground mb-2 text-sm">Payment Method</h4>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-2">
                  <Banknote className="w-4 h-4" />
                  <span className="text-xs">Cash</span>
                </Button>
                <Button className="flex flex-col items-center gap-1 h-auto py-2 bg-primary hover:bg-primary/80">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-xs">Card</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-2">
                  <QrCode className="w-4 h-4" />
                  <span className="text-xs">Scan</span>
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 w-full">
              <Button variant="outline" className="flex items-center gap-1">
                <Printer className="w-4 h-4" />
                <span className="text-xs">Print</span>
              </Button>
              <Button
                className="col-span-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white font-semibold"
                disabled={cart.length === 0}
                onClick={handleCheckout}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Place Order
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

"use client"

import * as React from "react"
import Image from "next/image"
import { Search, Minus, Plus, Trash2, CreditCard, Banknote, ShoppingCart, ChevronLeft, ChevronRight, QrCode, Bell, Settings, LogOut, Edit2, Printer } from "lucide-react"
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

interface Order {
  id: string
  tableNumber: string
  itemCount: number
  timeAgo: string
  status: "in-kitchen" | "wait-list" | "ready"
}

const menuItems = [
  { id: 1, name: 'Grilled Salmon Steak', category: 'Lunch', price: 15, stock: 25, img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop' },
  { id: 2, name: 'Tofu Poke Bowl', category: 'Salad', price: 7, stock: 30, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop' },
  { id: 3, name: 'Pasta with Roast Beef', category: 'Pasta', price: 10, stock: 20, img: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop' },
  { id: 4, name: 'Beef Steak', category: 'Beef', price: 30, stock: 15, img: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=400&h=300&fit=crop' },
  { id: 5, name: 'Shrimp Rice Bowl', category: 'Rice', price: 6, stock: 35, img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop' },
  { id: 6, name: 'Apple Stuffed Pancake', category: 'Dessert', price: 35, stock: 18, img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop' },
  { id: 7, name: 'Chicken Quinoa & Herbs', category: 'Chicken', price: 12, stock: 22, img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop' },
  { id: 8, name: 'Vegetable Shrimp', category: 'Salad', price: 10, stock: 28, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop' },
]

const menuCategories = [
  { id: 'all', name: '🍽️ All Menu', count: 154 },
  { id: 'special', name: '⭐ Special', count: 19 },
  { id: 'soups', name: '🍲 Soups', count: 3 },
  { id: 'desserts', name: '🍰 Desserts', count: 19 },
  { id: 'chickens', name: '🍗 Chickens', count: 10 },
]

const orderLineData: Order[] = [
  { id: 'F0027', tableNumber: '03', itemCount: 8, timeAgo: '2 mins ago', status: 'in-kitchen' },
  { id: 'F0028', tableNumber: '07', itemCount: 3, timeAgo: 'Just Now', status: 'wait-list' },
  { id: 'F0019', tableNumber: '09', itemCount: 2, timeAgo: '25 mins ago', status: 'ready' },
]

const orderFilters = [
  { id: 'all', name: 'All', count: 78 },
  { id: 'dine-in', name: 'Dine in', count: 4 },
  { id: 'wait-list', name: 'Wait List', count: 3 },
  { id: 'take-away', name: 'Take Away', count: 12 },
  { id: 'served', name: 'Served', count: 59 },
]

export default function POSPage() {
  const { toast } = useToast()
  const [cart, setCart] = React.useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [discount, setDiscount] = React.useState(0)
  const [isPaymentOpen, setIsPaymentOpen] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState('all')
  const [selectedFilter, setSelectedFilter] = React.useState('all')
  const [cartItems, setCartItems] = React.useState<Record<string, number>>({})
  const [currentTable, setCurrentTable] = React.useState({ number: '04', order: 'F0030', people: 2 })

  const filteredProducts = menuItems.filter(p =>
    selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase()
  ).filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addToCart = (product: typeof menuItems[0]) => {
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
      description: `${product.name} added to transaction.`,
    })
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQty }
      }
      return item
    }))
    setCartItems(prev => {
      const current = prev[id] || 0
      const newValue = current + delta
      if (newValue <= 0) {
        const { [id]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [id]: newValue }
    })
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
    setCartItems(prev => {
      const { [id]: _, ...rest } = prev
      return rest
    })
    toast({
      title: "Item removed",
      description: "Item has been removed from cart.",
      variant: "destructive",
    })
  }

  const clearCart = () => {
    setCart([])
    setCartItems({})
    setDiscount(0)
    toast({
      title: "Cart cleared",
      description: "All items have been removed.",
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
    toast({
      title: "Payment successful",
      description: "Order has been placed successfully.",
    })
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'in-kitchen':
        return { bg: 'bg-teal-50', border: 'border-teal-300', badge: 'bg-teal-500', text: 'text-teal-700' }
      case 'wait-list':
        return { bg: 'bg-orange-50', border: 'border-orange-300', badge: 'bg-orange-500', text: 'text-orange-700' }
      case 'ready':
        return { bg: 'bg-purple-50', border: 'border-purple-300', badge: 'bg-purple-500', text: 'text-purple-700' }
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-300', badge: 'bg-gray-500', text: 'text-gray-700' }
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="bg-card border border-border px-6 py-3">
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
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 min-h-0">
        {/* Foodies Menu */}
        <div className="lg:col-span-8 flex flex-col gap-4 min-h-0 overflow-auto">

          {/* Foodies Menu Section */}
          <Card className="border border-border bg-card rounded-2xl overflow-hidden shadow-xl flex-1">
            <CardHeader className="pb-3 border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <span className="text-xl">🍕</span>
                  Foodies Menu
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="rounded-full h-8 w-8 border-border hover:bg-muted">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full h-8 w-8 border-border hover:bg-muted">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Category Tabs */}
              <div className="grid grid-cols-5 gap-2">
                {menuCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-2.5 rounded-xl border-2 transition-all ${
                      selectedCategory === cat.id 
                        ? 'bg-gradient-to-r from-primary to-secondary border-primary text-white shadow-lg scale-105' 
                        : 'bg-card border-border text-muted-foreground hover:border-primary'
                    }`}
                  >
                    <p className={`font-semibold text-xs ${selectedCategory === cat.id ? 'text-white' : 'text-foreground'}`}>{cat.name}</p>
                    <p className={`text-[10px] mt-0.5 ${selectedCategory === cat.id ? 'text-white/80' : 'text-muted-foreground'}`}>{cat.count} items</p>
                  </button>
                ))}
              </div>

              {/* Menu Grid */}
              <ScrollArea className="h-[450px]">
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {filteredProducts.map((product) => {
                    const quantity = cartItems[product.id.toString()] || 0
                    return (
                      <div
                        key={product.id}
                        onClick={() => addToCart(product)}
                        className={`group relative flex flex-col text-left p-3 rounded-xl border-2 transition-all duration-300 overflow-hidden cursor-pointer ${
                          quantity > 0
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary bg-card'
                        }`}
                      >
                        <div className="relative h-36 mb-3 rounded-lg overflow-hidden bg-muted">
                          <img
                            src={product.img}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="mb-2 flex-1">
                          <Badge className={`text-[10px] mb-1.5 font-semibold border-0 ${
                            quantity > 0 ? 'bg-gradient-to-r from-primary to-secondary text-white' : 'bg-muted text-muted-foreground'
                          }`}>{product.category}</Badge>
                          <h3 className="font-semibold text-sm line-clamp-2 text-foreground leading-tight">{product.name}</h3>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-primary font-bold text-base">${product.price}.00</span>
                          {quantity === 0 ? (
                            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 flex items-center justify-center transition-all shadow-md">
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
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-foreground">Table No #{currentTable.number}</h3>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-destructive/20 transition-colors">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Order #{currentTable.order}</p>
            <p className="text-sm font-medium text-foreground">{currentTable.people} People</p>
          </div>

          {/* Ordered Items */}
          <CardContent className="flex-1 p-4 min-h-0">
            <ScrollArea className="h-[350px]">
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
                        <span className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</span>
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
            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="font-semibold text-foreground mb-3">Payment Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Donation</span>
                  <span className="font-medium text-primary">${donation.toFixed(2)}</span>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between items-center">
                <span className="font-semibold text-foreground">Total Payable</span>
                <span className="text-xl font-bold text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col bg-muted/30 p-4 space-y-3 border-t border-border">
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

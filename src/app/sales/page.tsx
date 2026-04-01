"use client"

import * as React from "react"
import { Search, ScanBarcode, Minus, Plus, Trash2, CreditCard, Banknote, UserPlus, ShoppingCart } from "lucide-react"
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
}

const DEMO_PRODUCTS = [
  { id: "1", name: "Wireless Mouse", price: 850, stock: 45, sku: "WMS-001" },
  { id: "2", name: "Mechanical Keyboard", price: 4500, stock: 12, sku: "MKB-002" },
  { id: "3", name: "HD Monitor 24\"", price: 12000, stock: 8, sku: "MON-003" },
  { id: "4", name: "USB-C Cable 2m", price: 450, stock: 150, sku: "USB-004" },
  { id: "5", name: "Gaming Headset", price: 3200, stock: 15, sku: "HST-005" },
  { id: "6", name: "Laptop Stand", price: 1200, stock: 30, sku: "LPS-006" },
]

export default function POSPage() {
  const { toast } = useToast()
  const [cart, setCart] = React.useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [discount, setDiscount] = React.useState(0)
  const [isPaymentOpen, setIsPaymentOpen] = React.useState(false)

  const filteredProducts = DEMO_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addToCart = (product: typeof DEMO_PRODUCTS[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }]
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
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
    toast({
      title: "Item removed",
      description: "Item has been removed from cart.",
      variant: "destructive",
    })
  }

  const clearCart = () => {
    setCart([])
    setDiscount(0)
    toast({
      title: "Cart cleared",
      description: "All items have been removed.",
    })
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.18 // 18% GST simulation
  const total = subtotal + tax - discount

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
    setDiscount(0)
  }

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">POS Terminal</h1>
          <p className="text-muted-foreground">Process sales transactions quickly</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <UserPlus className="w-4 h-4" />
            Add Customer
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <ScanBarcode className="w-4 h-4" />
            Scan Mode
          </Button>
        </div>
      </div>

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

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Product Selection Area */}
        <div className="lg:col-span-8 flex flex-col gap-4 min-h-0">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search products by name or SKU..." 
              className="pl-10 h-12 text-lg shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <ScrollArea className="flex-1 rounded-xl border bg-card p-4 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="flex flex-col text-left p-4 rounded-lg border hover:border-accent hover:bg-accent/5 transition-all group relative overflow-hidden"
                >
                  <div className="mb-2">
                    <Badge variant="secondary" className="text-[10px] mb-1">{product.sku}</Badge>
                    <h3 className="font-bold text-sm line-clamp-2">{product.name}</h3>
                  </div>
                  <div className="mt-auto flex items-end justify-between">
                    <span className="text-primary font-bold">₹{product.price}</span>
                    <span className="text-[10px] text-muted-foreground">Stock: {product.stock}</span>
                  </div>
                  <div className="absolute inset-0 bg-accent/10 opacity-0 group-active:opacity-100 transition-opacity"></div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Cart / Checkout Area */}
        <Card className="lg:col-span-4 flex flex-col shadow-lg border-primary/10 overflow-hidden">
          <CardHeader className="bg-primary/5 py-4">
            <CardTitle className="text-lg flex items-center justify-between">
              Current Cart
              <Badge className="bg-primary">{cart.length} items</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 min-h-0">
            <ScrollArea className="h-[400px]">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground opacity-50">
                  <ShoppingCart className="w-12 h-12 mb-4" />
                  <p>Cart is empty. Start adding items to process a sale.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {cart.map((item) => (
                    <div key={item.id} className="p-4 flex items-center gap-3 group">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">₹{item.price} x {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-4 text-center text-sm">{item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="w-16 text-right font-bold text-sm">
                        ₹{item.price * item.quantity}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex-col bg-muted/30 p-6 space-y-4">
            <div className="w-full space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST (18%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Discount</span>
                <Input 
                  type="number" 
                  className="w-20 h-7 text-right" 
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-xl font-bold text-primary">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              <Button variant="outline" className="h-12 gap-2">
                <Banknote className="w-4 h-4" />
                Cash
              </Button>
              <Button variant="outline" className="h-12 gap-2">
                <CreditCard className="w-4 h-4" />
                Card / UPI
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              <Button
                variant="outline"
                className="h-12 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                onClick={clearCart}
                disabled={cart.length === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
              <Button
                className="h-12 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={cart.length === 0}
                onClick={handleCheckout}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                PAY NOW
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
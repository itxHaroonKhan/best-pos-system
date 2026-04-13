"use client"

import * as React from "react"
import Image from "next/image"
import { Search, Minus, Plus, Trash2, ShoppingCart, Bell, Settings, LogOut, Edit2, Printer, ChevronDown, ChevronUp, Globe } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { PaymentDialog } from "@/components/sales/payment-dialog"
import { ReceiptPrintDialog } from "@/components/sales/receipt-print-dialog"
import api from "@/lib/api"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  category: string
}

interface OrderData {
  cart: CartItem[]
  subtotal: number
  tax: number
  donation: number
  total: number
  paymentMethod: string
}

interface MenuItem {
  id: number
  name: string
  category: string
  price: number
  stock: number
  img: string
}

const categories = [
  { id: 'all', nameKey: 'category.all', color: 'from-gray-500 to-gray-600' },
  { id: 'special', nameKey: 'category.special', color: 'from-yellow-500 to-orange-500' },
  { id: 'soups', nameKey: 'category.soups', color: 'from-blue-500 to-cyan-500' },
  { id: 'desserts', nameKey: 'category.desserts', color: 'from-pink-500 to-rose-500' },
  { id: 'chickens', nameKey: 'category.chickens', color: 'from-amber-500 to-orange-500' },
]

const categoryMapping: Record<string, string[]> = {
  all: [],  // Will be populated from API
  special: ['Special'],
  soups: ['Soups'],
  desserts: ['Desserts'],
  chickens: ['Chickens'],
}

export default function POSPage() {
  const { toast } = useToast()
  const { t, language, setLanguage, isRTL } = useLanguage()
  const [cart, setCart] = React.useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [discount, setDiscount] = React.useState(0)
  const [isPaymentOpen, setIsPaymentOpen] = React.useState(false)
  const [isPrintDialogOpen, setIsPrintDialogOpen] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState('all')
  const [cartItems, setCartItems] = React.useState<Record<string, number>>({})
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>([])
  const [menuLoading, setMenuLoading] = React.useState(true)
  const [currentTable] = React.useState({ number: '04', order: 'F0030', people: 2 })
  const [showMobileCart, setShowMobileCart] = React.useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<string>("Card")
  const [savedOrder, setSavedOrder] = React.useState<OrderData | null>(null)

  // Fetch menu items from API
  React.useEffect(() => {
    const fetchMenu = async () => {
      try {
        setMenuLoading(true)
        const res = await api.get('/menu')
        const items = res.data.data.items || []
        const menuData = items.map((item: any, index: number) => ({
          id: item.id || index + 1,
          name: item.name,
          category: item.category || 'General',
          price: parseFloat(item.price) || 0,
          stock: parseInt(item.stock) || 0,
          img: item.image || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=250&fit=crop`,
        }))
        setMenuItems(menuData)

        // Populate 'all' category dynamically
        const allCategories: string[] = [...new Set(items.map((item: any) => item.category).filter(Boolean)) as Set<string>]
        categoryMapping.all = allCategories
      } catch (err) {
        // Fallback: use empty state
        setMenuItems([])
      } finally {
        setMenuLoading(false)
      }
    }
    fetchMenu()
  }, [])

  const filteredProducts = menuItems.filter(p => {
    const matchesCategory = selectedCategory === 'all' || categoryMapping[selectedCategory]?.includes(p.category)
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const addToCart = (product: typeof menuItems[0]) => {
    if (product.stock <= 0) {
      toast({
        title: t('menu.outOfStock'),
        description: `${product.name} ${t('menu.left').toLowerCase()}`,
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
      title: t('msg.addedToCart'),
      description: `${product.name} - ${product.stock - 1} ${t('menu.left')}`,
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
      title: t('msg.removed'),
      description: `${cartItem?.name || 'Item'} - ${t('cart.empty')}`,
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
      title: t('msg.cleared'),
      description: `${t('cart.orderedItems')} - ${t('cart.empty')}`,
    })
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = 4
  const donation = 1
  const total = subtotal + tax + donation

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: t('msg.cartEmpty'),
        description: t('msg.cartEmptyDesc'),
        variant: "destructive",
      })
      return
    }
    setIsPaymentOpen(true)
  }

  const handlePaymentComplete = () => {
    // Pehle cart data save karo (clear hone se pehle!)
    const orderData: OrderData = {
      cart: [...cart],
      subtotal,
      tax,
      donation,
      total,
      paymentMethod: selectedPaymentMethod,
    }
    setSavedOrder(orderData)
    
    // Ab cart clear karo
    setCart([])
    setCartItems({})
    setDiscount(0)
    setMenuItems(prev => prev.map(m => m.stock < 0 ? { ...m, stock: 0 } : m))
    setShowMobileCart(false)

    toast({
      title: t('msg.paymentSuccess'),
      description: t('msg.orderPlaced'),
    })

    // Thoda delay do taaki payment dialog properly close ho jaye
    // Uske baad print dialog open karo with saved order
    setTimeout(() => {
      setIsPrintDialogOpen(true)
    }, 300)
  }

  return (
    <div className="h-[100dvh] w-full flex flex-col overflow-visible max-w-[100vw]" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header - Optimized for 320px+ screens */}
      <header className="bg-card border-b border-border px-2 xs:px-2.5 sm:px-4 md:px-6 py-2 xs:py-2.5 sm:py-3 flex-shrink-0 safe-top relative z-50">
        <div className="flex items-center justify-between gap-1.5 xs:gap-2 max-w-full overflow-x-visible">
          {/* Logo Section */}
          <div className="flex items-center gap-1.5 xs:gap-2 flex-shrink-0 min-w-0">
            <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-primary to-secondary rounded-lg xs:rounded-xl flex items-center justify-center shadow-lg text-white flex-shrink-0">
              {/* Crown Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 md:w-6 md:h-6">
                <path d="M3 18L5 6L9 12L12 4L15 12L19 6L21 18H3Z" fill="currentColor"/>
                <path d="M9 14L7.5 16L9 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 14L16.5 16L15 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="hidden xs:block min-w-0">
              <h1 className="text-xs xs:text-sm sm:text-base md:text-lg font-bold text-foreground leading-tight truncate">{t('app.title')}</h1>
              <p className="text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] text-muted-foreground font-medium">{t('pos.terminal')}</p>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile, shown on md+ */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('header.search')}
                className="pl-10 h-10 text-sm border-border bg-muted/50 focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-full text-foreground"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 xs:gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              className="w-8 h-8 xs:w-9 xs:h-9 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors text-xs font-bold"
              title={language === 'en' ? 'اردو' : 'English'}
            >
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span className="absolute -bottom-0.5 -right-0.5 text-[8px]">{language === 'en' ? 'UR' : 'EN'}</span>
            </button>

            {/* Mobile Cart Button */}
            <button
              className="lg:hidden relative w-10 h-10 xs:w-11 xs:h-11 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors active:scale-95 border-2 border-primary/30"
              onClick={() => setShowMobileCart(!showMobileCart)}
              aria-label="Toggle cart"
            >
              <ShoppingCart className="w-5 h-5 text-primary" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 xs:w-6 xs:h-6 bg-primary text-white text-[10px] xs:text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                  {cart.length}
                </span>
              )}
            </button>

            <button className="hidden md:flex w-9 h-9 rounded-full bg-muted hover:bg-muted/80 items-center justify-center transition-colors">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-card animate-pulse" />
            </button>
            <button className="hidden md:flex w-9 h-9 rounded-full bg-muted hover:bg-muted/80 items-center justify-center transition-colors">
              <Settings className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="hidden md:flex w-9 h-9 rounded-full bg-muted hover:bg-destructive/20 items-center justify-center transition-colors group">
              <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar - Optimized for small screens */}
        <div className="mt-1.5 xs:mt-2 md:hidden">
          <div className="relative">
            <Search className="absolute left-2.5 xs:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 xs:h-4 xs:w-4 text-muted-foreground" />
            <Input
              placeholder={t('header.search.mobile')}
              className="pl-9 xs:pl-10 h-8 xs:h-9 text-xs xs:text-sm border-border bg-muted/50 focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-full text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
        onPaymentMethodChange={setSelectedPaymentMethod}
      />

      <ReceiptPrintDialog
        open={isPrintDialogOpen}
        onOpenChange={(open) => {
          setIsPrintDialogOpen(open)
          // Jab print dialog band ho to saved order clear karo
          if (!open) {
            setSavedOrder(null)
          }
        }}
        cart={savedOrder?.cart || cart}
        subtotal={savedOrder?.subtotal || subtotal}
        tax={savedOrder?.tax || tax}
        discount={savedOrder ? 0 : discount}
        total={savedOrder?.total || total}
        paymentMethod={savedOrder?.paymentMethod || selectedPaymentMethod}
        orderNumber={currentTable.order}
        tableNumber={currentTable.number}
      />

      {/* Main Content - Optimized for 320px+ */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 xs:gap-3 sm:gap-4 p-2 xs:p-3 sm:p-4 pb-16 xs:pb-20 lg:pb-4 min-h-0 overflow-hidden relative">
        {/* Mobile Cart Placeholder Bar - Shows when cart is closed and has items */}
        {!showMobileCart && cart.length > 0 && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-2xl safe-bottom">
            <div
              className="flex items-center justify-between p-3 xs:p-4 cursor-pointer active:bg-muted/50 transition-colors"
              onClick={() => setShowMobileCart(true)}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex items-center gap-2 bg-primary/10 rounded-full px-3 py-2">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-sm text-foreground">{cart.reduce((sum, item) => sum + item.quantity, 0)} items</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground truncate">{t('cart.total')}</p>
                  <p className="font-bold text-base text-primary">Rs. {total.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-primary font-semibold text-sm flex-shrink-0">
                <span>{t('payment.checkout')}</span>
                <ChevronUp className="w-5 h-5" />
              </div>
            </div>
          </div>
        )}

        {/* Mobile Cart Overlay Background */}
        {showMobileCart && (
          <div className="fixed inset-0 bg-black/50 z-[9998] lg:hidden" onClick={() => setShowMobileCart(false)} />
        )}
        {/* Foodies Menu */}
        <div className={`lg:col-span-8 flex flex-col gap-2 xs:gap-3 sm:gap-4 min-h-0 ${showMobileCart ? 'hidden lg:flex' : 'flex'}`}>

          {/* Foodies Menu Section */}
          <Card className="border border-border bg-card rounded-xl xs:rounded-2xl overflow-hidden shadow-xl flex-1 flex flex-col relative z-0">
            <CardHeader className="pb-2 xs:pb-3 border-b border-border flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm xs:text-base sm:text-lg font-bold text-foreground flex items-center gap-1.5 xs:gap-2">
                  <span className="text-base xs:text-lg sm:text-xl">🍕</span>
                  <span className="hidden xs:inline">{t('menu.title')}</span>
                  <span className="xs:hidden">Menu</span>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-2 xs:p-3 sm:p-4 space-y-3 xs:space-y-4 flex-1 min-h-0 overflow-hidden flex flex-col">
              {/* Category Tabs - Horizontally scrollable on mobile */}
              <div className="flex gap-1 xs:gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 xs:pb-2 flex-shrink-0 scrollbar-hide -mx-2 px-2 xs:mx-0 xs:px-0 snap-x snap-mandatory">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex-shrink-0 snap-start px-3 xs:px-3.5 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl border-2 transition-all min-w-[80px] xs:min-w-[85px] sm:min-w-[100px] active:scale-95 touch-manipulation ${
                      selectedCategory === cat.id
                        ? `bg-gradient-to-r ${cat.color} border-transparent text-white shadow-lg scale-105`
                        : 'bg-card border-border text-muted-foreground hover:border-primary'
                    }`}
                  >
                    <p className={`font-semibold text-[10px] xs:text-[11px] sm:text-sm whitespace-nowrap ${selectedCategory === cat.id ? 'text-white' : 'text-foreground'}`}>{t(cat.nameKey as any)}</p>
                    <p className={`text-[9px] xs:text-[10px] sm:text-[11px] mt-0.5 whitespace-nowrap ${selectedCategory === cat.id ? 'text-white/80' : 'text-muted-foreground'}`}>{selectedCategory === 'all' ? menuItems.length : menuItems.filter(m => categoryMapping[cat.id]?.includes(m.category)).length} items</p>
                  </button>
                ))}
              </div>

              {/* Menu Grid - 1 col mobile, 2 col tablet, 3-4 col desktop */}
              <ScrollArea className="flex-1 min-h-0 scrollbar-thin relative z-[1]">
                {menuLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : menuItems.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No menu items available</p>
                  </div>
                ) : (
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 xs:gap-2.5 sm:gap-3">
                  {filteredProducts.map((product) => {
                    const quantity = cartItems[product.id.toString()] || 0
                    const isOutOfStock = product.stock <= 0

                    return (
                      <div
                        key={product.id}
                        className={`group relative flex flex-col text-left p-1.5 xs:p-2 sm:p-2.5 md:p-3 rounded-lg xs:rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                          isOutOfStock
                            ? 'opacity-60 border-border cursor-not-allowed'
                            : quantity > 0
                              ? 'border-primary bg-primary/10 shadow-md'
                              : 'border-border hover:border-primary bg-card hover:shadow-lg'
                        }`}
                        style={{ zIndex: 1, wordBreak: 'break-word' }}
                      >
                        <div className="relative h-28 xs:h-32 sm:h-36 md:h-40 mb-1.5 xs:mb-2 sm:mb-3 rounded-md xs:rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={product.img}
                            alt={product.name}
                            fill
                            className={`object-cover group-hover:scale-110 transition-transform duration-300 ${isOutOfStock ? 'grayscale' : ''}`}
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                          />
                          {isOutOfStock && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Badge className="bg-red-500 text-white text-[9px] xs:text-xs">❌ Out of Stock</Badge>
                            </div>
                          )}
                        </div>
                        <div className="mb-1.5 xs:mb-2 flex-1 min-h-0">
                          <Badge className={`text-[8px] xs:text-[9px] sm:text-[10px] mb-1 font-semibold border-0 ${
                            quantity > 0 ? 'bg-gradient-to-r from-primary to-secondary text-white' : 'bg-muted text-muted-foreground'
                          }`}>{product.category}</Badge>
                          <h3 className="font-semibold text-[10px] xs:text-xs sm:text-sm line-clamp-2 text-foreground leading-tight break-words break-all max-w-full">{product.name}</h3>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="min-w-0 flex-1">
                            <span className="text-primary font-bold text-[10px] xs:text-xs sm:text-sm">Rs. {product.price}.00</span>
                            <p className={`text-[8px] xs:text-[9px] sm:text-[10px] font-semibold truncate ${
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
                                  className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 flex items-center justify-center transition-all shadow-md cursor-pointer active:scale-90 flex-shrink-0"
                                >
                                  <Plus className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-white" />
                                </div>
                              ) : (
                                <div className="flex items-center gap-0.5 xs:gap-1 bg-card rounded-full shadow-md border-2 border-primary flex-shrink-0">
                                  <div
                                    onClick={(e) => { e.stopPropagation(); updateQuantity(product.id.toString(), -1) }}
                                    className="w-6 h-6 xs:w-7 xs:h-7 rounded-full hover:bg-primary/10 flex items-center justify-center transition-colors cursor-pointer active:scale-90"
                                  >
                                    <Minus className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-primary" />
                                  </div>
                                  <span className="w-3.5 xs:w-4 text-center text-[10px] xs:text-xs font-bold text-primary">{quantity}</span>
                                  <div
                                    onClick={(e) => { e.stopPropagation(); updateQuantity(product.id.toString(), 1) }}
                                    className="w-6 h-6 xs:w-7 xs:h-7 rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 flex items-center justify-center transition-all cursor-pointer active:scale-90"
                                  >
                                    <Plus className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-white" />
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
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Cart / Order Summary Sidebar */}
        <Card className={`lg:col-span-4 flex flex-col shadow-2xl border border-border overflow-hidden bg-card rounded-xl xs:rounded-2xl z-50 ${
          showMobileCart
            ? 'fixed inset-0 z-[9999] lg:static lg:z-auto m-0 rounded-none lg:rounded-2xl safe-bottom flex-col'
            : 'hidden lg:flex'
        }`}>
          {/* Mobile Close Button */}
          <div className="lg:hidden flex justify-end p-2 border-b border-border">
            <button
              onClick={() => setShowMobileCart(false)}
              className="w-9 h-9 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center touch-target-sm active:scale-90"
              aria-label="Close cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="p-2 xs:p-3 md:p-4 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm xs:text-base md:text-lg font-semibold text-foreground truncate">{t('cart.title')} #{currentTable.number}</h3>
              <div className="flex gap-1.5 xs:gap-2 flex-shrink-0">
                <button className="hidden md:flex w-8 h-8 rounded-lg items-center justify-center hover:bg-muted transition-colors">
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={clearCart}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-destructive/20 transition-colors active:scale-90"
                  aria-label={t('cart.clear')}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-3 xs:gap-x-4 gap-y-1">
              <p className="text-[10px] xs:text-xs md:text-sm text-muted-foreground">{t('cart.order')} #{currentTable.order}</p>
              <p className="text-[10px] xs:text-xs md:text-sm font-medium text-foreground">{currentTable.people} {t('cart.people')}</p>
            </div>
          </div>

          {/* Ordered Items */}
          <CardContent className="flex-1 p-2 xs:p-3 md:p-4 min-h-0 overflow-y-auto flex flex-col">
            <ScrollArea className="flex-1 min-h-0 max-h-[40vh] scrollbar-thin">
              <div className="flex items-center justify-between mb-2 xs:mb-3">
                <h4 className="font-semibold text-xs xs:text-sm md:text-base text-foreground">{t('cart.orderedItems')}</h4>
                <span className="text-[10px] xs:text-xs md:text-sm text-muted-foreground">{cart.length}</span>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-6 xs:py-8 text-muted-foreground">
                  <ShoppingCart className="w-10 h-10 xs:w-12 xs:h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-[10px] xs:text-sm">{t('cart.empty')}</p>
                </div>
              ) : (
                <div className="space-y-1.5 xs:space-y-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-muted/50 p-2 xs:p-2.5 sm:p-3 rounded-lg xs:rounded-xl">
                      <div className="flex-1 min-w-0 mr-1.5 xs:mr-2">
                        <p className="font-medium text-xs xs:text-xs md:text-sm text-foreground truncate">{item.name}</p>
                        <p className="text-[10px] xs:text-[10px] md:text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-1.5 xs:gap-2 flex-shrink-0">
                        <span className="font-bold text-primary text-xs xs:text-xs md:text-sm">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-8 h-8 xs:w-8 xs:h-8 rounded-full hover:bg-destructive/20 flex items-center justify-center transition-colors active:scale-90 touch-target-sm"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4 xs:w-4 xs:h-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Payment Summary */}
            <div className="mt-3 xs:mt-4 pt-3 xs:pt-4 border-t border-border flex-shrink-0">
              <h4 className="font-semibold text-xs xs:text-sm md:text-base text-foreground mb-2 xs:mb-3">{t('payment.summary')}</h4>
              <div className="space-y-1.5 xs:space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('payment.subtotal')}</span>
                  <span className="font-medium text-foreground">Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('payment.tax')}</span>
                  <span className="font-medium text-foreground">Rs. {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('payment.donation')}</span>
                  <span className="font-medium text-primary">Rs. {donation.toFixed(2)}</span>
                </div>
              </div>
              <Separator className="my-2 xs:my-3" />
              <div className="flex justify-between items-center">
                <span className="font-semibold text-xs xs:text-sm md:text-base text-foreground">{t('payment.totalPayable')}</span>
                <span className="text-lg xs:text-lg md:text-xl font-bold text-primary">Rs. {total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col bg-muted/30 p-2 xs:p-3 md:p-4 space-y-2 xs:space-y-2.5 sm:space-y-3 border-t border-border flex-shrink-0 safe-bottom">
            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-1.5 xs:gap-2 w-full">
              <Button
                variant="outline"
                className="flex items-center justify-center gap-1 text-xs h-10 xs:h-10 active:scale-95 touch-target-sm"
                onClick={() => setIsPrintDialogOpen(true)}
              >
                <Printer className="w-4 h-4 md:w-4 md:h-4" />
                <span className="hidden sm:inline">{t('payment.print')}</span>
              </Button>
              <Button
                className="col-span-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white font-semibold text-xs md:text-sm h-10 xs:h-10 active:scale-95 touch-target-sm"
                disabled={cart.length === 0}
                onClick={handleCheckout}
              >
                <ShoppingCart className="w-4 h-4 md:w-4 md:h-4 mr-1.5 xs:mr-2" />
                <span className="hidden sm:inline">{t('payment.placeOrder')}</span>
                <span className="sm:hidden">{t('payment.checkout')}</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

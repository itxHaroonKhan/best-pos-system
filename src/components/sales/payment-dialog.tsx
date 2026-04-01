"use client"

import * as React from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  CheckCircle2, 
  Printer, 
  Mail, 
  MessageCircle, 
  Download,
  Copy,
  Share2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cart: CartItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  onComplete: () => void
}

export function PaymentDialog({ 
  open, 
  onOpenChange, 
  cart, 
  subtotal, 
  tax, 
  discount, 
  total,
  onComplete 
}: PaymentDialogProps) {
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = React.useState("cash")
  const [amountReceived, setAmountReceived] = React.useState("")
  const [showReceipt, setShowReceipt] = React.useState(false)
  const [invoiceNumber] = React.useState(`INV-${Date.now().toString().slice(-6)}`)

  const change = paymentMethod === "cash" 
    ? (parseFloat(amountReceived) - total) || 0 
    : 0

  const canComplete = paymentMethod !== "cash" || (amountReceived && parseFloat(amountReceived) >= total)

  const handleComplete = () => {
    if (!canComplete) return

    toast({
      title: "Payment Successful!",
      description: `Transaction completed for ₹${total.toFixed(2)}`,
    })
    setShowReceipt(true)
  }

  const handlePrint = () => {
    toast({
      title: "Printing...",
      description: "Sending receipt to thermal printer",
    })
  }

  const handleShare = (method: string) => {
    toast({
      title: "Sending Invoice",
      description: `Invoice will be sent via ${method}`,
    })
  }

  const handleNewSale = () => {
    setShowReceipt(false)
    setPaymentMethod("cash")
    setAmountReceived("")
    onComplete()
    onOpenChange(false)
  }

  if (showReceipt) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-6 h-6" />
              Payment Successful!
            </DialogTitle>
            <DialogDescription>
              Invoice {invoiceNumber} has been generated
            </DialogDescription>
          </DialogHeader>

          {/* Receipt Preview */}
          <div className="border rounded-lg p-4 bg-muted/30 font-mono text-sm">
            <div className="text-center mb-4">
              <h3 className="font-bold text-lg">Elites Store</h3>
              <p className="text-xs text-muted-foreground">123 Business Street, Mumbai</p>
              <p className="text-xs text-muted-foreground">GST: 27ABCDE1234F1Z5</p>
              <p className="text-xs text-muted-foreground">Phone: +91 98765 43210</p>
            </div>
            
            <Separator className="my-3" />
            
            <div className="flex justify-between text-xs mb-2">
              <span>Invoice:</span>
              <span>{invoiceNumber}</span>
            </div>
            <div className="flex justify-between text-xs mb-4">
              <span>Date:</span>
              <span>{new Date().toLocaleString()}</span>
            </div>

            <Separator className="my-3" />

            <div className="space-y-2 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-xs">
                  <span>{item.name} x{item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <Separator className="my-3" />

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>GST (18%):</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-xs text-red-500">
                  <span>Discount:</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-2 border-t">
                <span>TOTAL:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              {paymentMethod === "cash" && (
                <>
                  <div className="flex justify-between text-xs pt-2">
                    <span>Received:</span>
                    <span>₹{parseFloat(amountReceived).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-green-600">
                    <span>Change:</span>
                    <span>₹{change.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            <Separator className="my-3" />

            <div className="text-center text-xs text-muted-foreground">
              <p>Thank you for your purchase!</p>
              <p>Please visit again.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1">
                <Printer className="w-4 h-4" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleShare("WhatsApp")} className="gap-1">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleShare("Email")} className="gap-1">
                <Mail className="w-4 h-4" />
                Email
              </Button>
            </div>
            
            <Button 
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" 
              size="lg"
              onClick={handleNewSale}
            >
              Start New Sale
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Select payment method and complete the transaction
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order Summary */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">GST (18%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-red-500">
                <span>Discount</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total Amount</span>
              <span className="text-primary">₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">💵 Cash</SelectItem>
                <SelectItem value="card">💳 Card / Credit Card</SelectItem>
                <SelectItem value="upi">📱 UPI / QR Code</SelectItem>
                <SelectItem value="netbanking">🏦 Net Banking</SelectItem>
                <SelectItem value="wallet">👛 Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cash Payment Input */}
          {paymentMethod === "cash" && (
            <div className="space-y-2">
              <Label htmlFor="amount">Amount Received (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount received"
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
                className="text-lg"
                autoFocus
              />
              {amountReceived && parseFloat(amountReceived) >= total && (
                <div className="flex justify-between text-sm bg-green-50 p-2 rounded">
                  <span className="text-green-700">Change to return:</span>
                  <span className="font-bold text-green-700">₹{change.toFixed(2)}</span>
                </div>
              )}
              {amountReceived && parseFloat(amountReceived) < total && (
                <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                  Insufficient amount. Need ₹{(total - parseFloat(amountReceived)).toFixed(2)} more.
                </div>
              )}
              
              {/* Quick Cash Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[500, 1000, 2000, 5000].map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAmountReceived(amount.toString())}
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* UPI / Card Info */}
          {(paymentMethod === "upi" || paymentMethod === "card") && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              {paymentMethod === "upi" ? (
                <>
                  <p className="text-sm text-blue-700 mb-2">Scan QR code to pay</p>
                  <div className="w-32 h-32 bg-white mx-auto rounded-lg flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">QR Code Here</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">GPay / PhonePe / PayTM / BHIM</p>
                </>
              ) : (
                <div className="text-blue-700">
                  <p className="text-sm mb-2">Insert/Swipe card at the terminal</p>
                  <p className="text-xs">Wait for payment confirmation</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={handleComplete}
              disabled={!canComplete}
            >
              Confirm Payment - ₹{total.toFixed(2)}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

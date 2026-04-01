"use client"

import * as React from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  ShoppingCart, 
  IndianRupee,
  TrendingUp,
  Clock
} from "lucide-react"

interface Purchase {
  id: string
  date: string
  items: number
  total: number
  paymentMethod: string
  status: string
}

interface CustomerDetailDialogProps {
  customer: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const MOCK_PURCHASES: Purchase[] = [
  { id: "INV-001", date: "2024-03-15", items: 3, total: 4500, paymentMethod: "UPI", status: "Completed" },
  { id: "INV-002", date: "2024-03-10", items: 1, total: 1200, paymentMethod: "Cash", status: "Completed" },
  { id: "INV-003", date: "2024-03-05", items: 5, total: 8900, paymentMethod: "Card", status: "Completed" },
  { id: "INV-004", date: "2024-02-28", items: 2, total: 3200, paymentMethod: "UPI", status: "Completed" },
  { id: "INV-005", date: "2024-02-20", items: 4, total: 6700, paymentMethod: "Cash", status: "Completed" },
]

export function CustomerDetailDialog({ customer, open, onOpenChange }: CustomerDetailDialogProps) {
  if (!customer) return null

  const totalSpent = MOCK_PURCHASES.reduce((sum, p) => sum + p.total, 0)
  const avgOrderValue = totalSpent / MOCK_PURCHASES.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Customer Details</DialogTitle>
          <DialogDescription>Complete customer information and purchase history</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Customer Name</p>
              <p className="font-semibold text-lg">{customer.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Customer ID</p>
              <p className="font-mono text-sm">CUST-{customer.id?.padStart(4, '0')}</p>
            </div>
          </div>

          <Separator />

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="font-medium">{customer.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{customer.email}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-primary/5 rounded-lg p-3 text-center">
              <ShoppingCart className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-2xl font-bold">{MOCK_PURCHASES.length}</p>
              <p className="text-xs text-muted-foreground">Total Orders</p>
            </div>
            <div className="bg-accent/10 rounded-lg p-3 text-center">
              <IndianRupee className="w-5 h-5 mx-auto mb-1 text-accent-foreground" />
              <p className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Spent</p>
            </div>
            <div className="bg-chart-3/10 rounded-lg p-3 text-center">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-chart-3" />
              <p className="text-2xl font-bold">₹{avgOrderValue.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">Avg Order Value</p>
            </div>
          </div>

          <Separator />

          {/* Purchase History */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Purchase History
            </h3>
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {MOCK_PURCHASES.map((purchase) => (
                  <div key={purchase.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{purchase.id}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {purchase.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">₹{purchase.total.toLocaleString()}</p>
                      <div className="flex items-center gap-2 justify-end">
                        <Badge variant="secondary" className="text-[10px]">
                          {purchase.items} items
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {purchase.paymentMethod}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

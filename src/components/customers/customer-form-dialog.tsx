"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface CustomerFormData {
  name: string
  email: string
  phone: string
  address: string
  city: string
  pincode: string
  gstNumber: string
  notes: string
}

interface CustomerFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingCustomer?: any | null
}

export function CustomerFormDialog({ open, onOpenChange, editingCustomer }: CustomerFormDialogProps) {
  const { toast } = useToast()
  const [formData, setFormData] = React.useState<CustomerFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    gstNumber: "",
    notes: "",
  })

  React.useEffect(() => {
    if (editingCustomer) {
      setFormData({
        name: editingCustomer.name || "",
        email: editingCustomer.email || "",
        phone: editingCustomer.phone || "",
        address: editingCustomer.address || "",
        city: editingCustomer.city || "",
        pincode: editingCustomer.pincode || "",
        gstNumber: editingCustomer.gstNumber || "",
        notes: editingCustomer.notes || "",
      })
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
        gstNumber: "",
        notes: "",
      })
    }
  }, [editingCustomer, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.phone) {
      toast({
        title: "Validation Error",
        description: "Name and phone number are required.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: editingCustomer ? "Customer Updated" : "Customer Registered",
      description: `${formData.name} has been ${editingCustomer ? "updated" : "added"} successfully.`,
    })
    onOpenChange(false)
  }

  const handleChange = (field: keyof CustomerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingCustomer ? "Edit Customer" : "Register New Customer"}
          </DialogTitle>
          <DialogDescription>
            {editingCustomer ? "Update customer information" : "Add a new customer to your database"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter customer name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="customer@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Enter full address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  placeholder="Enter pincode"
                  value={formData.pincode}
                  onChange={(e) => handleChange("pincode", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gst">GST Number (Optional)</Label>
              <Input
                id="gst"
                placeholder="Enter GST number"
                value={formData.gstNumber}
                onChange={(e) => handleChange("gstNumber", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes about this customer"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              {editingCustomer ? "Update Customer" : "Register Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Store, Bell, CreditCard, Palette, Save } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { theme, toggleTheme, setTheme } = useTheme()
  const { toast } = useToast()

  const handleSaveChanges = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    })
  }

  const handleThemeChange = (value: string) => {
    setTheme(value as "light" | "dark")
    toast({
      title: "Theme changed",
      description: `Switched to ${value} mode.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your store settings and preferences</p>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Store className="w-5 h-5 text-primary mb-2" />
            <CardTitle>Store Information</CardTitle>
            <CardDescription>Update your store details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Store Name</label>
              <Input defaultValue="Elites" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Store Address</label>
              <Input defaultValue="123 Business Street, Mumbai, India" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Number</label>
              <Input defaultValue="+91 98765 43210" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input defaultValue="contact@elites.com" type="email" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Bell className="w-5 h-5 text-primary mb-2" />
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Low Stock Alerts</label>
                <p className="text-xs text-muted-foreground">Get notified when items run low</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Daily Sales Summary</label>
                <p className="text-xs text-muted-foreground">Receive daily sales reports via email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">New Customer Alerts</label>
                <p className="text-xs text-muted-foreground">Get notified when new customers register</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CreditCard className="w-5 h-5 text-primary mb-2" />
            <CardTitle>Payment Settings</CardTitle>
            <CardDescription>Configure payment options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Currency</label>
              <Select defaultValue="inr">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inr">INR (₹)</SelectItem>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tax Rate (GST)</label>
              <Select defaultValue="18">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5%</SelectItem>
                  <SelectItem value="12">12%</SelectItem>
                  <SelectItem value="18">18%</SelectItem>
                  <SelectItem value="28">28%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Palette className="w-5 h-5 text-primary mb-2" />
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Theme</label>
              <Select value={theme} onValueChange={handleThemeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Current theme: <span className="font-medium">{theme}</span>
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Items per page</label>
              <Select defaultValue="25">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2">
        <Button className="gap-2 w-full sm:w-auto" onClick={handleSaveChanges}>
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}

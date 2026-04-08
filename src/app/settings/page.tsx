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
import { useLanguage } from "@/contexts/language-context"

export default function SettingsPage() {
  const { theme, toggleTheme, setTheme } = useTheme()
  const { toast } = useToast()
  const { t, isRTL } = useLanguage()

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
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">{t('settings.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('settings.subtitle')}</p>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Store className="w-5 h-5 text-primary mb-2" />
            <CardTitle>{t('settings.storeInfo')}</CardTitle>
            <CardDescription>{t('settings.updateStoreDetails')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('settings.storeName')}</label>
              <Input defaultValue="Elites" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('settings.storeAddress')}</label>
              <Input defaultValue="123 Business Street, Mumbai, India" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('settings.contactNumber')}</label>
              <Input defaultValue="+91 98765 43210" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('settings.email')}</label>
              <Input defaultValue="contact@elites.com" type="email" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Bell className="w-5 h-5 text-primary mb-2" />
            <CardTitle>{t('settings.notifications')}</CardTitle>
            <CardDescription>{t('settings.configureNotifications')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">{t('settings.lowStockAlerts')}</label>
                <p className="text-xs text-muted-foreground">{t('settings.lowStockDesc')}</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">{t('settings.dailySalesSummary')}</label>
                <p className="text-xs text-muted-foreground">{t('settings.dailySalesDesc')}</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">{t('settings.newCustomerAlerts')}</label>
                <p className="text-xs text-muted-foreground">{t('settings.newCustomerDesc')}</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CreditCard className="w-5 h-5 text-primary mb-2" />
            <CardTitle>{t('settings.paymentSettings')}</CardTitle>
            <CardDescription>{t('settings.configurePayment')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('settings.defaultCurrency')}</label>
              <Select defaultValue="pkr">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pkr">PKR (Rs.)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('settings.taxRate')}</label>
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
            <CardTitle>{t('settings.appearance')}</CardTitle>
            <CardDescription>{t('settings.customizeLook')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('settings.theme')}</label>
              <Select value={theme} onValueChange={handleThemeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">{t('settings.light')}</SelectItem>
                  <SelectItem value="dark">{t('settings.dark')}</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {t('settings.currentTheme')}: <span className="font-medium">{theme}</span>
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('settings.itemsPerPage')}</label>
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
          {t('settings.saveChanges')}
        </Button>
      </div>
    </div>
  )
}

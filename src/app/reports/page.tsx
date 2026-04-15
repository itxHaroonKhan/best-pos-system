"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { DollarSign, TrendingUp, ShoppingCart, Users, Calendar, Download, FileBarChart, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import { Separator } from "@/components/ui/separator"
import ProtectedRoute from "@/components/protected-route"
import api from "@/lib/api"

export default function ReportsPage() {
  const router = useRouter()
  const [period, setPeriod] = React.useState("week")
  const { t, isRTL } = useLanguage()
  const [salesData, setSalesData] = React.useState<any[]>([])
  const [categoryData, setCategoryData] = React.useState<any[]>([])
  const [taxSummary, setTaxSummary] = React.useState<any>(null)
  const [profitLoss, setProfitLoss] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  // Check if user is admin
  React.useEffect(() => {
    const role = localStorage.getItem('userRole')
    if (role !== 'admin') {
      router.replace('/dashboard')
    }
  }, [router])

  React.useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true)
        // Use consolidated endpoint to avoid 429 errors
        const res = await api.get('/reports/all')
        const { salesPerformance, categoryDistribution, taxSummary: taxData, profitLoss: profitData } = res.data.data

        setSalesData(salesPerformance || [])
        setCategoryData(categoryDistribution || [])
        setTaxSummary(taxData || {})
        setProfitLoss(profitData || {})
      } catch (err) {
        console.error('Failed to fetch reports:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [])

  const totalSales = profitLoss?.total_revenue || salesData.reduce((sum: number, d: any) => sum + (parseFloat(d.revenue) || 0), 0)
  const maxSales = salesData.length > 0 ? Math.max(...salesData.map((d: any) => parseFloat(d.revenue) || 0)) : 1

  const totalOrders = salesData.reduce((sum: number, d: any) => sum + (parseInt(d.total_sales) || 0), 0)
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0
  const profitMargin = profitLoss?.profit_margin || 0

  if (loading) {
    return (
      <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading reports...</span>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">{t('reports.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('reports.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">{t('reports.today')}</SelectItem>
              <SelectItem value="week">{t('reports.thisWeek')}</SelectItem>
              <SelectItem value="month">{t('reports.thisMonth')}</SelectItem>
              <SelectItem value="year">{t('reports.thisYear')}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 flex-shrink-0">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{t('reports.export')}</span>
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('reports.totalRevenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {totalSales.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            <p className="flex items-center text-xs text-muted-foreground mt-1">Total revenue earned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('reports.totalOrders')}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="flex items-center text-xs text-muted-foreground mt-1">Total orders processed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('reports.profitMargin')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parseFloat(profitMargin).toFixed(1)}%</div>
            <p className="flex items-center text-xs text-muted-foreground mt-1">Profit margin</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('reports.avgOrderValue')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            <p className="flex items-center text-xs text-muted-foreground mt-1">Average order value</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Daily Breakdown Table */}
        <Card>
          <CardHeader><CardTitle>Daily Sales Breakdown</CardTitle></CardHeader>
          <CardContent>
            {salesData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No sales data available</p>
            ) : (
              <div className="rounded-md border">
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 font-medium text-sm">
                  <div>Day</div>
                  <div>Revenue</div>
                  <div>Orders</div>
                </div>
                <div className="divide-y">
                  {salesData.map((day: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-3 gap-4 p-4 items-center hover:bg-muted/30 transition-colors">
                      <div className="font-medium">{new Date(day.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                      <div className="font-semibold text-primary">Rs. {(parseFloat(day.revenue) || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                      <div className="text-muted-foreground">{parseInt(day.total_sales) || 0}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Sales Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {salesData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No sales data to display</p>
            ) : (
              <div className="h-64 flex items-end gap-2 pt-4">
                {salesData.map((day: any, index: number) => {
                  const revenue = parseFloat(day.revenue) || 0
                  const height = (revenue / maxSales) * 200
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="relative w-full flex justify-center">
                        <div
                          className="w-full max-w-[50px] bg-gradient-to-t from-primary/80 to-primary rounded-t-lg transition-all duration-300 group-hover:from-primary group-hover:to-secondary cursor-pointer relative"
                          style={{ height: `${height}px` }}
                        >
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg whitespace-nowrap z-10">
                            <p className="text-xs font-bold text-primary">Rs. {revenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">{new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Category Breakdown */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileBarChart className="w-5 h-5 text-primary" />
              Sales by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No category data available</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  {categoryData.map((cat: any, index: number) => {
                    const colors = ['bg-cyan-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-purple-500']
                    const color = colors[index % colors.length]
                    const value = cat.value ? (parseFloat(cat.value) / totalSales) * 100 : 0
                    return (
                      <div key={cat.name || index} className="group p-3 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                              <span className="text-white font-bold text-xs">{value.toFixed(0)}%</span>
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-foreground">{cat.name || 'Unknown'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary text-sm">Rs. {(parseFloat(cat.value) || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                          <div className={`h-full ${color} rounded-full transition-all duration-700 ease-out`} style={{ width: `${value}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="w-full bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-4 border border-primary/10 text-center">
                    <p className="text-xs text-muted-foreground mb-2">Total Revenue</p>
                    <p className="text-2xl font-bold text-primary">Rs. {totalSales.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                    {profitLoss && (
                      <>
                        <Separator className="my-3" />
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Total Cost</p>
                            <p className="text-lg font-bold text-foreground">Rs. {(parseFloat(profitLoss.total_cost) || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Profit</p>
                            <p className="text-lg font-bold text-green-600">Rs. {(parseFloat(profitLoss.gross_profit) || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tax Summary */}
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Tax Summary (GST)</CardTitle></CardHeader>
          <CardContent>
            {taxSummary ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Taxable Amount</span>
                    <span className="text-lg font-bold text-foreground">Rs. {(parseFloat(taxSummary.total_taxable_amount) || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">CGST</span>
                    <span className="text-lg font-bold text-foreground">Rs. {(parseFloat(taxSummary.cgst) || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">SGST</span>
                    <span className="text-lg font-bold text-foreground">Rs. {(parseFloat(taxSummary.sgst) || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
                <Separator />
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">Total Tax</span>
                    <span className="text-xl font-bold text-primary">Rs. {(parseFloat(taxSummary.total_tax) || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No tax data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </ProtectedRoute>
  )
}

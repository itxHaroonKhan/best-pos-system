"use client"

import * as React from "react"
import { DollarSign, TrendingUp, ShoppingCart, Users, Calendar, Download, FileBarChart } from "lucide-react"
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

const salesData = [
  { day: "Mon", sales: 4200, orders: 45, customers: 38 },
  { day: "Tue", sales: 5800, orders: 62, customers: 51 },
  { day: "Wed", sales: 4900, orders: 53, customers: 44 },
  { day: "Thu", sales: 7200, orders: 78, customers: 65 },
  { day: "Fri", sales: 8500, orders: 92, customers: 78 },
  { day: "Sat", sales: 9800, orders: 105, customers: 89 },
  { day: "Sun", sales: 6400, orders: 68, customers: 58 },
]

const categoryData = [
  { name: "Lunch", value: 35, color: "bg-cyan-500" },
  { name: "Salad", value: 25, color: "bg-green-500" },
  { name: "Pasta", value: 20, color: "bg-orange-500" },
  { name: "Dessert", value: 12, color: "bg-pink-500" },
  { name: "Chicken", value: 8, color: "bg-purple-500" },
]

const topProducts = [
  { name: "Grilled Salmon Steak", sold: 156, revenue: 2340 },
  { name: "Pasta with Roast Beef", sold: 142, revenue: 1420 },
  { name: "Apple Stuffed Pancake", sold: 98, revenue: 3430 },
  { name: "Beef Steak", sold: 87, revenue: 2610 },
  { name: "Shrimp Rice Bowl", sold: 165, revenue: 990 },
]

export default function ReportsPage() {
  const [period, setPeriod] = React.useState("week")
  const { t, isRTL } = useLanguage()

  const totalSales = salesData.reduce((sum, d) => sum + d.sales, 0)
  const totalOrders = salesData.reduce((sum, d) => sum + d.orders, 0)
  const totalCustomers = salesData.reduce((sum, d) => sum + d.customers, 0)
  const avgOrderValue = totalSales / totalOrders

  const maxSales = Math.max(...salesData.map(d => d.sales))

  return (
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
            <div className="text-2xl font-bold">Rs. {totalSales.toLocaleString()}</div>
            <p className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="mr-1 h-3 w-3" />
              +12.5% {t('reports.fromLastPeriod')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('reports.totalOrders')}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="mr-1 h-3 w-3" />
              +8.2% {t('reports.fromLastPeriod')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('reports.totalCustomers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="mr-1 h-3 w-3" />
              +5.1% {t('reports.fromLastPeriod')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('reports.avgOrderValue')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {avgOrderValue.toFixed(2)}</div>
            <p className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="mr-1 h-3 w-3" />
              +4.3% {t('reports.fromLastPeriod')}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Daily Breakdown Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-4 gap-4 p-4 bg-muted/50 font-medium text-sm">
                <div>Day</div>
                <div>Sales</div>
                <div>Orders</div>
                <div>Customers</div>
              </div>
              <div className="divide-y">
                {salesData.map((day) => (
                  <div key={day.day} className="grid grid-cols-4 gap-4 p-4 items-center hover:bg-muted/30 transition-colors">
                    <div className="font-medium">{day.day}</div>
                    <div className="font-semibold text-primary">Rs. {day.sales.toLocaleString()}</div>
                    <div><Badge variant="secondary">{day.orders}</Badge></div>
                    <div className="text-muted-foreground">{day.customers}</div>
                  </div>
                ))}
              </div>
            </div>
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
            <div className="h-64 flex items-end gap-2 pt-4">
              {salesData.map((day) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="relative w-full flex justify-center">
                    <div
                      className="w-full max-w-[50px] bg-gradient-to-t from-primary/80 to-primary rounded-t-lg transition-all duration-300 group-hover:from-primary group-hover:to-secondary cursor-pointer relative"
                      style={{ height: `${(day.sales / maxSales) * 200}px` }}
                    >
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg whitespace-nowrap z-10">
                        <p className="text-xs font-bold text-primary">Rs. {day.sales.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground">{day.orders} orders</p>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{day.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Category Breakdown - Enhanced */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileBarChart className="w-5 h-5 text-primary" />
              Sales by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Donut Chart Visualization */}
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="relative w-52 h-52">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {categoryData.reduce((acc, cat, index) => {
                      const offset = acc.offset
                      const circumference = 2 * Math.PI * 40
                      const strokeDasharray = (cat.value / 100) * circumference
                      const strokeDashoffset = -offset * circumference
                      acc.elements.push(
                        <circle
                          key={cat.name}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke={`var(--${cat.color.replace('bg-', '')})`}
                          strokeWidth="14"
                          strokeDasharray={`${strokeDasharray} ${circumference - strokeDasharray}`}
                          strokeDashoffset={strokeDashoffset}
                          className="transition-all duration-500 hover:opacity-80"
                          strokeLinecap="round"
                        />
                      )
                      acc.offset += cat.value / 100
                      return acc
                    }, { elements: [] as React.ReactElement[], offset: 0 }).elements}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center bg-card/80 backdrop-blur rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-inner">
                      <p className="text-xl font-bold text-primary">{categoryData.length}</p>
                      <p className="text-[10px] text-muted-foreground">Categories</p>
                    </div>
                  </div>
                </div>

                {/* Total Summary */}
                <div className="w-full bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-4 border border-primary/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Revenue</p>
                      <p className="text-lg font-bold text-primary">Rs. {categoryData.reduce((sum, _, i) => sum + [3500, 2500, 2000, 1200, 800][i], 0).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Transactions</p>
                      <p className="text-lg font-bold text-foreground">486</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Legend */}
              <div className="space-y-3">
                {categoryData.map((cat, index) => {
                  const revenue = [3500, 2500, 2000, 1200, 800][index]
                  const transactions = Math.round(cat.value * 4.86)
                  return (
                    <div key={cat.name} className="group p-3 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg ${cat.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                            <span className="text-white font-bold text-xs">{cat.value}%</span>
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-foreground">{cat.name}</p>
                            <p className="text-xs text-muted-foreground">{transactions} orders</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary text-sm">Rs. {revenue.toLocaleString()}</p>
                        </div>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${cat.color} rounded-full transition-all duration-700 ease-out`}
                          style={{ width: `${cat.value}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                      index === 1 ? 'bg-gray-500/20 text-gray-500' :
                      index === 2 ? 'bg-orange-500/20 text-orange-500' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sold} sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary text-sm">Rs. {product.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}

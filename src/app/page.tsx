"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  Activity,
  Calendar
} from "lucide-react"
import { AIInsights } from "@/components/dashboard/ai-insights"
import { DonutChart } from "@/components/DonutChart"
import { useLanguage } from "@/contexts/language-context"

export default function DashboardPage() {
  const { t, isRTL } = useLanguage()
  
  const stats = [
    {
      title: t('dashboard.totalRevenue'),
      value: "Rs. 45,231.89",
      change: "+20.1%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: t('dashboard.salesCount'),
      value: "124",
      change: "+12.5%",
      trend: "up",
      icon: ShoppingCart,
    },
    {
      title: t('dashboard.activeCustomers'),
      value: "1,234",
      change: "+3.2%",
      trend: "up",
      icon: Users,
    },
    {
      title: t('dashboard.lowStock'),
      value: "12",
      change: "-2",
      trend: "down",
      icon: Package,
    },
  ]

  const dailyRevenue = [
    { day: "Mon", revenue: 4200, orders: 45 },
    { day: "Tue", revenue: 5800, orders: 62 },
    { day: "Wed", revenue: 4900, orders: 53 },
    { day: "Thu", revenue: 7200, orders: 78 },
    { day: "Fri", revenue: 8500, orders: 92 },
    { day: "Sat", revenue: 9800, orders: 105 },
    { day: "Sun", revenue: 6400, orders: 68 },
  ]

  const maxRevenue = Math.max(...dailyRevenue.map(d => d.revenue))

  const chartdata = [
    { name: "Grilled Salmon Steak", amount: 375 },
    { name: "Tofu Poke Bowl", amount: 56 },
    { name: "Pasta with Roast Beef", amount: 0 },
    { name: "Beef Steak", amount: 450 },
    { name: "Shrimp Rice Bowl", amount: 210 },
    { name: "Apple Stuffed Pancake", amount: 175 },
    { name: "Chicken", amount: 264 },
    { name: "Vegetable Shrimp", amount: 280 },
  ]

  return (
    <div className="space-y-6 overflow-visible" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">{t('dashboard.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('dashboard.welcome')}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow overflow-visible">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="flex items-center text-xs mt-1">
                {stat.trend === "up" ? (
                  <span className="text-accent flex items-center font-semibold">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    {stat.change}
                  </span>
                ) : (
                  <span className="text-destructive flex items-center font-semibold">
                    <ArrowDownRight className="mr-1 h-3 w-3" />
                    {stat.change}
                  </span>
                )}
                <span className="text-muted-foreground ml-2">from last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="overflow-visible">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                {t('dashboard.realtimeSales')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mr-4">
                      <ShoppingCart className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Sale #NS-{(1024 + i).toString()}</p>
                      <p className="text-xs text-muted-foreground">Processed by Cashier Rahul • 5 mins ago</p>
                    </div>
                    <div className="ml-auto font-bold text-accent">
                      +Rs. {(1000 + i * 500).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="h-full overflow-visible">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                {t('dashboard.topCategories')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DonutChart
                className="mx-auto"
                data={chartdata}
                showLabel={true}
                valueFormatter={(number: number) =>
                  `Rs. ${Intl.NumberFormat("us").format(number).toString()}`
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Daily Revenue Trends */}
      <Card className="border-border bg-gradient-to-br from-card to-muted/30 overflow-visible">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              {t('dashboard.dailyRevenue')}
            </CardTitle>
            <Badge variant="secondary" className="text-xs">{t('dashboard.thisWeek')}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Chart Area */}
            <div className="relative h-64 pt-4 pb-8">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[4, 3, 2, 1, 0].map((i) => (
                  <div key={i} className="w-full border-border/30 border-dashed border-t" />
                ))}
              </div>

              <div className="relative h-full flex items-end gap-3">
                {dailyRevenue.map((day, index) => {
                  const height = (day.revenue / maxRevenue) * 160
                  const isBest = day.revenue === maxRevenue
                  const isFirst = index === 0
                  const isLast = index === dailyRevenue.length - 1

                  return (
                    <div key={day.day} className="flex-1 flex flex-col items-center gap-2 group relative">
                      {/* Bar Container */}
                      <div className="relative w-full flex justify-center">
                        <div
                          className={`w-full max-w-[50px] rounded-t-xl transition-all duration-500 cursor-pointer relative overflow-hidden ${
                            isBest
                              ? 'bg-gradient-to-t from-primary via-primary/90 to-accent shadow-lg shadow-primary/20'
                              : 'bg-gradient-to-t from-primary/60 to-primary/80 hover:from-primary hover:to-primary/90'
                          }`}
                          style={{
                            height: `${height}px`,
                            animationDelay: `${index * 100}ms`
                          }}
                        >
                          {/* Shine Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* Tooltip - Smart positioning based on position */}
                        <div className={`absolute z-[100] opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto ${
                          isFirst
                            ? 'left-1/2 translate-x-2 -top-20 md:-top-24'
                            : isLast
                            ? 'right-1/2 -translate-x-2 -top-20 md:-top-24'
                            : 'left-1/2 -translate-x-1/2 -top-20 md:-top-24'
                        }`}>
                          <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-2xl min-w-[100px] md:min-w-[120px] relative">
                            <p className="text-xs md:text-sm font-bold text-primary">Rs. {day.revenue.toLocaleString()}</p>
                            <p className="text-[9px] md:text-[10px] text-muted-foreground">{day.orders} orders</p>
                            {isBest && (
                              <Badge className="mt-1 text-[8px] md:text-[9px] py-0 px-1.5 bg-accent text-accent-foreground">Best Day</Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Day Label */}
                      <span className={`text-[10px] md:text-xs font-semibold transition-colors ${
                        isBest ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                      }`}>
                        {day.day}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 pt-5 border-t border-border bg-card/50 backdrop-blur rounded-xl p-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2 flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary/50"></span>
                  Avg Daily Revenue
                </p>
                <p className="text-xl font-bold text-primary">
                  Rs. {(dailyRevenue.reduce((a, b) => a + b.revenue, 0) / 7).toFixed(0)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2 flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-accent/50"></span>
                  Total Orders
                </p>
                <p className="text-xl font-bold text-foreground">
                  {dailyRevenue.reduce((a, b) => a + b.orders, 0)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2 flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500/50"></span>
                  Best Day
                </p>
                <p className="text-xl font-bold text-accent">
                  Rs. {Math.max(...dailyRevenue.map(d => d.revenue)).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <div className="overflow-visible">
        <AIInsights />
      </div>
    </div>
  )
}

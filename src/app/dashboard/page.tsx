"use client"

import * as React from "react"
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
  const [userRole, setUserRole] = React.useState<string | null>(null)

  React.useEffect(() => {
    const role = localStorage.getItem("userRole") || "admin"
    setUserRole(role)
  }, [])

  // Don't render until client-side hydration is complete
  if (userRole === null) {
    return null
  }

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
    <div className="space-y-4 sm:space-y-6 overflow-visible px-3 sm:px-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-primary">{t('dashboard.title')}</h1>
          {userRole === "admin" && (
            <p className="text-xs sm:text-sm text-muted-foreground">{t('dashboard.welcome')}</p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow overflow-visible">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
              <p className="flex items-center text-xs mt-1 flex-wrap">
                {stat.trend === "up" ? (
                  <span className="text-accent flex items-center font-semibold">
                    <ArrowUpRight className="mr-1 h-3 w-3 flex-shrink-0" />
                    {stat.change}
                  </span>
                ) : (
                  <span className="text-destructive flex items-center font-semibold">
                    <ArrowDownRight className="mr-1 h-3 w-3 flex-shrink-0" />
                    {stat.change}
                  </span>
                )}
                <span className="text-muted-foreground ml-1 sm:ml-2 hidden sm:inline">from last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Insights & Real-time Sales */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <div className="min-w-0">
          <AIInsights />
        </div>
        <Card className="overflow-visible min-w-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <span className="truncate">{t('dashboard.realtimeSales')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4 max-h-[400px] lg:max-h-none overflow-y-auto lg:overflow-y-visible">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-xs sm:text-sm font-medium leading-none truncate">Sale #NS-{(1024 + i).toString()}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Processed by Cashier Rahul • 5 mins ago</p>
                  </div>
                  <div className="text-xs sm:text-base font-bold text-accent flex-shrink-0">
                    +Rs. {(1000 + i * 500).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Revenue & Top Categories */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 min-w-0">
          <Card className="border-border bg-gradient-to-br from-card to-muted/30 overflow-visible">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2 min-w-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  <span className="truncate">{t('dashboard.dailyRevenue')}</span>
                </CardTitle>
                <Badge variant="secondary" className="text-xs flex-shrink-0">{t('dashboard.thisWeek')}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 sm:space-y-6">
                {/* Chart Area */}
                <div className="relative h-48 sm:h-56 lg:h-64 pt-2 sm:pt-4 pb-6 sm:pb-8">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[4, 3, 2, 1, 0].map((i) => (
                      <div key={i} className="w-full border-border/30 border-dashed border-t" />
                    ))}
                  </div>

                  <div className="relative h-full flex items-end gap-1 sm:gap-2 lg:gap-3">
                    {dailyRevenue.map((day, index) => {
                      const height = (day.revenue / maxRevenue) * 160
                      const isBest = day.revenue === maxRevenue

                      return (
                        <div key={day.day} className="flex-1 flex flex-col items-center gap-1 sm:gap-2 group relative">
                          {/* Bar Container */}
                          <div className="relative w-full flex justify-center">
                            <div
                              className={`w-full max-w-[20px] sm:max-w-[35px] lg:max-w-[50px] rounded-lg sm:rounded-xl transition-all duration-300 cursor-pointer relative ${
                                isBest
                                  ? 'bg-gradient-to-t from-primary via-primary/90 to-accent'
                                  : 'bg-gradient-to-t from-primary/60 to-primary/80'
                              } group-hover:shadow-[0_0_20px_-4px] group-hover:shadow-primary/50`}
                              style={{
                                height: `${height}px`,
                              }}
                            />

                            {/* Tooltip - positioned above each bar */}
                            <div className="absolute left-1/2 -translate-x-1/2 -top-12 sm:-top-16 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                              <div className="bg-card border border-border rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5 shadow-xl min-w-[60px] sm:min-w-[80px]">
                                <p className="text-[8px] sm:text-[10px] font-bold text-primary">Rs. {day.revenue.toLocaleString()}</p>
                                <p className="text-[7px] sm:text-[8px] text-muted-foreground">{day.orders}</p>
                                {isBest && (
                                  <Badge className="mt-0.5 text-[6px] sm:text-[7px] py-0 px-0.5 sm:px-1 bg-accent text-accent-foreground">Best</Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Day Label */}
                          <span className={`text-[8px] sm:text-[10px] lg:text-xs font-semibold transition-colors ${
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 pt-3 sm:pt-5 border-t border-border bg-card/50 backdrop-blur rounded-xl p-2 sm:p-4">
                  <div className="text-center">
                    <p className="text-[10px] sm:text-xs text-muted-foreground mb-1 sm:mb-2 flex items-center justify-center gap-1 flex-wrap">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary/50 flex-shrink-0"></span>
                      <span>Avg Daily</span>
                    </p>
                    <p className="text-base sm:text-xl font-bold text-primary">
                      Rs. {(dailyRevenue.reduce((a, b) => a + b.revenue, 0) / 7).toFixed(0)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] sm:text-xs text-muted-foreground mb-1 sm:mb-2 flex items-center justify-center gap-1 flex-wrap">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-accent/50 flex-shrink-0"></span>
                      <span>Total Orders</span>
                    </p>
                    <p className="text-base sm:text-xl font-bold text-foreground">
                      {dailyRevenue.reduce((a, b) => a + b.orders, 0)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] sm:text-xs text-muted-foreground mb-1 sm:mb-2 flex items-center justify-center gap-1 flex-wrap">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500/50 flex-shrink-0"></span>
                      <span>Best Day</span>
                    </p>
                    <p className="text-base sm:text-xl font-bold text-accent">
                      Rs. {Math.max(...dailyRevenue.map(d => d.revenue)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="min-w-0">
          <Card className="h-full overflow-visible">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <span className="truncate">{t('dashboard.topCategories')}</span>
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
    </div>
  )
}

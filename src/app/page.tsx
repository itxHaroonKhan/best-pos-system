"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Revenue",
      value: "₹45,231.89",
      change: "+20.1%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Sales Count",
      value: "124",
      change: "+12.5%",
      trend: "up",
      icon: ShoppingCart,
    },
    {
      title: "Active Customers",
      value: "1,234",
      change: "+3.2%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Low Stock Items",
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
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

      {/* Daily Revenue Trends */}
      <Card className="border-border bg-card/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Daily Revenue Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Chart Area */}
            <div className="h-48 flex items-end gap-2 pt-4">
              {dailyRevenue.map((day) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="relative w-full flex justify-center">
                    <div 
                      className="w-full max-w-[60px] bg-gradient-to-t from-primary/80 to-primary rounded-t-lg transition-all duration-300 group-hover:from-primary group-hover:to-accent cursor-pointer relative"
                      style={{ height: `${(day.revenue / maxRevenue) * 160}px` }}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg whitespace-nowrap z-10">
                        <p className="text-xs font-bold text-primary">₹{day.revenue.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground">{day.orders} orders</p>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{day.day}</span>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Avg Daily Revenue</p>
                <p className="text-lg font-bold text-primary">
                  ₹{(dailyRevenue.reduce((a, b) => a + b.revenue, 0) / 7).toFixed(0)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Total Orders</p>
                <p className="text-lg font-bold text-foreground">
                  {dailyRevenue.reduce((a, b) => a + b.orders, 0)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Best Day</p>
                <p className="text-lg font-bold text-accent">
                  Sat ₹{Math.max(...dailyRevenue.map(d => d.revenue)).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AIInsights />
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Real-time Sales Feed
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
                      +₹{(1000 + i * 500).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Top Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Electronics", val: 65, color: "bg-primary" },
                  { name: "Accessories", val: 45, color: "bg-accent" },
                  { name: "Stationary", val: 20, color: "bg-chart-3" },
                  { name: "Clothing", val: 15, color: "bg-chart-4" }
                ].map((cat) => (
                  <div key={cat.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{cat.name}</span>
                      <span className="text-muted-foreground">{cat.val}%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full ${cat.color}`} style={{ width: `${cat.val}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

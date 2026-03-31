import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  TrendingUp,
  Activity
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Admin. Here's what's happening today.</p>
      </div>

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
                      +₹{ (Math.random() * 5000 + 100).toFixed(2) }
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
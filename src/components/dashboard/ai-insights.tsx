"use client"

import * as React from "react"
import { Sparkles, TrendingUp, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { dailySalesInsightsSummary } from "@/ai/flows/daily-sales-insights-summary"

export function AIInsights() {
  const [insight, setInsight] = React.useState<string>("")
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchInsights = async () => {
      try {
        const result = await dailySalesInsightsSummary({
          date: new Date().toISOString().split("T")[0],
          totalSalesAmount: 45231.89,
          numberOfTransactions: 124,
          averageTransactionValue: 364.77,
          topSellingProducts: ["Grilled Salmon Steak", "Pasta with Roast Beef", "Shrimp Rice Bowl"],
          leastSellingProducts: ["Tofu Poke Bowl", "Apple Stuffed Pancake"],
          totalDiscountsApplied: 500,
          paymentMethodBreakdown: { "Cash": 15000, "Card": 25000, "UPI": 5231.89 },
          newCustomersCount: 12,
          repeatCustomersCount: 45,
        })
        setInsight(result.summary)
      } catch (error) {
        setInsight("AI insights temporarily unavailable. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()
  }, [])

  const staticInsights = [
    {
      title: "Inventory Alert",
      description: "3 products are running low on stock. Consider restocking Pasta with Roast Beef, Tofu Poke Bowl, and Apple Stuffed Pancake.",
      type: "warning",
    },
    {
      title: "Customer Growth",
      description: "12 new customers joined this week. Customer retention rate is at 78%.",
      type: "positive",
    },
  ]

  return (
    <Card className="border-border bg-card/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Quick Insights
        </CardTitle>
        <CardDescription>
          AI-powered insights and alerts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* AI Generated Insight */}
          {loading ? (
            <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/30">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Generating AI insights...</p>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-4 rounded-lg border border-primary/20 bg-primary/5">
              <Sparkles className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground mb-1">AI Sales Summary</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{insight}</p>
              </div>
              <Badge className="text-xs bg-primary">AI</Badge>
            </div>
          )}

          {/* Static Alerts */}
          {staticInsights.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              {item.type === "positive" ? (
                <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
              </div>
              <Badge variant={item.type === "positive" ? "default" : "secondary"} className="text-xs">
                {item.type === "positive" ? "Good" : "Alert"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

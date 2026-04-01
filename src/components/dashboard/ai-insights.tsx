"use client"

import * as React from "react"
import { Sparkles, TrendingUp, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function AIInsights() {
  // Static insights - AI disabled due to quota limits
  const insights = [
    {
      title: "Strong Sales Performance",
      description: "Revenue is up 20.1% compared to last week. Weekend sales showed exceptional growth.",
      type: "positive",
    },
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
          Key metrics and alerts for today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((item, index) => (
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

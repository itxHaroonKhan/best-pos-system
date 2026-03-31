"use client"

import * as React from "react"
import { Sparkles, TrendingUp, AlertCircle, RefreshCcw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { dailySalesInsightsSummary } from "@/ai/flows/daily-sales-insights-summary"

export function AIInsights() {
  const [loading, setLoading] = React.useState(false)
  const [insight, setInsight] = React.useState<string | null>(null)

  const generateInsight = async () => {
    setLoading(true)
    try {
      const data = {
        date: new Date().toISOString().split('T')[0],
        totalSalesAmount: 45230.50,
        numberOfTransactions: 124,
        averageTransactionValue: 364.76,
        topSellingProducts: ["Wireless Headphones", "Mechanical Keyboard", "USB-C Hub"],
        leastSellingProducts: ["Mousepad Pro", "Screen Cleaner"],
        totalDiscountsApplied: 2450.00,
        paymentMethodBreakdown: {
          "Card": 25000,
          "UPI": 15000,
          "Cash": 5230.50
        },
        newCustomersCount: 12,
        repeatCustomersCount: 45
      }
      const result = await dailySalesInsightsSummary(data)
      setInsight(result.summary)
    } catch (error) {
      console.error(error)
      setInsight("Unable to generate insights at this moment. Please check your data or try again later.")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    generateInsight()
  }, [])

  return (
    <Card className="border-accent/20 bg-accent/5 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-primary">
            <Sparkles className="w-5 h-5 text-accent" />
            AI Sales Analyst
          </CardTitle>
          <CardDescription>Intelligent performance summary for today</CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={generateInsight} 
          disabled={loading}
          className="hover:bg-accent/20"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        ) : insight ? (
          <div className="prose prose-sm text-muted-foreground leading-relaxed">
            {insight.split('\n').map((line, i) => (
              <p key={i} className={line.startsWith('-') ? 'ml-4' : ''}>
                {line}
              </p>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <AlertCircle className="w-10 h-10 mb-2 opacity-20" />
            <p>Ready to analyze your sales performance.</p>
            <Button variant="outline" size="sm" onClick={generateInsight} className="mt-4">
              Analyze Now
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
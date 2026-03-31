"use client"

import * as React from "react"
import { Calendar as CalendarIcon, Download, FileText, PieChart, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from "recharts"

const DATA_WEEKLY_SALES = [
  { day: 'Mon', sales: 45000 },
  { day: 'Tue', sales: 52000 },
  { day: 'Wed', sales: 38000 },
  { day: 'Thu', sales: 61000 },
  { day: 'Fri', sales: 75000 },
  { day: 'Sat', sales: 92000 },
  { day: 'Sun', sales: 85000 },
]

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Analytics & Reports</h1>
          <p className="text-muted-foreground">Comprehensive insights into your business performance.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <CalendarIcon className="w-4 h-4" />
            Last 7 Days
          </Button>
          <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Net Profit", value: "₹2.4L", trend: "+12%" },
          { label: "Gross Margin", value: "32.5%", trend: "+2%" },
          { label: "Avg. Ticket Size", value: "₹840", trend: "+5%" },
          { label: "Tax Liability", value: "₹45k", trend: "+8%" }
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl font-bold">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-accent font-semibold">{stat.trend} from last period</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Sales Performance
          </Trigger>
          <TabsTrigger value="categories" className="gap-2">
            <PieChart className="w-4 h-4" />
            Category Mix
          </Trigger>
          <TabsTrigger value="tax" className="gap-2">
            <FileText className="w-4 h-4" />
            Tax Summary
          </Trigger>
        </TabsList>
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Daily Revenue Trends</CardTitle>
              <CardDescription>Total sales volume across the current week</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DATA_WEEKLY_SALES}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                  <XAxis 
                    dataKey="day" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                  />
                  <Tooltip 
                    cursor={{fill: 'hsl(var(--secondary))'}}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderRadius: 'var(--radius)',
                      border: '1px solid hsl(var(--border))',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="categories">
           <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>Sales broken down by product category</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-muted-foreground text-center">
                <PieChart className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Visualizing category insights...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
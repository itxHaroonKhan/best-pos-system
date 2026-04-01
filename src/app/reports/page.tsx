"use client"

import * as React from "react"
import { Calendar as CalendarIcon, Download, FileText, PieChart, TrendingUp, IndianRupee } from "lucide-react"
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from "recharts"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const DATA_WEEKLY_SALES = [
  { day: 'Mon', sales: 45000 },
  { day: 'Tue', sales: 52000 },
  { day: 'Wed', sales: 38000 },
  { day: 'Thu', sales: 61000 },
  { day: 'Fri', sales: 75000 },
  { day: 'Sat', sales: 92000 },
  { day: 'Sun', sales: 85000 },
]

const DATA_CATEGORY_SALES = [
  { name: 'Electronics', value: 45, color: '#3b82f6' },
  { name: 'Accessories', value: 25, color: '#10b981' },
  { name: 'Clothing', value: 15, color: '#f59e0b' },
  { name: 'Stationery', value: 10, color: '#ef4444' },
  { name: 'Others', value: 5, color: '#8b5cf6' },
]

const DATA_TAX_SUMMARY = [
  { category: 'Electronics', taxableAmount: 450000, cgst: 40500, sgst: 40500, total: 81000 },
  { category: 'Accessories', taxableAmount: 180000, cgst: 16200, sgst: 16200, total: 32400 },
  { category: 'Clothing', taxableAmount: 120000, cgst: 6000, sgst: 6000, total: 12000 },
  { category: 'Stationery', taxableAmount: 75000, cgst: 9000, sgst: 9000, total: 18000 },
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
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2">
            <PieChart className="w-4 h-4" />
            Category Mix
          </TabsTrigger>
          <TabsTrigger value="tax" className="gap-2">
            <FileText className="w-4 h-4" />
            Tax Summary
          </TabsTrigger>
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
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={DATA_CATEGORY_SALES}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {DATA_CATEGORY_SALES.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderRadius: 'var(--radius)',
                      border: '1px solid hsl(var(--border))',
                    }}
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tax">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-primary" />
                Tax Summary (GST)
              </CardTitle>
              <CardDescription>Detailed tax breakdown by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4 mb-6">
                <Card className="bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs">Total Taxable Amount</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">₹8.25L</div>
                  </CardContent>
                </Card>
                <Card className="bg-accent/10">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs">Total CGST (9%)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-accent-foreground">₹74.25k</div>
                  </CardContent>
                </Card>
                <Card className="bg-accent/10">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs">Total SGST (9%)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-accent-foreground">₹74.25k</div>
                  </CardContent>
                </Card>
                <Card className="bg-primary/10">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs">Total GST Collected</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-primary">₹1.48L</div>
                  </CardContent>
                </Card>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Taxable Amount</TableHead>
                    <TableHead className="text-right">CGST (9%)</TableHead>
                    <TableHead className="text-right">SGST (9%)</TableHead>
                    <TableHead className="text-right">Total Tax</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DATA_TAX_SUMMARY.map((row) => (
                    <TableRow key={row.category}>
                      <TableCell className="font-medium">
                        <Badge variant="secondary">{row.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">₹{row.taxableAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-accent-foreground">₹{row.cgst.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-accent-foreground">₹{row.sgst.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-bold text-primary">₹{row.total.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
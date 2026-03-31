"use client"

import * as React from "react"
import { Search, UserPlus, Phone, Mail, History, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"

const MOCK_CUSTOMERS = [
  { id: "1", name: "Anish Kumar", email: "anish@example.com", phone: "+91 9876543210", spent: 12500, visits: 12, last: "2 days ago" },
  { id: "2", name: "Priya Sharma", email: "priya@example.com", phone: "+91 9123456789", spent: 4500, visits: 3, last: "1 week ago" },
  { id: "3", name: "Rahul Verma", email: "rahul@example.com", phone: "+91 8888888888", spent: 32000, visits: 45, last: "Yesterday" },
  { id: "4", name: "Sneha Reddy", email: "sneha@example.com", phone: "+91 7777777777", spent: 1200, visits: 1, last: "3 weeks ago" },
]

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Customer Relationship</h1>
          <p className="text-muted-foreground">Manage customer profiles and purchase histories.</p>
        </div>
        <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
          <UserPlus className="w-4 h-4" />
          Register Customer
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <UserPlus className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+24</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Life Time Value</CardTitle>
            <History className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹8,450</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <History className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">High loyalty segment</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name, phone or email..." className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Contact Details</TableHead>
                <TableHead>Total Visits</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Purchase</TableHead>
                <TableHead className="text-right">History</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_CUSTOMERS.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Phone className="w-3 h-3" /> {customer.phone}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Mail className="w-3 h-3" /> {customer.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.visits}</TableCell>
                  <TableCell className="font-bold text-primary">₹{customer.spent.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{customer.last}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="gap-1">
                      View <ExternalLink className="w-3 h-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
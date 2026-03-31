"use client"

import * as React from "react"
import { Plus, Search, Filter, AlertTriangle, MoreVertical, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const MOCK_INVENTORY = [
  { id: "1", sku: "WMS-001", name: "Wireless Mouse", category: "Electronics", price: 850, stock: 45, threshold: 10 },
  { id: "2", sku: "MKB-002", name: "Mechanical Keyboard", category: "Electronics", price: 4500, stock: 8, threshold: 10 },
  { id: "3", sku: "MON-003", name: "HD Monitor 24\"", category: "Electronics", price: 12000, stock: 5, threshold: 5 },
  { id: "4", sku: "USB-004", name: "USB-C Cable 2m", category: "Accessories", price: 450, stock: 150, threshold: 20 },
  { id: "5", sku: "HST-005", name: "Gaming Headset", category: "Electronics", price: 3200, stock: 15, threshold: 5 },
  { id: "6", sku: "LPS-006", name: "Laptop Stand", category: "Accessories", price: 1200, stock: 2, threshold: 5 },
]

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Inventory Management</h1>
          <p className="text-muted-foreground">Manage products, track stock, and configure alerts.</p>
        </div>
        <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="w-4 h-4" />
          Add New Product
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total SKUs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">+5 added this month</p>
          </CardContent>
        </Card>
        <Card className="bg-accent/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹12,45,200</div>
            <p className="text-xs text-muted-foreground">Current wholesale value</p>
          </CardContent>
        </Card>
        <Card className="bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">8</div>
            <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search inventory..." className="pl-9" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_INVENTORY.map((item) => {
                const isLow = item.stock <= item.threshold
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>₹{item.price}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{item.stock}</span>
                        {isLow && <AlertTriangle className="h-4 w-4 text-destructive" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      {isLow ? (
                        <Badge variant="destructive">Low Stock</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-accent/20 text-accent-foreground border-accent/20">In Stock</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Details</DropdownMenuItem>
                          <DropdownMenuItem>Update Stock</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete Product</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
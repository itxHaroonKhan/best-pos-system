"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { cn } from "@/lib/utils"

interface DonutChartData {
  name: string
  amount: number
  [key: string]: any
}

interface DonutChartProps {
  data: DonutChartData[]
  className?: string
  category?: string
  value?: string
  showLabel?: boolean
  valueFormatter?: (value: number) => string
}

const COLORS = [
  "#06D6A0",
  "#118AB2",
  "#FF6B6B",
  "#FFD166",
  "#EF476F",
  "#073B4C",
  "#8338EC",
  "#3A86FF",
]

export function DonutChart({ 
  data, 
  className, 
  category = "name",
  value = "amount",
  showLabel = true,
  valueFormatter 
}: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + (item[value] || item.amount), 0)

  const chartData = data.map((item) => ({
    name: item[category] || item.name,
    amount: item[value] || item.amount,
  }))

  const percentageData = chartData.map((item) => ({
    ...item,
    percentage: ((item.amount / total) * 100).toFixed(1),
  }))

  return (
    <div className={cn("space-y-4", className)}>
      {/* Donut Chart */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              strokeWidth={3}
              stroke="#ffffff"
              dataKey="amount"
              nameKey="name"
              paddingAngle={3}
              startAngle={90}
              endAngle={-270}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  className="transition-all duration-200 hover:opacity-80 cursor-pointer hover:scale-105"
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as { name: string; amount: number }
                  const percentage = ((data.amount / total) * 100).toFixed(1)
                  return (
                    <div className="bg-white dark:bg-card border border-border rounded-lg px-4 py-3 shadow-xl">
                      <p className="text-sm font-semibold mb-1">{data.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {valueFormatter ? valueFormatter(data.amount) : data.amount.toLocaleString()}
                      </p>
                      <p className="text-xs font-medium text-primary mt-1">{percentage}%</p>
                    </div>
                  )
                }
                return null
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Label */}
        {showLabel && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-3xl font-bold text-foreground">
              {valueFormatter ? valueFormatter(total) : total.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Total</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
        {percentageData.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2 group cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0 ring-2 ring-transparent group-hover:ring-primary/20 transition-all"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{item.name}</p>
              <p className="text-[10px] text-muted-foreground">
                {valueFormatter ? valueFormatter(item.amount) : item.amount.toLocaleString()} • {item.percentage}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

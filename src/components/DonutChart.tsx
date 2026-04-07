"use client"

import * as React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
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
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const chartRef = React.useRef<HTMLDivElement>(null)

  const chartData = data.map((item) => ({
    name: item[category] || item.name,
    amount: item[value] || item.amount,
  }))

  const percentageData = chartData.map((item) => ({
    ...item,
    percentage: ((item.amount / total) * 100).toFixed(1),
  }))

  const activeItem = activeIndex !== null ? chartData[activeIndex] : null
  const activePercentage = activeItem ? ((activeItem.amount / total) * 100).toFixed(1) : null

  // Calculate tooltip position based on segment angle
  const getTooltipPosition = () => {
    if (activeIndex === null) return { x: '50%', y: '100%' }
    
    // Each segment angle (in degrees)
    const segmentAngle = (360 / chartData.length) * activeIndex
    // Start from 90 degrees (top) and go clockwise
    const angle = (90 - segmentAngle) * (Math.PI / 180)
    
    // Calculate position on the outer edge of the donut
    const outerRadius = 110
    const padding = 40 // Additional padding outside the donut
    const containerSize = 280 // height of the container
    const centerX = containerSize / 2
    const centerY = containerSize / 2
    
    // Position outside the donut
    const x = centerX + (outerRadius + padding) * Math.cos(angle)
    const y = centerY - (outerRadius + padding) * Math.sin(angle)
    
    return { x: `${x}px`, y: `${y}px` }
  }

  const tooltipPos = getTooltipPosition()

  return (
    <div className={cn("space-y-4", className)}>
      {/* Donut Chart */}
      <div className="relative" ref={chartRef}>
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
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  className="transition-all duration-200 hover:opacity-80 cursor-pointer hover:scale-105"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Tooltip - Positioned Below Active Segment */}
        {activeItem && activePercentage && (
          <div 
            className="absolute bg-white dark:bg-card border border-border rounded-lg px-4 py-3 shadow-xl z-10 min-w-[140px] pointer-events-none transition-all duration-150 ease-out"
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <p className="text-sm font-semibold mb-1">{activeItem.name}</p>
            <p className="text-xs text-muted-foreground">
              {valueFormatter ? valueFormatter(activeItem.amount) : activeItem.amount.toLocaleString()}
            </p>
            <p className="text-xs font-medium text-primary mt-1">{activePercentage}%</p>
          </div>
        )}

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
    </div>
  )
}

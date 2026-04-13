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

    // Calculate cumulative angles
    const totalAngle = 360
    let startAngle = 0
    for (let i = 0; i < activeIndex; i++) {
      startAngle += (chartData[i].amount / total) * totalAngle
    }
    const segmentAngle = (chartData[activeIndex].amount / total) * totalAngle
    const midAngle = startAngle + segmentAngle / 2

    // Convert to radians (recharts starts at 90deg/top, goes clockwise)
    const angleRad = ((90 - midAngle) * Math.PI) / 180

    // Get actual container dimensions
    const container = chartRef.current
    const width = container?.offsetWidth || 280
    const height = container?.offsetHeight || 280
    const centerX = width / 2
    const centerY = height / 2

    // Position just outside the outer radius (proportional)
    const tooltipRadius = 130 * (width / 280)
    const x = centerX + tooltipRadius * Math.cos(angleRad)
    const y = centerY - tooltipRadius * Math.sin(angleRad)

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
              strokeWidth={0}
              stroke="transparent"
              dataKey="amount"
              nameKey="name"
              paddingAngle={0}
              startAngle={90}
              endAngle={-270}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  className="transition-opacity duration-200 hover:opacity-80 cursor-pointer"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Tooltip - Positioned Below Active Segment */}
        {activeItem && activePercentage && activeIndex !== null && (
          <div
            className="absolute rounded-md px-2 py-1.5 shadow-lg z-10 min-w-[90px] pointer-events-none transition-all duration-150 ease-out border border-white/20"
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y,
              transform: 'translate(-50%, -50%)',
              backgroundColor: COLORS[activeIndex % COLORS.length],
            }}
          >
            <p className="text-[10px] font-semibold mb-0.5 text-white">{activeItem.name}</p>
            <p className="text-[9px] text-white/80">
              {valueFormatter ? valueFormatter(activeItem.amount) : activeItem.amount.toLocaleString()}
            </p>
            <p className="text-[9px] font-medium text-white mt-0.5">{activePercentage}%</p>
          </div>
        )}

        {/* Center Label */}
        {showLabel && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {valueFormatter ? valueFormatter(total) : total.toLocaleString()}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 font-medium">Total</p>
          </div>
        )}
      </div>
    </div>
  )
}

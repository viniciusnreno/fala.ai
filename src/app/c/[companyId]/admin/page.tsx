"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import { companies } from "@/lib/companies"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { TrendingUp, TrendingDown, MessageSquare, ThumbsUp, Star, Users } from "lucide-react"

export const dynamic = "force-dynamic"

type Period = "7d" | "30d" | "90d"

// Função para gerar dados consistentes baseados na empresa e período
function generateChartData(companyId: string, period: Period) {
  const seed = companyId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  let random = seededRandom(seed)
  
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90
  const data = []
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    // Gera valores mais realistas para feedbacks
    const baseValue = period === "7d" ? 15 : period === "30d" ? 45 : 120
    const variation = random() * 0.6 + 0.7 // Entre 0.7 e 1.3
    const feedbacks = Math.round(baseValue * variation)
    
    data.push({
      date: date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: period === "90d" ? '2-digit' : 'short' 
      }),
      feedbacks
    })
  }
  
  return data
}

function seededRandom(seed: number) {
  let t = seed % 2147483647
  if (t <= 0) t += 2147483646
  return function () {
    t = (t * 16807) % 2147483647
    return (t - 1) / 2147483646
  }
}

// Gera métricas baseadas na empresa
function generateMetrics(companyId: string, period: Period) {
  const seed = companyId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  let random = seededRandom(seed + 1000) // Offset para diferentes valores
  
  const multiplier = period === "7d" ? 1 : period === "30d" ? 4 : 12
  
  return {
    totalFeedbacks: Math.round((80 + random() * 40) * multiplier), // 80-120 base
    satisfactionRate: Math.round(75 + random() * 20), // 75-95%
    averageRating: Number((4.0 + random() * 1.0).toFixed(1)), // 4.0-5.0
    responseTime: Math.round(2 + random() * 4), // 2-6 horas
    trends: {
      feedbacks: random() > 0.5 ? 'up' : 'down',
      satisfaction: random() > 0.3 ? 'up' : 'down',
      rating: random() > 0.4 ? 'up' : 'down',
      responseTime: random() > 0.6 ? 'up' : 'down'
    }
  }
}

const chartConfig = {
  feedbacks: {
    label: "Feedbacks",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface AdminPageProps {
  params: Promise<{ companyId: string }>
}

export default async function AdminPage({ params }: AdminPageProps) {
  const { companyId } = await params
  const company = companies[companyId]
  if (!company) return notFound()

  return <AdminDashboard companyId={companyId} companyName={company.name} />
}

function AdminDashboard({ companyId, companyName }: { companyId: string; companyName: string }) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("30d")
  
  const chartData = generateChartData(companyId, selectedPeriod)
  const metrics = generateMetrics(companyId, selectedPeriod)
  
  const periodLabels = {
    "7d": "Últimos 7 dias",
    "30d": "Últimos 30 dias", 
    "90d": "Últimos 90 dias"
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard {companyName}</h1>

          </div>
          <Badge variant="secondary" className="text-sm">
            ID: {companyId}
          </Badge>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2">
          {(["7d", "30d", "90d"] as Period[]).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {periodLabels[period]}
            </Button>
          ))}
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Feedbacks</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalFeedbacks.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {metrics.trends.feedbacks === 'up' ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                )}
                {metrics.trends.feedbacks === 'up' ? '+12%' : '-8%'} em relação ao período anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Satisfação</CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.satisfactionRate}%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {metrics.trends.satisfaction === 'up' ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                )}
                {metrics.trends.satisfaction === 'up' ? '+5%' : '-3%'} em relação ao período anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.averageRating}/5.0</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {metrics.trends.rating === 'up' ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                )}
                {metrics.trends.rating === 'up' ? '+0.2' : '-0.1'} em relação ao período anterior
              </div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo de Resposta</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.responseTime}min</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {metrics.trends.responseTime === 'up' ? (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                ) : (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                )}
                {metrics.trends.responseTime === 'up' ? '+30min' : '-45min'} em relação ao período anterior
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Volume de Feedbacks</CardTitle>
            <CardDescription>
              Mostrando o total de feedbacks recebidos - {periodLabels[selectedPeriod].toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `${value}`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="feedbacks"
                  type="natural"
                  fill="var(--color-feedbacks)"
                  fillOpacity={0.4}
                  stroke="var(--color-feedbacks)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Principais Tópicos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Atendimento</span>
                <Badge variant="secondary">32%</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm">Produto</span>
                <Badge variant="secondary">28%</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm">Entrega</span>
                <Badge variant="secondary">21%</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm">Preço</span>
                <Badge variant="secondary">19%</Badge>
              </div>
            </CardContent>
          </Card>

     
        </div>
      </div>
    </div>
  )
}
"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, TrendingUp, Activity, CheckCircle, Clock, AlertCircle } from "lucide-react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { collection, getDocs, Timestamp } from "firebase/firestore"
import { db } from "@/firebase/root"
import { UserService } from "@/lib/user-service"
import { useAuth } from "@/app/context/auth-context"

interface Order {
  id: string
  assignedTechnician: string
  status: string
  createdAt: Timestamp
  completedAt?: Timestamp
  service: string
  quotedPrice: number
}

interface WorkerStats {
  uid: string
  name: string
  completedJobs: number
  pendingJobs: number
  inProgressJobs: number
  totalRevenue: number
}

interface DashboardMetrics {
  totalJobs: number
  completedJobs: number
  pendingJobs: number
  inProgressJobs: number
  totalRevenue: number
  activeWorkers: number
  averageCompletionTime: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  // const [orders, setOrders] = useState<Order[]>([])
  const [workerStats, setWorkerStats] = useState<WorkerStats[]>([])
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalJobs: 0,
    completedJobs: 0,
    pendingJobs: 0,
    inProgressJobs: 0,
    totalRevenue: 0,
    activeWorkers: 0,
    averageCompletionTime: 0
  })
  const [loading, setLoading] = useState(true)

  const loadDashboardData = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)

      // Fetch all orders
      const ordersRef = collection(db, "orders")
      const ordersSnapshot = await getDocs(ordersRef)
      const ordersData = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[]

      // setOrders(ordersData)

      // Calculate metrics
      const totalJobs = ordersData.length
      const completedJobs = ordersData.filter(order => order.status === "COMPLETED").length
      const pendingJobs = ordersData.filter(order => order.status === "PENDING").length
      const inProgressJobs = ordersData.filter(order => order.status === "IN PROGRESS").length
      const totalRevenue = ordersData.reduce((sum, order) => sum + (order.quotedPrice || 0), 0)

      // Get unique workers and their stats
      const uniqueWorkerUids = [...new Set(ordersData.map(order => order.assignedTechnician))]
      const workerProfiles = await Promise.all(
        uniqueWorkerUids.map(uid =>
          UserService.getUserProfile(uid).then(profile => ({
            uid,
            name: profile?.displayName || `Worker ${uid.slice(-6)}`
          }))
        )
      )

      const workerStatsData: WorkerStats[] = workerProfiles.map(worker => {
        const workerOrders = ordersData.filter(order => order.assignedTechnician === worker.uid)
        return {
          uid: worker.uid,
          name: worker.name,
          completedJobs: workerOrders.filter(order => order.status === "COMPLETED").length,
          pendingJobs: workerOrders.filter(order => order.status === "PENDING").length,
          inProgressJobs: workerOrders.filter(order => order.status === "IN PROGRESS").length,
          totalRevenue: workerOrders.reduce((sum, order) => sum + (order.quotedPrice || 0), 0)
        }
      })

      setWorkerStats(workerStatsData)
      setMetrics({
        totalJobs,
        completedJobs,
        pendingJobs,
        inProgressJobs,
        totalRevenue,
        activeWorkers: uniqueWorkerUids.length,
        averageCompletionTime: 0 // TODO: Calculate based on completion times
      })

    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  // Chart configurations
  const workerPerformanceConfig = {
    completed: {
      label: "Completed Jobs",
      color: "hsl(142, 76%, 36%)",
    },
    pending: {
      label: "Pending Jobs",
      color: "hsl(48, 96%, 53%)",
    },
    inProgress: {
      label: "In Progress",
      color: "hsl(215, 92%, 60%)",
    },
  }

  const statusDistributionConfig = {
    completed: {
      label: "Completed",
      color: "hsl(142, 76%, 36%)",
    },
    pending: {
      label: "Pending",
      color: "hsl(48, 96%, 53%)",
    },
    inProgress: {
      label: "In Progress",
      color: "hsl(215, 92%, 60%)",
    },
  }

  const statusDistributionData = [
    { name: "completed", value: metrics.completedJobs, fill: "var(--color-completed)" },
    { name: "pending", value: metrics.pendingJobs, fill: "var(--color-pending)" },
    { name: "inProgress", value: metrics.inProgressJobs, fill: "var(--color-inProgress)" },
  ]

  const workerPerformanceData = workerStats.map(worker => ({
    name: worker.name,
    completed: worker.completedJobs,
    pending: worker.pendingJobs,
    inProgress: worker.inProgressJobs,
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of worker performance and job statistics
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              All time job count
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.completedJobs}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.totalJobs > 0 ? Math.round((metrics.completedJobs / metrics.totalJobs) * 100) : 0}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeWorkers}</div>
            <p className="text-xs text-muted-foreground">
              Workers with assigned jobs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RM {metrics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From all orders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Worker Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Worker Performance</CardTitle>
            <CardDescription>
              Jobs completed by each worker
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={workerPerformanceConfig}>
              <BarChart data={workerPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="completed" fill="var(--color-completed)" name="Completed" />
                <Bar dataKey="inProgress" fill="var(--color-inProgress)" name="In Progress" />
                <Bar dataKey="pending" fill="var(--color-pending)" name="Pending" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Job Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Job Status Distribution</CardTitle>
            <CardDescription>
              Overall status breakdown of all jobs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={statusDistributionConfig}>
              <PieChart>
                <Pie
                  data={statusDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${value} ${name}`}
                >
                  {statusDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Worker Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Worker Details</CardTitle>
          <CardDescription>
            Detailed performance metrics for each worker
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workerStats.map((worker) => (
              <div key={worker.uid} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-700">
                      {worker.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{worker.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {worker.completedJobs + worker.inProgressJobs + worker.pendingJobs} total jobs
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex space-x-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {worker.completedJobs} Completed
                      </Badge>
                      {worker.inProgressJobs > 0 && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          <Clock className="w-3 h-3 mr-1" />
                          {worker.inProgressJobs} In Progress
                        </Badge>
                      )}
                      {worker.pendingJobs > 0 && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {worker.pendingJobs} Pending
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      RM {worker.totalRevenue.toLocaleString()} revenue
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
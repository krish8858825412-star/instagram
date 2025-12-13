
"use client"

import { TrendingUp, Users, ShoppingCart } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, Legend } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useMemo } from "react"

interface User {
  id: string;
  date: string;
}

interface Order {
  id: string;
  date: string;
}

interface AdminChartProps {
  users: User[];
  orders: Order[];
}

export function AdminChart({ users, orders }: AdminChartProps) {
  const chartData = useMemo(() => {
    const dataByDate: { [key: string]: { date: string; users: number; orders: number } } = {};
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dataByDate[formattedDate] = { date: formattedDate, users: 0, orders: 0 };
    }

    users.forEach(user => {
      const userDate = new Date(user.date);
      if (userDate >= new Date(today.setDate(today.getDate() - 7))) {
        const formattedDate = userDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (dataByDate[formattedDate]) {
          dataByDate[formattedDate].users += 1;
        }
      }
    });

    orders.forEach(order => {
      const orderDate = new Date(order.date);
       if (orderDate >= new Date(today.setDate(today.getDate() - 7))) {
        const formattedDate = orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (dataByByDate[formattedDate]) {
          dataByDate[formattedDate].orders += 1;
        }
      }
    });
    
    // This is to reset the date after manipulation
    today.setDate(today.getDate() + 7);

    return Object.values(dataByDate);
  }, [users, orders]);

  const totalUsers = users.length;
  const totalOrders = orders.length;

  const chartConfig = {
    users: {
      label: "Users",
      color: "hsl(var(--chart-1))",
    },
    orders: {
      label: "Orders",
      color: "hsl(var(--chart-2))",
    },
  }

  return (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalUsers}</div>
                    <p className="text-xs text-muted-foreground">All registered users</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalOrders}</div>
                    <p className="text-xs text-muted-foreground">All time orders</p>
                </CardContent>
            </Card>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Activity - Last 7 Days</CardTitle>
                <CardDescription>New users and orders created in the last 7 days.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="users" fill="var(--color-users)" radius={4} />
                        <Bar dataKey="orders" fill="var(--color-orders)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                Trending up for new users and orders <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                Showing data for the last 7 days
                </div>
            </CardFooter>
        </Card>
    </div>
  )
}
    
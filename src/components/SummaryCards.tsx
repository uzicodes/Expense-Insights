import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Calendar, PieChart } from "lucide-react";
import type { Expense } from "./Dashboard";

type SummaryCardsProps = {
  expenses: Expense[];
};

export const SummaryCards = ({ expenses }: SummaryCardsProps) => {
  const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const averageSpending = expenses.length > 0 ? totalSpending / expenses.length : 0;
  const thisMonthExpenses = expenses.filter(
    (exp) =>
      new Date(exp.date).toISOString().slice(0, 7) ===
      new Date().toISOString().slice(0, 7)
  );
  const monthlyTotal = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const categoryCount = new Set(expenses.map((exp) => exp.category)).size;

  const cards = [
    {
      title: "Total Spending",
      value: `$${totalSpending.toFixed(2)}`,
      icon: DollarSign,
      description: "All time",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950",
    },
    {
      title: "This Month",
      value: `$${monthlyTotal.toFixed(2)}`,
      icon: Calendar,
      description: `${thisMonthExpenses.length} expenses`,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950",
    },
    {
      title: "Average Expense",
      value: `$${averageSpending.toFixed(2)}`,
      icon: TrendingUp,
      description: "Per transaction",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950",
    },
    {
      title: "Categories Used",
      value: categoryCount.toString(),
      icon: PieChart,
      description: "Active categories",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-scale-in">
      {cards.map((card, index) => (
        <Card 
          key={index} 
          className={`relative overflow-hidden bg-gradient-to-br ${card.bgGradient} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 group`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
          
          <CardHeader className="relative flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg bg-gradient-to-br ${card.gradient} shadow-lg`}>
              <card.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className={`text-3xl font-bold bg-gradient-to-br ${card.gradient} bg-clip-text text-transparent`}>
              {card.value}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

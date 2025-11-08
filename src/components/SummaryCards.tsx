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
    },
    {
      title: "This Month",
      value: `$${monthlyTotal.toFixed(2)}`,
      icon: Calendar,
      description: `${thisMonthExpenses.length} expenses`,
    },
    {
      title: "Average Expense",
      value: `$${averageSpending.toFixed(2)}`,
      icon: TrendingUp,
      description: "Per transaction",
    },
    {
      title: "Categories Used",
      value: categoryCount.toString(),
      icon: PieChart,
      description: "Active categories",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="shadow-card hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

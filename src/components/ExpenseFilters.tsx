import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Expense } from "./Dashboard";

type ExpenseFiltersProps = {
  categoryFilter: string;
  monthFilter: string;
  onCategoryChange: (category: string) => void;
  onMonthChange: (month: string) => void;
  expenses: Expense[];
};

export const ExpenseFilters = ({
  categoryFilter,
  monthFilter,
  onCategoryChange,
  onMonthChange,
  expenses,
}: ExpenseFiltersProps) => {
  const uniqueMonths = Array.from(
    new Set(expenses.map((exp) => new Date(exp.date).toISOString().slice(0, 7)))
  ).sort((a, b) => b.localeCompare(a));

  return (
    <Card className="shadow-card">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category-filter">Filter by Category</Label>
            <Select value={categoryFilter} onValueChange={onCategoryChange}>
              <SelectTrigger id="category-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Transport">Transport</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="month-filter">Filter by Month</Label>
            <Select value={monthFilter} onValueChange={onMonthChange}>
              <SelectTrigger id="month-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {uniqueMonths.map((month) => (
                  <SelectItem key={month} value={month}>
                    {new Date(month + "-01").toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

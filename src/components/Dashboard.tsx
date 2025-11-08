import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ExpenseForm } from "./ExpenseForm";
import { ExpenseList } from "./ExpenseList";
import { ExpenseChart } from "./ExpenseChart";
import { ExpenseFilters } from "./ExpenseFilters";
import { SummaryCards } from "./SummaryCards";
import { LogOut, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api, type Expense } from "@/lib/api";

export type { Expense };

export const Dashboard = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [expenses, categoryFilter, monthFilter]);

  const fetchExpenses = async () => {
    try {
      const data = await api.getExpenses();
      // Map _id to id for compatibility
      const mappedExpenses = data.map(exp => ({ ...exp, id: exp._id }));
      setExpenses(mappedExpenses);
    } catch (error: any) {
      toast({
        title: "Error fetching expenses",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterExpenses = () => {
    let filtered = [...expenses];

    if (categoryFilter !== "all") {
      filtered = filtered.filter((exp) => exp.category === categoryFilter);
    }

    if (monthFilter !== "all") {
      filtered = filtered.filter((exp) => {
        const expenseMonth = new Date(exp.date).toISOString().slice(0, 7);
        return expenseMonth === monthFilter;
      });
    }

    setFilteredExpenses(filtered);
  };

  const handleSignOut = async () => {
    // No auth needed for MongoDB backend - just redirect or clear state
    window.location.href = '/';
  };

  const handleAddExpense = () => {
    setEditingExpense(null);
    setIsFormOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await api.deleteExpense(id);
      
      toast({
        title: "Expense deleted",
        description: "The expense has been removed successfully.",
      });
      
      fetchExpenses();
    } catch (error: any) {
      toast({
        title: "Error deleting expense",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
    fetchExpenses();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Expense Insight</h1>
            <p className="text-sm text-muted-foreground">Track your spending patterns</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <Button onClick={handleAddExpense}>
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>

        <SummaryCards expenses={filteredExpenses} />

        <ExpenseFilters
          categoryFilter={categoryFilter}
          monthFilter={monthFilter}
          onCategoryChange={setCategoryFilter}
          onMonthChange={setMonthFilter}
          expenses={expenses}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExpenseChart expenses={filteredExpenses} />
          <ExpenseList
            expenses={filteredExpenses}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
            loading={loading}
          />
        </div>
      </main>

      <ExpenseForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        expense={editingExpense}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

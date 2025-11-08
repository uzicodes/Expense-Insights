import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ExpenseForm } from "./ExpenseForm";
import { ExpenseList } from "./ExpenseList";
import { ExpenseChart } from "./ExpenseChart";
import { ExpenseFilters } from "./ExpenseFilters";
import { SummaryCards } from "./SummaryCards";
import { BudgetTracker } from "./BudgetTracker";
import { Plus, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api, type Expense } from "@/lib/api";

export type { Expense };

type DashboardProps = {
  onLogout: () => void;
};

export const Dashboard = ({ onLogout }: DashboardProps) => {
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

  // Calculate current month's total spending
  const getCurrentMonthTotal = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return expenses
      .filter((exp) => new Date(exp.date).toISOString().slice(0, 7) === currentMonth)
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  // Get current month name
  const getCurrentMonthName = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handleSignOut = () => {
    api.logout();
    onLogout();
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <header className="relative border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="animate-slide-in-left">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Expense Insights
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Track your spending patterns with style</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="animate-slide-in-right hover:scale-105 transition-transform duration-200 hover:border-red-300 hover:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="relative container mx-auto px-4 py-8 space-y-6">
        <div className="flex justify-between items-center animate-fade-in">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <Button 
            onClick={handleAddExpense}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>

        <SummaryCards expenses={filteredExpenses} />

        <BudgetTracker 
          totalSpent={getCurrentMonthTotal()} 
          currentMonth={getCurrentMonthName()}
        />

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

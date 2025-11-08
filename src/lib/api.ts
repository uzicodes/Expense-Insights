// API client for MongoDB backend
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

export type Expense = {
  _id: string;
  title: string;
  category: "Food" | "Transport" | "Utilities" | "Other";
  amount: number;
  date: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateExpenseData = {
  title: string;
  category: "Food" | "Transport" | "Utilities" | "Other";
  amount: number;
  date: string;
};

export type UpdateExpenseData = Partial<CreateExpenseData>;

export type ExpenseFilters = {
  category?: string;
  month?: string; // YYYY-MM format
};

export const api = {
  async getExpenses(filters?: ExpenseFilters): Promise<Expense[]> {
    const params = new URLSearchParams();
    if (filters?.category && filters.category !== 'all') {
      params.append('category', filters.category);
    }
    if (filters?.month && filters.month !== 'all') {
      params.append('month', filters.month);
    }
    
    const url = `${API_BASE_URL}/api/expenses${params.toString() ? `?${params}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }
    return response.json();
  },

  async createExpense(data: CreateExpenseData): Promise<Expense> {
    const response = await fetch(`${API_BASE_URL}/api/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create expense');
    }
    return response.json();
  },

  async updateExpense(id: string, data: UpdateExpenseData): Promise<Expense> {
    const response = await fetch(`${API_BASE_URL}/api/expenses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update expense');
    }
    return response.json();
  },

  async deleteExpense(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/expenses/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete expense');
    }
  },
};

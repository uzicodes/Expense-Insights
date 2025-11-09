// API client for MongoDB backend
// In development, use Vite proxy (empty string = same origin)
// In production, use VITE_API_URL from env
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Debug: Log API URL in production
if (import.meta.env.PROD) {
  console.log('API Base URL:', API_BASE_URL || '(using relative URLs)');
  console.log('VITE_API_URL env:', import.meta.env.VITE_API_URL);
}

// Token management
const TOKEN_KEY = 'expense_tracker_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export type Expense = {
  _id: string;
  title: string;
  category: "Food" | "Transport" | "Utilities" | "Other";
  amount: number;
  date: string;
  createdAt?: string;
  updatedAt?: string;
};

export type User = {
  id: string;
  email: string;
  name?: string;
};

export type AuthResponse = {
  token: string;
  user: User;
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
  // Auth endpoints
  async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to register');
      } else {
        // Server returned HTML or other non-JSON response
        const text = await response.text();
        console.error('Server response:', text);
        throw new Error('Server error - please ensure the backend is running on port 4000');
      }
    }
    const data = await response.json();
    setToken(data.token);
    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to login');
      } else {
        const text = await response.text();
        console.error('Server response:', text);
        throw new Error('Server error - please ensure the backend is running on port 4000');
      }
    }
    const data = await response.json();
    setToken(data.token);
    return data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    if (!response.ok) {
      throw new Error('Failed to get user');
    }
    const data = await response.json();
    return data.user;
  },

  logout() {
    removeToken();
  },

  // Expense endpoints
  async getExpenses(filters?: ExpenseFilters): Promise<Expense[]> {
    const params = new URLSearchParams();
    if (filters?.category && filters.category !== 'all') {
      params.append('category', filters.category);
    }
    if (filters?.month && filters.month !== 'all') {
      params.append('month', filters.month);
    }
    
    const url = `${API_BASE_URL}/api/expenses${params.toString() ? `?${params}` : ''}`;
    const response = await fetch(url, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }
    return response.json();
  },

  async createExpense(data: CreateExpenseData): Promise<Expense> {
    const response = await fetch(`${API_BASE_URL}/api/expenses`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
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
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
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
      headers: {
        ...getAuthHeaders(),
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete expense');
    }
  },

  // Budget methods
  async getBudget(): Promise<{ monthlyBudget: number; currency: string }> {
    const response = await fetch(`${API_BASE_URL}/api/budget`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch budget');
    }
    return response.json();
  },

  async updateBudget(monthlyBudget: number, currency?: string): Promise<{ monthlyBudget: number; currency: string }> {
    const response = await fetch(`${API_BASE_URL}/api/budget`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ monthlyBudget, currency }),
    });
    if (!response.ok) {
      throw new Error('Failed to update budget');
    }
    return response.json();
  },
};

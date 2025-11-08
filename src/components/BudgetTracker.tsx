import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, DollarSign, Edit2, Check, X } from 'lucide-react';
import { api } from '@/lib/api';

interface BudgetTrackerProps {
  totalSpent: number;
  currentMonth: string;
}

export function BudgetTracker({ totalSpent, currentMonth }: BudgetTrackerProps) {
  const [budget, setBudget] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBudget();
  }, []);

  const loadBudget = async () => {
    try {
      setLoading(true);
      const data = await api.getBudget();
      setBudget(data.monthlyBudget);
      setInputValue(data.monthlyBudget.toString());
    } catch (error) {
      console.error('Failed to load budget:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const newBudget = parseFloat(inputValue);
    if (isNaN(newBudget) || newBudget < 0) {
      alert('Please enter a valid budget amount');
      return;
    }

    try {
      await api.updateBudget(newBudget);
      setBudget(newBudget);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save budget:', error);
      alert('Failed to save budget');
    }
  };

  const handleCancel = () => {
    setInputValue(budget.toString());
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  const percentage = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;
  const isOverBudget = totalSpent > budget && budget > 0;
  const isNearBudget = percentage >= 80 && percentage < 100;
  const remaining = budget - totalSpent;

  return (
    <Card className={isOverBudget ? 'border-red-500' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Monthly Budget
          </span>
          {!isEditing && (
            <Button variant="ghost" size="sm" onClick={handleEdit}>
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
        <CardDescription>Track your spending for {currentMonth}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="budget-input">Set Monthly Budget</Label>
              <Input
                id="budget-input"
                type="number"
                min="0"
                step="0.01"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter budget amount"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm" className="flex-1">
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm" className="flex-1">
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Budget</span>
                <span className="font-semibold">
                  ${budget > 0 ? budget.toFixed(2) : 'Not set'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Spent</span>
                <span className={`font-semibold ${isOverBudget ? 'text-red-600' : ''}`}>
                  ${totalSpent.toFixed(2)}
                </span>
              </div>
              {budget > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                    {isOverBudget ? '-' : ''}${Math.abs(remaining).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {budget > 0 && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{percentage.toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className={`h-3 ${
                      isOverBudget 
                        ? '[&>div]:bg-red-500' 
                        : isNearBudget 
                        ? '[&>div]:bg-yellow-500' 
                        : '[&>div]:bg-green-500'
                    }`}
                  />
                </div>

                {isOverBudget && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      You've exceeded your monthly budget by ${Math.abs(remaining).toFixed(2)}!
                    </AlertDescription>
                  </Alert>
                )}

                {isNearBudget && !isOverBudget && (
                  <Alert className="border-yellow-500 text-yellow-800 dark:text-yellow-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      You're approaching your budget limit. ${remaining.toFixed(2)} remaining.
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}

            {budget === 0 && (
              <div className="text-center text-sm text-muted-foreground py-4">
                Click the edit button to set your monthly budget
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

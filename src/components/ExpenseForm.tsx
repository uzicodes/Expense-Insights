import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { api, type Expense } from "@/lib/api";

const expenseSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  category: z.enum(["Food", "Transport", "Utilities", "Other"]),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  date: z.date(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

type ExpenseFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: Expense | null;
  onSuccess: () => void;
};

export const ExpenseForm = ({ open, onOpenChange, expense, onSuccess }: ExpenseFormProps) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: "",
      category: "Food",
      amount: "",
      date: new Date(),
    },
  });

  const selectedDate = watch("date");
  const selectedCategory = watch("category");

  useEffect(() => {
    if (expense) {
      setValue("title", expense.title);
      setValue("category", expense.category);
      setValue("amount", expense.amount.toString());
      setValue("date", new Date(expense.date));
    } else {
      reset({
        title: "",
        category: "Food",
        amount: "",
        date: new Date(),
      });
    }
  }, [expense, setValue, reset]);

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      const expenseData = {
        title: data.title,
        category: data.category,
        amount: parseFloat(data.amount),
        date: format(data.date, "yyyy-MM-dd"),
      };

      if (expense) {
        await api.updateExpense(expense._id, expenseData);
        toast({
          title: "Expense updated",
          description: "Your expense has been updated successfully.",
        });
      } else {
        await api.createExpense(expenseData);
        toast({
          title: "Expense added",
          description: "Your expense has been recorded successfully.",
        });
      }

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{expense ? "Edit Expense" : "Add New Expense"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} placeholder="Grocery shopping" />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={selectedCategory} onValueChange={(value) => setValue("category", value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Transport">Transport</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              {...register("amount")}
              type="number"
              step="0.01"
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setValue("date", date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {expense ? "Update" : "Add"} Expense
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

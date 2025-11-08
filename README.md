# 💰 Expense Insights

A modern full-stack expense tracking application with budget management, data visualization, and user authentication.

![Expense Insights](https://img.shields.io/badge/React-18.3.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)

## ✨ Features

- 🔐 **User Authentication** - Secure JWT-based authentication
- 💸 **Expense Management** - Add, edit, delete expenses with categories
- 📊 **Data Visualization** - Interactive charts showing spending by category
- 🎯 **Budget Tracking** - Set monthly budgets with visual progress indicators
- ⚠️ **Smart Alerts** - Warnings when approaching or exceeding budget
- 🔍 **Filtering** - Filter expenses by category and month
- 📱 **Responsive Design** - Beautiful UI with modern gradients and animations
- 🌓 **Dark Mode** - Full dark mode support

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful UI components
- **Recharts** - Data visualization
- **React Hook Form + Zod** - Form validation

### Backend
- **Node.js + Express** - REST API
- **MongoDB + Mongoose** - Database and ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/uzicodes/Expense-Insights.git
   cd Expense-Insights
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=4000
   JWT_SECRET=your_secret_key_here
   VITE_API_URL=http://localhost:4000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:4000`
   - Frontend dev server on `http://localhost:8080` (or next available port)

## 🌐 Deployment to Vercel

### Step 1: Prepare MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to **Network Access**
3. Add IP: `0.0.0.0/0` (allow all IPs for Vercel)

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 3: Deploy on Vercel

1. Go to [Vercel](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure **Environment Variables**:
   - `MONGODB_URI` = Your MongoDB connection string
   - `JWT_SECRET` = Your secret key (generate a strong random string)
   - `VITE_API_URL` = Leave empty or set to your Vercel URL

5. Click **Deploy**

### Step 4: Update MongoDB Connection

After first deployment, get your Vercel URL (e.g., `your-app.vercel.app`) and:
1. In MongoDB Atlas, update **Network Access** if needed
2. In Vercel, go to **Settings → Environment Variables**
3. Update `VITE_API_URL` if you want to use a separate backend

## 🛠️ Available Scripts

- `npm run dev` - Start both backend and frontend in development mode
- `npm run dev:client` - Start only frontend
- `npm run start:server` - Start only backend
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
expense-tracker/
├── server/                 # Backend API
│   ├── models/            # Mongoose models
│   │   ├── User.js
│   │   ├── Expense.js
│   │   └── Budget.js
│   ├── middleware/        # Auth middleware
│   │   └── auth.js
│   └── index.js           # Express server
├── src/                   # Frontend React app
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Dashboard.tsx
│   │   ├── Auth.tsx
│   │   ├── ExpenseForm.tsx
│   │   ├── ExpenseList.tsx
│   │   ├── ExpenseChart.tsx
│   │   ├── BudgetTracker.tsx
│   │   └── ...
│   ├── lib/              # Utilities
│   │   ├── api.ts        # API client
│   │   └── utils.ts
│   ├── pages/            # Page components
│   └── hooks/            # Custom hooks
├── .env                  # Environment variables (not in git)
├── vercel.json          # Vercel configuration
└── package.json         # Dependencies

```

## 🔒 Security Notes

- Never commit `.env` file (already in `.gitignore`)
- Use strong passwords and JWT secrets in production
- MongoDB connection string includes password - keep it secret
- Enable MongoDB Atlas IP whitelist for additional security

## 🎨 Features Showcase

### Budget Tracker
Set monthly spending limits and track progress with visual indicators:
- 🟢 Green: Under 80% of budget
- 🟡 Yellow: 80-99% of budget (warning)
- 🔴 Red: Over budget (alert)

### Expense Management
- Add expenses with title, category, amount, and date
- Edit existing expenses
- Delete expenses
- Filter by category (Food, Transport, Utilities, Other)
- Filter by month

### Data Visualization
- Pie chart showing spending distribution by category
- Summary cards with total spending, monthly spending, average, and categories used
- All data updates in real-time

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Utsho** - [uzicodes](https://github.com/uzicodes)

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)

---

Made with ❤️ and ☕

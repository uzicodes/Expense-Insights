## 🚀 Quick Fix for Vercel Deployment

Your "Failed to fetch" error is because the backend isn't deployed yet. Here's how to fix it:

### Step 1: Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add these variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `MONGODB_URI` | `mongodb+srv://utsho:uzi2%40mongodb@culinarycanvas.6slvk4v.mongodb.net/expense-tracker?retryWrites=true&w=majority` | Your MongoDB connection |
| `JWT_SECRET` | `a2d82ed10db5219bb3b1c145885e35ba` | Your JWT secret |
| `VITE_API_URL` | Leave empty | Will use same-origin API |

4. Click **Save** for each variable

### Step 2: Redeploy

1. Go to **Deployments** tab
2. Click the **•••** menu on the latest deployment
3. Click **Redeploy**

OR simply push a new commit:
```bash
git add .
git commit -m "Add Vercel configuration"
git push
```

### Step 3: Configure MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **Network Access** in the left sidebar
3. Click **Add IP Address**
4. Click **Allow Access from Anywhere** (0.0.0.0/0)
5. Click **Confirm**

This allows Vercel servers to connect to your MongoDB database.

### That's it! ✅

Your app should now work on Vercel with both frontend and backend deployed together.

The `vercel.json` file I created will automatically deploy your Express backend as Vercel serverless functions.

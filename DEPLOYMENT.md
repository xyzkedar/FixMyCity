# 🚀 Deployment Guide for FixMyCity

To deploy the **FixMyCity** platform, you need to host both the Frontend (Next.js) and the Backend (Eve API). 

---

## 1. Deploy the Backend (Eve API)
Since your backend uses Hono and Node.js, the easiest platform is **Railway** or **Render**.

### **Recommended: Railway.app**
1.  **Push your code** to a GitHub repository.
2.  Log in to [Railway.app](https://railway.app/).
3.  Click **"New Project"** -> **"Deploy from GitHub repo"**.
4.  Select the `eve` folder (or the whole repo if it's there).
5.  **Set Environment Variables** in the Railway dashboard:
    - `PORT`: 3001
    - `SUPABASE_URL`: (Your URL)
    - `SUPABASE_ANON_KEY`: (Your Key)
6.  Railway will give you a public URL like `https://eve-production.up.railway.app`. **Copy this.**

---

## 2. Deploy the Frontend (Next.js)
The best place for Next.js is **Vercel**.

### **Step-by-Step Vercel Deployment:**
1.  Log in to [Vercel.com](https://vercel.com/).
2.  Click **"Add New"** -> **"Project"**.
3.  Import your GitHub repository.
4.  **Edit Project Settings**:
    - **Root Directory**: Set this to `frontend/next`.
5.  **Set Environment Variables**:
    - `NEXT_PUBLIC_SUPABASE_URL`: (From your .env.local)
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (From your .env.local)
    - `NEXT_PUBLIC_API_URL`: **Paste the URL of your deployed Eve backend** (from Step 1).
    - `HUGGINGFACE_API_TOKEN`: (Your HF Token)
6.  Click **Deploy**.

---

## 3. Final Database Setup (Supabase)
Ensure your Supabase project is ready for production:
1.  **URL Whitelisting**: In the Supabase Dashboard, go to **Authentication -> URL Configuration**.
2.  Add your Vercel deployment URL (e.g., `https://fix-my-city.vercel.app`) to the **Redirect URLs** list. This allows users to log in correctly on the live site.

---

## ✅ Deployment Checklist
- [ ] Backend is live and returning a "Hello" or "Healthy" message.
- [ ] Frontend `NEXT_PUBLIC_API_URL` is updated to the *live* backend URL.
- [ ] All environment variables from `.env.local` are copied to Vercel/Railway.
- [ ] Supabase RLS policies (the SQL we ran earlier) are active.

Your city is now ready to be fixed by everyone! 🌍

# 🚀 SETUP CHECKLIST - Start Here!

Follow these steps IN ORDER to get your app running:

## ☐ Step 1: Install Dependencies
```bash
npm install
```
**Expected result:** Should complete without errors

---

## ☐ Step 2: Get Supabase Credentials

1. Go to https://supabase.com
2. Sign up / Log in
3. Click "New Project"
4. Fill in:
   - Name: `ucsc-bathroom-finder` (or anything)
   - Database Password: (generate or make one)
   - Region: Choose closest to you
5. Wait 1-2 minutes for project to be ready
6. Click "Project Settings" (gear icon) → API
7. Copy:
   - **Project URL** (looks like `https://abc123.supabase.co`)
   - **anon public** key (long string)

---

## ☐ Step 3: Get Google Maps API Key

1. Go to https://console.cloud.google.com
2. Create a new project (or select existing)
3. Go to "APIs & Services" → "Library"
4. Search for "Maps JavaScript API" → Enable it
5. Go to "APIs & Services" → "Credentials"
6. Click "Create Credentials" → "API Key"
7. Copy the API key
8. (Optional but recommended) Click "Restrict Key" → 
   - Set "Application restrictions" to "HTTP referrers"
   - Add `http://localhost:3000/*` for dev
   - Add your Vercel domain for production

---

## ☐ Step 4: Create .env.local File

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and fill in your values:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-long-anon-key-here
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key-here
   ```

---

## ☐ Step 5: Create Database Tables

1. Go back to Supabase → your project
2. Click "SQL Editor" in the left sidebar
3. Open the file `supabase-schema.sql` in this project
4. **Copy ALL the SQL code** (Cmd+A or Ctrl+A)
5. **Paste it** into the Supabase SQL Editor
6. Click "Run" button (or Cmd+Enter)
7. You should see "Success. No rows returned" ✓

To verify:
- Click "Table Editor" in Supabase
- You should see `bathrooms` and `reviews` tables

---

## ☐ Step 6: Run the Development Server

```bash
npm run dev
```

**Expected result:**
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

Open http://localhost:3000 in your browser!

---

## ✅ Testing Your App

### Test 1: Add a Bathroom
1. Click "Add Bathroom" button
2. Fill in name (e.g., "McHenry Library 1st Floor")
3. Fill in building (e.g., "McHenry Library")
4. Click anywhere on the map to place a pin
5. Check accessibility boxes
6. Click "Add Bathroom"
7. You should be redirected to home page
8. Your bathroom should appear on the map!

### Test 2: Add a Review
1. Click on your bathroom (on map or in list)
2. Click "Add Review"
3. Slide the ratings
4. Type a comment (optional)
5. Click "Submit Review"
6. You should see your review on the bathroom detail page!

### Test 3: Search & Filter
1. Go back to home page
2. Type in the search box
3. Toggle the accessibility filters
4. List should update in real-time

---

## 🐛 Common Issues

### "Module not found" error
```bash
rm -rf node_modules package-lock.json
npm install
```

### Map shows blank/error
- Double-check your Google Maps API key in `.env.local`
- Make sure "Maps JavaScript API" is enabled in Google Cloud Console
- Restart your dev server after changing `.env.local`

### Can't add bathroom/review
- Double-check Supabase URL and key in `.env.local`
- Make sure you ran the SQL schema in Supabase
- Check browser console (F12) for errors
- Restart your dev server

### "Invalid API key" for Maps
- Your API key might be restricted
- Go to Google Cloud Console → Credentials
- Click your API key → Edit
- Check "Application restrictions" settings

---

## 🚀 Deploy to Vercel (After Testing)

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. Go to https://vercel.com
3. Click "Import Project"
4. Select your GitHub repo
5. Add environment variables (same 3 from .env.local)
6. Click "Deploy"
7. Done! Your app is live 🎉

---

## 📝 Next Steps

Once everything works:
- Add more bathrooms around UCSC
- Share with friends to test
- Prepare your Devpost submission
- Add screenshots to your README

**Need help?** Check the main README.md for troubleshooting!

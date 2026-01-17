# UCSC Restroom Radar

**A web app for UCSC students to find, rate, and add bathrooms—with a focus on cleanliness, privacy, and accessibility—all anonymously.**

## 🚀 Quick Start (3 Steps)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Copy `.env.local.example` to `.env.local` and fill in:
```bash
cp .env.local.example .env.local
```

You need:
- **Supabase URL & Key**: Create a free project at [supabase.com](https://supabase.com)
- **Google Maps API Key**: Get one at [Google Cloud Console](https://console.cloud.google.com)

### 3. Set Up Database
1. Go to your Supabase project → SQL Editor
2. Copy and paste everything from `supabase-schema.sql`
3. Click "Run" to create tables

### 4. Run the App
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📂 Project Structure

```
Brathroom_app/
├── app/                          # Next.js App Router pages
│   ├── layout.js                 # Root layout (wraps all pages)
│   ├── globals.css               # Global styles with Tailwind
│   ├── page.js                   # Home page (map + bathroom list)
│   ├── add/page.js               # Add new bathroom
│   └── bathroom/[id]/
│       ├── page.js               # Bathroom detail page
│       └── review/page.js        # Add review form
├── components/
│   └── Map.js                    # Google Maps component
├── lib/
│   ├── supabase.js               # Supabase client setup
│   └── utils.js                  # Helper functions (device ID, distance calc)
├── supabase-schema.sql           # Database schema (run in Supabase)
├── .env.local.example            # Environment variables template
└── README.md
```

---

## 🗺️ Tech Stack

| Purpose | Technology |
|---------|-----------|
| Frontend Framework | **Next.js 16** (React with App Router) |
| Styling | **Tailwind CSS** |
| Database | **Supabase** (PostgreSQL) |
| Maps | **Google Maps JavaScript API** |
| Deployment | **Vercel** (recommended) |

---

## 📄 Pages & User Flows

### 1. Home Page (`/`)
- **Map** with bathroom pins
- **List** of bathrooms (sorted by distance if location enabled)
- **Search** by name/building
- **Filters** (wheelchair accessible, single stall, gender neutral)
- Click bathroom → go to detail page
- Click pin on map → go to detail page

### 2. Bathroom Detail (`/bathroom/[id]`)
- Name, building, features (tags)
- Average ratings (cleanliness, accessibility, privacy)
- All reviews with comments
- "Add Review" button

### 3. Add Review (`/bathroom/[id]/review`)
- 3 sliders (1-5) for cleanliness, accessibility, privacy
- Optional comment
- Anonymous (uses device hash)

### 4. Add Bathroom (`/add`)
- Name and building fields
- Click map to place pin (or uses your location)
- Accessibility checkboxes
- Submit → appears on map immediately

---

## 🗄️ Database Tables

### `bathrooms`
```sql
id                    UUID (primary key)
name                  TEXT
building              TEXT
lat                   FLOAT8
lng                   FLOAT8
wheelchair_accessible BOOLEAN
single_stall          BOOLEAN
gender_neutral        BOOLEAN
grab_bars             BOOLEAN
automatic_door        BOOLEAN
created_at            TIMESTAMP
```

### `reviews`
```sql
id            UUID (primary key)
bathroom_id   UUID (foreign key → bathrooms)
cleanliness   INTEGER (1-5)
accessibility INTEGER (1-5)
privacy       INTEGER (1-5)
comment       TEXT (optional)
device_hash   TEXT (for spam control)
created_at    TIMESTAMP
```

---

## 🔑 Key Features

✅ **Anonymous usage** - No login required  
✅ **Browse bathrooms** - Map + list view  
✅ **Filter & search** - By accessibility, building, etc.  
✅ **Distance sorting** - "Near me" using geolocation  
✅ **Rate bathrooms** - 3 categories (cleanliness, accessibility, privacy)  
✅ **Add bathrooms** - Click map to place pin  
✅ **Anti-spam** - Device-based hashing (can't spam reviews)  

---

## 🚢 Deployment

### Deploy to Vercel (Easiest)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
4. Deploy! ✨

Your Supabase database stays hosted on Supabase automatically.

---

## 🛠️ How It Works

### Anonymous Anti-Spam
- On first visit, app generates a random `deviceId` (UUID)
- Stored in `localStorage` (stays on your browser)
- Before submitting review, deviceId is hashed using SHA-256
- Only the hash is stored in the database (privacy-friendly)
- Prevents multiple reviews from same device

### Distance Calculation
- Uses browser's `navigator.geolocation.getCurrentPosition()`
- Calculates distance with Haversine formula (client-side)
- No server-side geo queries needed for MVP

### Google Maps Integration
- `@googlemaps/react-wrapper` handles API loading
- Click map → place marker → get lat/lng
- Bathroom pins are clickable → navigate to detail page

---

## 📝 Environment Variables

Create `.env.local` in the root:

```bash
# Supabase (get from supabase.com → Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Google Maps (get from console.cloud.google.com)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-maps-api-key-here
```

---

## 🐛 Troubleshooting

### Map not showing?
- Check your Google Maps API key is correct
- Make sure you enabled "Maps JavaScript API" in Google Cloud Console
- Check browser console for errors

### Can't add bathroom/review?
- Check Supabase URL and anon key are correct
- Make sure you ran `supabase-schema.sql` in Supabase SQL Editor
- Check browser console for errors

### "Module not found" errors?
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📦 What's Included

- ✅ All core pages (home, detail, review, add)
- ✅ Google Maps with clickable pins
- ✅ Supabase integration (database + queries)
- ✅ Anonymous reviews with spam protection
- ✅ Distance sorting
- ✅ Accessibility filters
- ✅ Mobile-responsive design
- ✅ Ready for Vercel deployment

---

## 🎯 MVP Scope

**Included:**
- Browse bathrooms (map + list)
- View details and ratings
- Add reviews anonymously
- Add new bathrooms
- Filter by accessibility

**Not included (can add later):**
- User accounts/login
- Photo uploads
- Hours of operation
- Reporting system
- Server-side geo queries

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Built with ❤️ for UCSC students**
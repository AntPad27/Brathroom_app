# 📖 CODE REFERENCE - Understanding the Codebase

Quick guide to where everything is and what it does.

---

## 🗂️ File Structure

```
Brathroom_app/
│
├── 📄 Configuration Files
│   ├── package.json           # Dependencies and scripts
│   ├── next.config.js         # Next.js config
│   ├── tailwind.config.js     # Tailwind CSS config
│   ├── postcss.config.js      # PostCSS (needed for Tailwind)
│   ├── .env.local.example     # Template for environment variables
│   └── .gitignore             # Files to ignore in git
│
├── 📚 Documentation
│   ├── README.md              # Main documentation (you are here)
│   ├── SETUP.md               # Step-by-step setup guide
│   ├── CODE-REFERENCE.md      # This file
│   └── supabase-schema.sql    # Database schema (run in Supabase)
│
├── 🎨 Frontend (app/)
│   ├── layout.js              # Root layout for all pages
│   ├── globals.css            # Global CSS (Tailwind imports)
│   ├── page.js                # Home page (/)
│   ├── add/page.js            # Add bathroom page (/add)
│   └── bathroom/[id]/
│       ├── page.js            # Bathroom detail (/bathroom/123)
│       └── review/page.js     # Add review (/bathroom/123/review)
│
├── 🧩 Components (components/)
│   └── Map.js                 # Google Maps component
│
└── 🛠️ Utilities (lib/)
    ├── supabase.js            # Supabase client
    └── utils.js               # Helper functions
```

---

## 📄 Key Files Explained

### `app/page.js` - Home Page
**What it does:**
- Shows map with bathroom pins
- Lists all bathrooms
- Search and filter functionality
- Sorts by distance if location enabled

**Key parts:**
```javascript
fetchBathrooms()           // Gets all bathrooms from Supabase
filteredBathrooms          // Filters by search + accessibility
calculateDistance()        // Sorts by distance from user
```

---

### `app/bathroom/[id]/page.js` - Bathroom Detail
**What it does:**
- Shows bathroom info and features
- Displays average ratings
- Lists all reviews

**Key parts:**
```javascript
fetchBathroom()            // Gets single bathroom by ID
fetchReviews()             // Gets all reviews for bathroom
averages                   // Calculates avg ratings client-side
```

---

### `app/bathroom/[id]/review/page.js` - Add Review
**What it does:**
- Form with 3 sliders (cleanliness, accessibility, privacy)
- Optional comment
- Submits anonymous review

**Key parts:**
```javascript
getDeviceId()              // Gets/creates device ID from localStorage
hashDeviceId()             // Hashes device ID for privacy
supabase.insert()          // Saves review to database
```

---

### `app/add/page.js` - Add Bathroom
**What it does:**
- Form to add new bathroom
- Click map to place pin
- Accessibility checkboxes

**Key parts:**
```javascript
AddBathroomMap             // Map component with click handler
handleLocationSelect()     // Captures lat/lng from map click
supabase.insert()          // Saves bathroom to database
```

---

### `components/Map.js` - Google Maps Component
**What it does:**
- Shows Google Map
- Places markers for bathrooms
- Shows user location (blue dot)
- Markers are clickable

**Key parts:**
```javascript
Wrapper                    // Loads Google Maps API
new google.maps.Map()      // Creates map
new google.maps.Marker()   // Creates markers
marker.addListener()       // Makes markers clickable
```

---

### `lib/supabase.js` - Database Client
**What it does:**
- Creates Supabase client
- Used throughout app for database queries

**Usage:**
```javascript
import { supabase } from '@/lib/supabase'

// SELECT query
const { data } = await supabase
  .from('bathrooms')
  .select('*')

// INSERT query
const { error } = await supabase
  .from('reviews')
  .insert({ ...data })
```

---

### `lib/utils.js` - Helper Functions
**What it does:**
- Device ID management (anonymous identity)
- Distance calculation (Haversine formula)

**Functions:**
- `getDeviceId()` - Get/create device UUID
- `hashDeviceId()` - SHA-256 hash for privacy
- `calculateDistance()` - Calculate km between two points

---

## 🔄 Data Flow

### Adding a Bathroom
```
User clicks map
  ↓
lat/lng captured
  ↓
User fills form
  ↓
Submit → supabase.insert('bathrooms')
  ↓
Redirect to home
  ↓
New bathroom appears on map
```

### Adding a Review
```
User slides ratings
  ↓
User types comment (optional)
  ↓
getDeviceId() from localStorage
  ↓
hashDeviceId() for privacy
  ↓
Submit → supabase.insert('reviews')
  ↓
Redirect to bathroom detail
  ↓
Review appears in list
```

### Viewing Bathrooms
```
Page loads
  ↓
fetchBathrooms() → supabase.select()
  ↓
Get user location (if allowed)
  ↓
Filter by search + accessibility
  ↓
Sort by distance
  ↓
Display on map + list
```

---

## 🎨 Styling with Tailwind

All styling uses Tailwind CSS utility classes:

```javascript
// Example classes used:
className="bg-blue-600"           // Blue background
className="text-white"            // White text
className="p-4"                   // Padding
className="rounded-lg"            // Rounded corners
className="shadow"                // Drop shadow
className="hover:bg-blue-700"     // Hover effect
className="flex gap-2"            // Flexbox with gap
```

**Main colors:**
- Blue (`bg-blue-600`) - Primary actions, header
- Green (`bg-green-600`) - Add bathroom
- Gray (`bg-gray-50`) - Background

---

## 🔐 Anonymous System

**How it works:**
1. First visit → generate UUID → save to localStorage
2. On review submit → hash UUID with SHA-256
3. Store only hash in database (never raw UUID)
4. Same device = same hash = can't spam

**Why this works:**
- ✅ Anonymous (no accounts)
- ✅ Privacy-friendly (hash only)
- ✅ Anti-spam (one device = one hash)
- ✅ Client-side (no server code needed)

---

## 🗺️ Google Maps Integration

**How it works:**
1. `@googlemaps/react-wrapper` loads Google Maps API
2. Create map with `new google.maps.Map()`
3. Add markers with `new google.maps.Marker()`
4. Listen for clicks with `map.addListener('click')`

**In this app:**
- Home page: Shows all bathroom pins (read-only)
- Add page: Click to place new pin (interactive)

---

## 📊 Database Queries

All queries use Supabase client (PostgreSQL):

```javascript
// Get all bathrooms
await supabase.from('bathrooms').select('*')

// Get single bathroom
await supabase.from('bathrooms').select('*').eq('id', id).single()

// Get reviews for bathroom
await supabase.from('reviews').select('*').eq('bathroom_id', id)

// Insert bathroom
await supabase.from('bathrooms').insert({ name, lat, lng, ... })

// Insert review
await supabase.from('reviews').insert({ bathroom_id, cleanliness, ... })
```

---

## 🚀 Performance Notes

**What's fast:**
- ✅ Static map rendering
- ✅ Client-side filtering
- ✅ Distance calculation (simple math)

**What could be optimized later:**
- ⏰ Compute averages in DB instead of client
- ⏰ Use Supabase PostGIS for geo queries
- ⏰ Add pagination for large datasets
- ⏰ Cache bathroom data

**For MVP:** Current approach is simple and works great!

---

## 🧪 Testing Locally

### Test Database Queries
Open browser console (F12) while on any page:

```javascript
// Test Supabase connection
const { data } = await supabase.from('bathrooms').select('*')
console.log(data)
```

### Test Device ID
```javascript
localStorage.getItem('deviceId')  // Should show UUID
```

### Test Location
```javascript
navigator.geolocation.getCurrentPosition(
  pos => console.log(pos.coords)
)
```

---

## 📝 Common Tasks

### Change default map center
Edit `components/Map.js`:
```javascript
center: { lat: 36.9914, lng: -122.0609 },  // UCSC coords
```

### Change primary color
Edit Tailwind classes throughout files:
```javascript
bg-blue-600 → bg-purple-600
```

### Add new accessibility feature
1. Add column to `bathrooms` table in Supabase
2. Add checkbox in `app/add/page.js`
3. Add badge display in `app/page.js` and `app/bathroom/[id]/page.js`

### Add photo uploads
1. Set up Supabase Storage bucket
2. Add file input in forms
3. Upload with `supabase.storage.upload()`
4. Store URL in database

---

## 🆘 Where to Look for Errors

1. **Browser Console** (F12 → Console tab)
   - JavaScript errors
   - Network requests
   - Supabase errors

2. **Network Tab** (F12 → Network tab)
   - Failed API calls
   - Supabase requests

3. **Supabase Dashboard**
   - Table Editor (verify data)
   - Logs (see queries)

4. **Terminal**
   - Next.js build errors
   - Missing dependencies

---

**Need more help?** Check SETUP.md or README.md!

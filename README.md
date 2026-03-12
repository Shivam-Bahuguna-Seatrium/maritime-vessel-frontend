# Maritime Vessel Identity - Frontend

React + Vite frontend for maritime vessel identity resolution system.

## Local Development

### 1. Install dependencies
```bash
npm install
```

### 2. Setup environment variables
```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local to point to your backend
# VITE_API_URL=http://localhost:8000
```

### 3. Copy source files
```bash
# You need the src/ folder from the main project
# Copy maritime_vessel_system/frontend/src/ to this repo as src/
# Also copy lib/ folder if you have it
# Structure should be:
# maritime-vessel-frontend/
#   ├── src/
#   │   ├── components/
#   │   ├── App.jsx
#   │   ├── main.jsx
#   │   └── index.css
#   ├── lib/
#   │   ├── bindings/
#   │   └── tom-select/
#   │   └── vis-9.1.2/
#   ├── index.html
#   ├── package.json
```

### 4. Make sure backend is running
```bash
# In another terminal, run backend
cd ../maritime-vessel-backend
python -m venv venv
venv\Scripts\activate  # or source venv/bin/activate
pip install -r requirements.txt
uvicorn index:app --reload --port 8000
```

### 5. Run frontend dev server
```bash
npm run dev

# Frontend will be at http://localhost:5173
# Configured to proxy /api calls to http://localhost:8000
```

### 6. Build for production
```bash
npm run build

# Output in dist/
```

## Deployment to Vercel

1. Create GitHub repo: `maritime-vessel-frontend`
2. Push this folder code to that repo
3. Connect to Vercel (New Project → GitHub)
4. Set environment variable in Vercel Project Settings:
   - `VITE_API_URL = https://maritime-vessel-api.vercel.app`
   (Replace with your actual backend URL)
5. Deploy!

**Important:** After Vercel detects and builds, it will need to rerun with the `VITE_API_URL` set. The build process will embed this URL into the bundle.

## Key Points

- **Build-time variables**: `VITE_API_URL` is compiled into the bundle during build
- **Local testing**: Use `.env.local` (gitignored)
- **Vercel deployment**: Use Project Settings → Environment Variables
- **Redeploy**: If you change environment variables, trigger a redeploy in Vercel
- **API calls**: All `/api/*` requests go to your backend API

## Troubleshooting

### "Cannot find module" errors
- Make sure `src/` folder is copied from main project
- Make sure `lib/` folder is copied (contains vis.js, tom-select, etc.)

### API calls returning 404
- Check `VITE_API_URL` is set correctly
- In browser console, verify the URL being called
- Make sure backend is running (if testing locally)

### Build fails on Vercel
- Check that `VITE_API_URL` is in Project Settings
- Try redeploying after setting env var
- Check Vercel build logs for actual error

# EngiDigitize

**Automated Drawing & Datasheet Conversion Platform**

EngiDigitize converts engineering drawings and technical datasheets into structured digital formats. Upload an image or PDF and get extracted structured data plus clean vector output.

---

## Features

- **Intelligent Data Extraction**
  - Title blocks
  - Bills of materials (BOM)
  - Component lists
  - Technical specifications
  - Notes and annotations
- **Vector Conversion**
  - Raster → scalable SVG (and DXF)
- **Multiple Export Formats**
  - JSON for structured data
  - SVG / DXF for vector drawings
- **User-Friendly Interface**
  - Drag-and-drop upload
  - Real-time processing feedback
  - Side-by-side before / after comparison
  - Responsive design

---

## Tech Stack

- **Frontend:** React 19 + TypeScript  
- **Build Tool:** Vite 6  
- **Styling:** Tailwind CSS  
- **Processing:** ML models (server-side)  
- **Platform:** Configured for Replit deployment

---

## Prerequisites

- Node.js 18 or higher  
- npm or yarn  
- `GEMINI_API_KEY` (or other ML API key) — set in environment

---

## Quickstart (Development)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd engidigitize
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` (or set Replit secrets) and add:
t  ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Open `http://localhost:5000`

---

## Usage (User Flow)

1. Upload a drawing (PNG, JPG, or PDF) via drag-and-drop or file picker.
2. The app processes the file and extracts data (title block, BOM, specs, annotations).
3. Review results in the side-by-side view (original raster vs. generated SVG).
4. Export as JSON, SVG, or DXF.

---

## Demo Image

You can add demo images in your project:

- **Public folder:** Place image in `public/` and reference like:
  ```html
  <img src="/demo.png" alt="Demo Image" />
  ```

- **Src folder:** Place in `src/assets/` and import like:
  ```jsx
  import demoImg from './assets/demo.png';
  <img src={demoImg} alt="Demo Image" />
  ```

---

## API / Services (example)

- `POST /api/process` — Upload file (multipart/form-data). Returns job id / result.
- `GET /api/result/:id` — Retrieve processed JSON + links to SVG/DXF.

---

## Project Structure
engidigitize/ ├── components/ │   ├── icons/ │   ├── FileUpload.tsx │   ├── ProcessingView.tsx │   └── ResultsView.tsx ├── services/ │   └── geminiService.ts ├── App.tsx ├── index.html ├── index.tsx ├── types.ts ├── vite.config.ts └── package.json

---

## Environment Variables

- `GEMINI_API_KEY` — Key for ML service
- `NODE_ENV` — `development` | `production`
- `API_BASE_URL` — Backend API base URL (if separate)

---

## Deployment

Configured for Replit:

1. Add required secrets (e.g., `GEMINI_API_KEY`).
2. Click `Deploy` in Replit.

Or build for production:

```bash
npm run build
npm run preview

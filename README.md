# Anime Goods Agent

An AI-powered platform for discovering anime merchandise through image analysis. Upload a screenshot or artwork of your favorite anime character, and let our agent help you find similar products, pricing, and recommendations.

## Features

- 🎨 **Dark Mode with Google-Clean Aesthetic** - Modern, minimalist UI design
- 🖼️ **Intelligent Image Upload** - Drag & drop or click to upload anime images
- 🤖 **AI Analysis** - Powered by advanced image recognition
- 🔍 **Product Matching** - Find similar merchandise across verified retailers
- ⚡ **Fast Processing** - Get results in seconds
- 📱 **Fully Responsive** - Works seamlessly on desktop and mobile
- ✨ **Smooth Animations** - Powered by Framer Motion

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **UI Pattern**: Google-clean aesthetic with dark mode

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/anime-goods-agent.git
cd anime-goods-agent
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
anime-goods-agent/
├── src/
│   ├── app/
│   │   ├── api/                           # API routes
│   │   │   ├── upload/route.ts           # Legacy image upload endpoint
│   │   │   ├── analyze/route.ts          # Gemini image analysis endpoint
│   │   │   └── search/route.ts           # Tavily merchandise search endpoint
│   │   ├── layout.tsx                    # Root layout with Tailwind styling
│   │   ├── page.tsx                      # Home page
│   │   └── globals.css                   # Global styles & Tailwind imports
│   ├── components/                       # React components
│   │   ├── HeroSection.tsx               # Hero section with analysis integration
│   │   ├── ImageUploadZone.tsx           # Drag & drop upload component
│   │   ├── AnalysisResults.tsx           # Image analysis results display
│   │   └── SearchResults.tsx             # Merchandise search results display
│   └── lib/                              # Utility functions & services
│       ├── types.ts                      # TypeScript types and interfaces
│       ├── utils.ts                      # Helper utility functions
│       ├── useAnalyzeImage.ts            # React hook for image analysis
│       ├── useSearch.ts                  # React hook for merchandise search
│       └── SearchService.ts              # Tavily API search service
├── public/                               # Static assets
├── package.json                          # Dependencies
├── tsconfig.json                         # TypeScript config
├── next.config.js                        # Next.js config
├── tailwind.config.ts                    # Tailwind CSS config
└── postcss.config.js                     # PostCSS config
```

## Component Details

### HeroSection
Main landing page component featuring:
- Animated gradient title
- Subtitle with key features
- Image upload zone integration
- Real-time analysis display
- Feature cards highlight

### ImageUploadZone
Interactive image upload component with:
- Drag & drop support
- Click to browse
- Image preview
- File size validation
- Animated interactions

### AnalysisResults
Displays image analysis output with:
- Series and character identification
- Japanese search keywords
- Analysis reasoning explanation
- Copy-to-clipboard for each field
- Loading and error states

### SearchResults
Displays merchandise search findings with:
- Platform indicators (Mercari/Suruga-Ya)
- Product pricing in Japanese format
- Item condition status
- Availability status (In Stock/Sold Out)
- Price statistics and range
- Direct links to purchase pages
- Results sorted by availability and price

## Environment Variables

Create a `.env.local` file with the following:

```env
# Google Generative AI API Key (for Gemini image analysis)
# Get your free API key at: https://aistudio.google.com/app/apikey
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here

# Tavily API Key (for Japanese merchandise search on Mercari & Suruga-Ya)
# Get your free API key at: https://tavily.com
TAVILY_API_KEY=your_tavily_api_key_here

# Optional: API Configuration
# NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Important:** 
- Your API keys should be kept private and never committed to version control
- Use `.env.local` for local development (already in `.gitignore`)
- For production, configure environment variables in your deployment platform (Vercel, etc.)
- Both API services offer free tiers with generous usage limits

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will automatically detect Next.js and configure the build
4. Your app will be live!

Alternative platforms: Netlify, AWS Amplify, Railway, etc.

## API Endpoints

### POST /api/upload
Upload an anime image (legacy endpoint).

**Request:**
```json
{
  "file": File
}
```

**Response:**
```json
{
  "success": true,
  "message": "Image received and queued for analysis",
  "fileSize": 1024000,
  "fileName": "anime.jpg",
  "mimeType": "image/jpeg",
  "analysisId": "analysis_1234567890"
}
```

### POST /api/analyze
Analyze an anime image using Gemini 1.5 Flash to identify merchandise details and Japanese search keywords.

**Request:**
```json
{
  "image": "base64_encoded_image_data",
  "mimeType": "image/jpeg"
}
```

**Response (Success):**
```json
{
  "series": "Attack on Titan",
  "character": "Eren Yeager",
  "jpKeywords": "進撃の巨人, エレン, フィギュア, 2015",
  "reasoning": "This is a figure of Eren Yeager from Attack on Titan series, appears to be from 2015 release based on sculpt style. Keywords include series name, character name, product type, and estimated year."
}
```

**Response (Error - Non-anime or blurry image):**
```json
{
  "error": "Image validation failed",
  "details": "Image does not appear to contain anime-related content"
}
```

**Error Codes:**
- `400`: Image validation failed (blurry, non-anime, or invalid format)
- `500`: API configuration error or analysis processing failed

**Features:**
- Automatic image validation (must be anime-related and clear)
- Japanese merchandise expert analysis
- Mercari-optimized search keywords
- Detailed reasoning for identification
- Safety content filtering

### POST /api/search
Search for merchandise on Japanese auction sites (Mercari & Suruga-Ya) using keywords from image analysis.

**Request:**
```json
{
  "jpKeywords": "進撃の巨人, エレン, フィギュア, 2015",
  "maxPrice": 5000,
  "condition": "Used",
  "platform": "Mercari"
}
```

**Response (Success):**
```json
{
  "results": [
    {
      "platform": "Mercari",
      "title": "[進撃の巨人] エレン フィギュア 2015年版",
      "price": "¥3,500",
      "condition": "Used",
      "link": "https://jp.mercari.com/item/m12345678",
      "isAvailable": true
    },
    {
      "platform": "Suruga-Ya",
      "title": "進撃の巨人 エレン・イェーガー 1/8 フィギュア",
      "price": "¥4,200",
      "condition": "Good",
      "link": "https://www.suruga-ya.jp/product/8901234",
      "isAvailable": true
    }
  ],
  "stats": {
    "totalResults": 12,
    "availableCount": 8,
    "unavailableCount": 4,
    "priceRange": {
      "min": 2800,
      "max": 5500,
      "average": 3875
    }
  },
  "query": "進撃の巨人, エレン, フィギュア, 2015"
}
```

**Features:**
- Searches only Mercari (jp.mercari.com) and Suruga-Ya (suruga-ya.jp)
- Extracts price in Japanese format (¥1,000 or 1000円)
- Detects item condition (New, Used, Good, Like New, etc.)
- Checks for sold-out status ('売り切れ')
- Sorts results by availability and price
- Provides price statistics and analysis
- Optional filtering by price, condition, or platform

## Future Enhancements

- [ ] Store analysis history in database
- [ ] User authentication and accounts
- [ ] Real-time price tracking across retailers
- [ ] Integration with Mercari API for direct product matching
- [ ] Advanced filtering by product type (figures, cards, clothing, etc.)
- [ ] Social sharing features for trends
- [ ] Multi-image batch analysis
- [ ] Custom merchandise recognition model training

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@animegoods.agent or open an issue on GitHub.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide React](https://lucide.dev/)

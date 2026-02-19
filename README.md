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
│   │   ├── api/              # API routes
│   │   │   └── upload/       # Image upload endpoint
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── HeroSection.tsx    # Hero section with title
│   │   └── ImageUploadZone.tsx # Image upload component
│   └── lib/                   # Utility functions
│       └── utils.ts           # Helper functions
├── public/                    # Static assets
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── next.config.js             # Next.js config
├── tailwind.config.ts         # Tailwind CSS config
└── postcss.config.js          # PostCSS config
```

## Component Details

### HeroSection
Main landing page component featuring:
- Animated gradient title
- Subtitle with key features
- Call-to-action buttons
- Feature cards

### ImageUploadZone
Interactive image upload component with:
- Drag & drop support
- Click to browse
- Image preview
- File size validation
- Animated interactions

## Environment Variables

Create a `.env.local` file with the following:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Add your service integrations here
# NEXT_PUBLIC_STRIPE_KEY=your_key
# NEXT_PUBLIC_ANALYTICS_ID=your_id
```

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
Upload and analyze an anime image.

**Request:**
```
Content-Type: multipart/form-data

{
  file: File
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

## Future Enhancements

- [ ] Integration with AI vision models (Claude Vision, GPT-4V)
- [ ] Real-time product matching
- [ ] User authentication and history
- [ ] Price comparison across retailers
- [ ] Wishlist and favorites
- [ ] Social sharing features
- [ ] Advanced filtering options

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

# Anime Goods Agent

A multimodal agent that turns an image of anime merchandise into structured search actions on trusted Japanese marketplaces.

Upload an image of a collectible item. The agent identifies what it likely is, generates Japanese collector-style keywords, and produces search results scoped to:

- Mercari (jp.mercari.com)
- Surugaya (suruga-ya.jp)

The goal is to reduce friction between visual discovery and actionable marketplace search.

![demo.gif]

## Why This Exists

Collecting older anime merchandise (10–20+ years old) is high-friction:

- You may not know the official product name.
- Listings are primarily in Japanese.
- Small keyword differences drastically affect results.
- Visual search returns noisy sources.
- Trusted resale platforms must be searched separately.

This project explores:

> Can a multimodal agent bridge perception → keyword grounding → marketplace action in one step?

## What It Currently Does

### 1. Image Analysis (Gemini 2.5)

Identifies likely:
- Series
- Character
- Item type (e.g., strap, acrylic stand, postcard, figure)

Generates Japanese collector-style search keywords

Provides reasoning trace explaining keyword selection

### 2. Scoped Marketplace Search (Serper.dev)

Uses Serper.dev Google Search API

Strictly scoped to:
- `site:jp.mercari.com`
- `site:suruga-ya.jp`

Passes generated Japanese keywords as the query

Extracts:
- Title
- Price (¥ format)
- Condition (New / Used / etc.)
- Availability (detects 売り切れ / sold out)

### 3. Result Ranking

In-stock items appear first

Then sorted by price

Surugaya results marked with a "Trusted Shop" badge

### 4. Agent Reasoning Trace

A terminal-style sidebar shows:
- Image analysis progress
- Keyword generation
- Marketplace querying
- Result cleaning + ranking

This makes the perception → reasoning → retrieval pipeline transparent.

## Architecture

```
Image Upload
   ↓
Gemini 2.5 Vision Analysis
   ↓
Japanese Keyword Generation
   ↓
Serper.dev (site-restricted search)
   ↓
Result Cleaning + Ranking
   ↓
Structured UI Display
```

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Gemini 2.5 (Google Generative AI SDK)
- Serper.dev API (Google Search wrapper)

## Environment Variables

Create `.env.local`:

```
GOOGLE_GENERATIVE_AI_API_KEY=your_key
SERPER_API_KEY=your_key
```

**Notes:**
- Serper.dev replaces the previous Tavily-based implementation.
- Search is intentionally restricted to Mercari and Surugaya.
- No direct scraping is performed.

## Current Limitations

- No direct marketplace API integration.
- Availability inferred from snippets.
- No historical pricing or tracking.
- Keyword quality depends on image clarity.

This is intentionally scoped as a multimodal + retrieval prototype.

## Roadmap

### MVP (Current Scope)

- Image upload
- Multimodal identification (Gemini 2.5)
- Japanese keyword generation
- Site-scoped search via Serper.dev
- Structured result ranking
- Transparent reasoning trace

**Goal:** reduce discovery friction from minutes of manual searching to seconds.

### Milestones

#### Phase 1 — Visual Grounding Augmentation

Integrate visual search (Lens-style image search) to supplement Gemini predictions

Use visually similar matches to refine and disambiguate keywords

Surface exact or near-exact match results separately in the results page

Improve franchise / character confidence scoring

This reduces reliance on model-only inference and introduces retrieval-grounded visual reasoning.

#### Phase 2 — Retrieval Awareness

Smarter availability inference

Duplicate suppression across marketplaces

Improved condition extraction

Structured query expansion (e.g., 非売品, 特典 variants)

#### Phase 3 — Collector Assistance

Text refinement ("same illustration variant")

Alternate artwork detection

Lightweight listing monitoring

Optional historical price estimation

## North Star

A multimodal collector companion that:

- Understands niche visual merchandise
- Uses visual retrieval + language grounding jointly
- Generates high-quality marketplace queries
- Continuously monitors trusted resale platforms
- Bridges perception → grounding → action over time

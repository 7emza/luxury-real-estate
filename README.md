# LuxuryEstates - Dubai Real Estate Platform

A modern, dynamic luxury real estate platform built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

### Dynamic Property Listings
- Browse all properties with dynamic filtering
- Filter by location, property type, price range, status, and bedrooms
- Real-time search functionality
- Sort by featured, price (low to high), or price (high to low)

### Search Functionality
- Hero search bar on homepage
- Advanced filtering on properties page
- URL parameter-based filtering (shareable links)
- Active filter indicators with clear all option

### Property Details
- Dynamic property detail pages
- Image galleries with multiple views
- Comprehensive property information
- Agent contact form
- Related properties suggestions
- Key features and amenities display

### Components
- **Navbar**: Responsive navigation with mobile menu
- **Footer**: Comprehensive footer with links and property type navigation
- **PropertyCard**: Reusable property card component
- **SearchBar**: Dynamic search with filters

### Pages
- **Home** (`/`): Hero section, featured properties, categories, locations, testimonials
- **Properties** (`/properties`): Full property listing with advanced filters
- **Property Detail** (`/properties/[id]`): Individual property pages with full details

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Fonts**: Playfair Display (headings), Inter (body)
- **Images**: Next.js Image optimization
- **Data**: JSON-based property data

## Getting Started

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

The easiest way to deploy is using the [Vercel Platform](https://vercel.com):

```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Project Structure

```
nextjs-app/
├── app/
│   ├── layout.tsx          # Root layout with Navbar & Footer
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   └── properties/
│       ├── page.tsx        # Properties listing page
│       └── [id]/
│           └── page.tsx    # Dynamic property detail pages
├── components/
│   ├── Navbar.tsx          # Navigation component
│   ├── Footer.tsx          # Footer component
│   ├── PropertyCard.tsx    # Property card component
│   └── SearchBar.tsx       # Search bar component
├── lib/
│   └── data.ts             # Data fetching utilities
├── types/
│   └── property.ts         # TypeScript types
├── data/
│   └── properties.json     # Property data
└── public/                 # Static assets
```

## Key Features Implemented

✅ Dynamic property listings with real-time filtering
✅ Advanced search functionality with multiple filters
✅ URL parameter-based search (shareable filter links)
✅ Dynamic property detail pages
✅ Responsive design (mobile, tablet, desktop)
✅ Image optimization with Next.js Image
✅ TypeScript for type safety
✅ SEO-friendly with proper metadata
✅ Static generation for optimal performance
✅ Reusable component architecture

## Data Management

Properties are stored in `data/properties.json` and include:
- Property details (title, type, status, price, location)
- Images and descriptions
- Features and amenities
- Agent information
- City and testimonial data

## Environment Variables

No environment variables required for basic functionality. The app uses static JSON data.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is for demonstration purposes.

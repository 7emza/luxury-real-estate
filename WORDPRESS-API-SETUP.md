# WordPress REST API Setup Guide

This document outlines the WordPress REST API endpoints needed for the luxury real estate platform.

## Base URL

Set your WordPress API base URL in the environment variable:

```env
NEXT_PUBLIC_API_URL=https://your-wordpress-site.com/wp-json/api/v1
```

## Required Endpoints

### 1. Translations

**Endpoint:** `GET /wp-json/api/v1/translations`

**Description:** Returns all translations for multiple languages (English and Arabic).

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "translations": {
      "en": {
        "nav.home": "Home",
        "nav.properties": "Properties",
        ...
      },
      "ar": {
        "nav.home": "الرئيسية",
        "nav.properties": "العقارات",
        ...
      }
    },
    "defaultLanguage": "en",
    "availableLanguages": ["en", "ar"]
  },
  "timestamp": "2025-11-24T10:00:00Z"
}
```

**WordPress Implementation:**
- Create a custom post type or use Advanced Custom Fields (ACF) for translation strings
- Create a custom REST API endpoint to return all translations
- Consider using WPML or Polylang for multi-language support

---

### 2. Site Settings

**Endpoint:** `GET /wp-json/api/v1/settings`

**Description:** Returns general site configuration including contact info, social media, and SEO settings.

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "siteName": "LuxuryEstates",
    "siteDescription": "Premium Real Estate in Dubai",
    "logo": "/logo.png",
    "contactInfo": {
      "phone": "+971 50 123 4567",
      "email": "info@luxuryestates.com",
      "address": "Dubai, UAE"
    },
    "socialMedia": {
      "facebook": "https://facebook.com/luxuryestates",
      "instagram": "https://instagram.com/luxuryestates",
      "twitter": "https://twitter.com/luxuryestates",
      "linkedin": "https://linkedin.com/company/luxuryestates"
    },
    "seo": {
      "title": "LuxuryEstates - Premium Real Estate in Dubai",
      "description": "Discover luxury properties in Dubai...",
      "keywords": ["Dubai real estate", "luxury properties", ...]
    }
  },
  "timestamp": "2025-11-24T10:00:00Z"
}
```

**WordPress Implementation:**
- Use WordPress Settings API or ACF Options Page
- Create custom REST endpoint to expose these settings
- Consider using Yoast SEO or RankMath for SEO fields

---

### 3. Features (Why Choose Us)

**Endpoint:** `GET /wp-json/api/v1/features`

**Description:** Returns feature highlights for the "Why Choose Us" section.

**Response Structure:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "icon": "shield",
      "title": "Verified Properties",
      "description": "All properties are thoroughly verified...",
      "order": 1
    },
    ...
  ],
  "timestamp": "2025-11-24T10:00:00Z"
}
```

**WordPress Implementation:**
- Create a custom post type: `features`
- Fields: title, description, icon (text or SVG), order (number)
- Register custom REST endpoint or extend the default REST API

---

### 4. Property Categories

**Endpoint:** `GET /wp-json/api/v1/categories`

**Description:** Returns property type categories with counts and images.

**Response Structure:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Luxury Villas",
      "type": "villa",
      "count": 156,
      "image": "https://...",
      "order": 1
    },
    ...
  ],
  "timestamp": "2025-11-24T10:00:00Z"
}
```

**WordPress Implementation:**
- Create a custom taxonomy: `property_type`
- Add custom fields to taxonomy terms (ACF)
- Create REST endpoint that includes term meta (image, order)
- Auto-calculate property counts per category

---

### 5. Locations/Cities

**Endpoint:** `GET /wp-json/api/v1/locations`

**Description:** Returns available locations/cities with property counts.

**Response Structure:**
```json
{
  "success": true,
  "data": [
    {
      "name": "Dubai Marina",
      "properties": 156,
      "image": "https://..."
    },
    ...
  ],
  "timestamp": "2025-11-24T10:00:00Z"
}
```

**WordPress Implementation:**
- Create a custom taxonomy: `location`
- Add custom fields for location image
- Auto-calculate property counts per location

---

### 6. Testimonials

**Endpoint:** `GET /wp-json/api/v1/testimonials`

**Description:** Returns client testimonials with ratings.

**Response Structure:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "John Smith",
      "role": "Property Investor",
      "image": "https://...",
      "rating": 5,
      "text": "Exceptional service!...",
      "order": 1
    },
    ...
  ],
  "timestamp": "2025-11-24T10:00:00Z"
}
```

**WordPress Implementation:**
- Create a custom post type: `testimonials`
- Fields: client name, role, rating (1-5), testimonial text, image, order
- Register REST endpoint for testimonials

---

### 7. Properties (All)

**Endpoint:** `GET /wp-json/api/v1/properties`

**Query Parameters:**
- `featured` (boolean): Filter featured properties
- `limit` (number): Limit number of results
- `offset` (number): Pagination offset

**Description:** Returns all properties.

**Response Structure:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Luxury Beachfront Villa",
      "type": "Villa",
      "status": "For Sale",
      "price": 4500000,
      "pricePerMonth": null,
      "location": "Dubai Marina, Dubai",
      "address": "Palm Jumeirah, Dubai, UAE",
      "bedrooms": 5,
      "bathrooms": 6,
      "area": 8500,
      "yearBuilt": 2022,
      "description": "Stunning beachfront villa...",
      "features": [
        "Private Beach Access",
        "Infinity Pool",
        ...
      ],
      "images": [
        "https://...",
        ...
      ],
      "featured": true,
      "luxury": true,
      "agent": {
        "name": "Sarah Johnson",
        "phone": "+971 50 123 4567",
        "email": "sarah@luxuryrealestate.com",
        "image": "https://..."
      }
    },
    ...
  ],
  "timestamp": "2025-11-24T10:00:00Z"
}
```

**WordPress Implementation:**
- Create a custom post type: `properties`
- Fields needed:
  - Type (taxonomy or select: Villa, Apartment, Townhouse, Commercial)
  - Status (For Sale, For Rent)
  - Price (number)
  - Price Per Month (number, optional)
  - Location (taxonomy)
  - Address (text)
  - Bedrooms (number)
  - Bathrooms (number)
  - Area (number, in sq ft)
  - Year Built (number)
  - Features (repeater or multi-checkbox)
  - Images (gallery)
  - Featured (checkbox)
  - Luxury (checkbox)
  - Agent (relationship or group of fields)

---

### 8. Property by ID

**Endpoint:** `GET /wp-json/api/v1/properties/{id}`

**Description:** Returns a single property by ID.

**Response Structure:** Same as single property object above.

**WordPress Implementation:**
- Extend default WP REST API for the `properties` post type
- Include all custom fields in the response

---

### 9. Property Search

**Endpoint:** `GET /wp-json/api/v1/properties/search`

**Query Parameters:**
- `location` (string): Filter by location
- `type` (string): Filter by property type (Villa, Apartment, etc.)
- `status` (string): Filter by status (For Sale, For Rent)
- `bedrooms` (number): Minimum bedrooms
- `priceRange` (string): Format "min-max" (e.g., "1000000-5000000")
- `sortBy` (string): Sort option (featured, price-low, price-high)

**Description:** Search and filter properties.

**Response Structure:** Same as properties list above.

**WordPress Implementation:**
- Create custom REST endpoint with WP_Query
- Implement meta_query for custom fields
- Implement tax_query for taxonomies (type, location)
- Add sorting logic

---

## Implementation Steps

### Phase 1: WordPress Setup

1. Install WordPress
2. Install recommended plugins:
   - Advanced Custom Fields (ACF) PRO
   - Custom Post Type UI (or register CPTs in theme)
   - WPML or Polylang (for translations)
   - Yoast SEO or RankMath

### Phase 2: Custom Post Types

Create the following custom post types:

1. **Properties** (`properties`)
   - Public: Yes
   - REST API: Enabled
   - Hierarchical: No

2. **Features** (`features`)
   - Public: No
   - REST API: Enabled

3. **Testimonials** (`testimonials`)
   - Public: No
   - REST API: Enabled

### Phase 3: Custom Taxonomies

Create the following taxonomies:

1. **Property Type** (`property_type`)
   - Attached to: Properties
   - Terms: Villa, Apartment, Townhouse, Commercial

2. **Location** (`location`)
   - Attached to: Properties
   - Terms: Dubai Marina, Downtown Dubai, Palm Jumeirah, etc.

### Phase 4: Custom REST API Endpoints

Create a custom plugin: `luxury-real-estate-api`

**File structure:**
```
/wp-content/plugins/luxury-real-estate-api/
  luxury-real-estate-api.php
  includes/
    class-api-translations.php
    class-api-settings.php
    class-api-features.php
    class-api-categories.php
    class-api-locations.php
    class-api-testimonials.php
    class-api-properties.php
```

**Main plugin file example:**
```php
<?php
/**
 * Plugin Name: Luxury Real Estate API
 * Description: Custom REST API endpoints for luxury real estate frontend
 * Version: 1.0.0
 */

// Register custom REST routes
add_action('rest_api_init', function () {
  // Translations endpoint
  register_rest_route('api/v1', '/translations', array(
    'methods' => 'GET',
    'callback' => 'get_translations',
    'permission_callback' => '__return_true'
  ));

  // Site settings endpoint
  register_rest_route('api/v1', '/settings', array(
    'methods' => 'GET',
    'callback' => 'get_site_settings',
    'permission_callback' => '__return_true'
  ));

  // Features endpoint
  register_rest_route('api/v1', '/features', array(
    'methods' => 'GET',
    'callback' => 'get_features',
    'permission_callback' => '__return_true'
  ));

  // Categories endpoint
  register_rest_route('api/v1', '/categories', array(
    'methods' => 'GET',
    'callback' => 'get_categories',
    'permission_callback' => '__return_true'
  ));

  // Locations endpoint
  register_rest_route('api/v1', '/locations', array(
    'methods' => 'GET',
    'callback' => 'get_locations',
    'permission_callback' => '__return_true'
  ));

  // Testimonials endpoint
  register_rest_route('api/v1', '/testimonials', array(
    'methods' => 'GET',
    'callback' => 'get_testimonials',
    'permission_callback' => '__return_true'
  ));

  // Properties endpoints
  register_rest_route('api/v1', '/properties', array(
    'methods' => 'GET',
    'callback' => 'get_properties',
    'permission_callback' => '__return_true'
  ));

  register_rest_route('api/v1', '/properties/(?P<id>\d+)', array(
    'methods' => 'GET',
    'callback' => 'get_property_by_id',
    'permission_callback' => '__return_true'
  ));

  register_rest_route('api/v1', '/properties/search', array(
    'methods' => 'GET',
    'callback' => 'search_properties',
    'permission_callback' => '__return_true'
  ));
});

// Implement callback functions in separate files
require_once plugin_dir_path(__FILE__) . 'includes/class-api-translations.php';
require_once plugin_dir_path(__FILE__) . 'includes/class-api-settings.php';
// ... etc
```

### Phase 5: Testing & Migration

1. Test all endpoints with Postman or Insomnia
2. Verify response structure matches expected format
3. Update `NEXT_PUBLIC_API_URL` in Next.js `.env.local`
4. Update `lib/api.ts` to use real API calls instead of mock data
5. Test the frontend with real data

---

## Security Considerations

1. **CORS Configuration:**
   ```php
   add_action('rest_api_init', function() {
     remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
     add_filter('rest_pre_serve_request', function($value) {
       header('Access-Control-Allow-Origin: https://your-nextjs-domain.com');
       header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
       header('Access-Control-Allow-Credentials: true');
       return $value;
     });
   }, 15);
   ```

2. **Rate Limiting:** Consider using a plugin like "WP REST API Controller" for rate limiting

3. **API Authentication:** For write operations (future), implement JWT authentication

4. **Caching:** Use Redis or WP Object Cache for better performance

---

## Example: Properties Endpoint Implementation

```php
<?php
// includes/class-api-properties.php

function get_properties($request) {
  $args = array(
    'post_type' => 'properties',
    'posts_per_page' => -1,
    'post_status' => 'publish'
  );

  // Filter by featured
  if ($request->get_param('featured')) {
    $args['meta_query'] = array(
      array(
        'key' => 'featured',
        'value' => '1',
        'compare' => '='
      )
    );
  }

  $query = new WP_Query($args);
  $properties = array();

  if ($query->have_posts()) {
    while ($query->have_posts()) {
      $query->the_post();
      $property_id = get_the_ID();

      $properties[] = array(
        'id' => $property_id,
        'title' => get_the_title(),
        'type' => get_field('property_type'),
        'status' => get_field('status'),
        'price' => (int) get_field('price'),
        'pricePerMonth' => get_field('price_per_month') ? (int) get_field('price_per_month') : null,
        'location' => get_field('location'),
        'address' => get_field('address'),
        'bedrooms' => (int) get_field('bedrooms'),
        'bathrooms' => (int) get_field('bathrooms'),
        'area' => (int) get_field('area'),
        'yearBuilt' => (int) get_field('year_built'),
        'description' => get_field('description'),
        'features' => get_field('features'),
        'images' => get_field('gallery'),
        'featured' => (bool) get_field('featured'),
        'luxury' => (bool) get_field('luxury'),
        'agent' => array(
          'name' => get_field('agent_name'),
          'phone' => get_field('agent_phone'),
          'email' => get_field('agent_email'),
          'image' => get_field('agent_image')
        )
      );
    }
    wp_reset_postdata();
  }

  return rest_ensure_response(array(
    'success' => true,
    'data' => $properties,
    'timestamp' => current_time('c')
  ));
}
```

---

## Next Steps

1. Review this documentation
2. Set up WordPress installation
3. Install required plugins
4. Create custom post types and taxonomies
5. Create the custom API plugin
6. Test endpoints
7. Update Next.js environment variables
8. Switch from mock data to real API in `lib/api.ts`

---

## Notes

- All endpoints currently return mock data from `data/mock-api.json`
- The API functions in `lib/api.ts` are ready to switch to real endpoints
- Simply uncomment the "Later:" lines and comment out mock data returns
- Make sure to test thoroughly before going live

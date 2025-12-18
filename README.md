# Steam Store Scraper

<p>
  Extract comprehensive game data from Steam Store including prices, discounts, reviews, genres, screenshots, system requirements, and detailed metadata. Fast, reliable, and production-ready scraper built for gaming platforms, price comparison sites, and market research.
</p>

## Overview

<p>
  This scraper enables you to collect detailed information about games available on Steam Store, the world's largest digital distribution platform for PC gaming. Extract pricing data, user reviews, game specifications, developer information, and much more with a single configuration.
</p>

<p>
  <strong>Key capabilities:</strong> Multi-strategy data extraction (JSON API + HTML parsing), automatic fallback mechanisms, concurrent processing for high performance, comprehensive game metadata collection, and flexible filtering options.
</p>

## Features

<ul>
  <li><strong>Comprehensive Data Extraction</strong> - Game titles, descriptions, pricing, discounts, reviews, genres, tags, screenshots, and system requirements</li>
  <li><strong>Multi-Strategy Scraping</strong> - Prioritizes JSON API for speed, automatically falls back to HTML parsing when needed</li>
  <li><strong>Advanced Filtering</strong> - Sort by price/reviews/release date, filter by language/category/tags/price range</li>
  <li><strong>High Performance</strong> - Concurrent request processing with configurable concurrency levels (1-10 parallel requests)</li>
  <li><strong>Detailed Game Information</strong> - Optional deep scraping for full descriptions, screenshots, system requirements, and metadata</li>
  <li><strong>Production Ready</strong> - Built-in error handling, proxy support, timeout management, and comprehensive logging</li>
  <li><strong>Flexible Configuration</strong> - Customize results count (1-1000), pagination (1-20 pages), and search parameters</li>
</ul>

## Use Cases

<dl>
  <dt><strong>Gaming Platforms & Aggregators</strong></dt>
  <dd>Build comprehensive game databases, create price comparison tools, aggregate game reviews and ratings across platforms</dd>
  
  <dt><strong>Price Tracking & Monitoring</strong></dt>
  <dd>Track game prices over time, monitor discount patterns, alert users about price drops and sales</dd>
  
  <dt><strong>Market Research & Analytics</strong></dt>
  <dd>Analyze gaming industry trends, study pricing strategies, identify popular genres and tags, research developer/publisher portfolios</dd>
  
  <dt><strong>Gaming News & Media</strong></dt>
  <dd>Track new releases, monitor upcoming games, collect game specifications for reviews and articles</dd>
  
  <dt><strong>Competitive Intelligence</strong></dt>
  <dd>Monitor competitor game launches, analyze pricing strategies, track review scores and player sentiment</dd>
  
  <dt><strong>E-commerce & Retail</strong></dt>
  <dd>Import Steam game data for resale platforms, create automated catalogs, maintain up-to-date pricing information</dd>
</dl>

## Quick Start

<h3>Basic Configuration - Extract 50 Games</h3>

<pre><code>{
  "maxResults": 50,
  "maxPages": 3,
  "collectDetails": true,
  "language": "english",
  "maxConcurrency": 3
}</code></pre>

<h3>Filter by Price - Games Under $20</h3>

<pre><code>{
  "maxResults": 100,
  "maxPrice": "20",
  "sortBy": "Price_ASC",
  "collectDetails": true
}</code></pre>

<h3>Custom Search URL - Specific Steam Category</h3>

<pre><code>{
  "startUrl": "https://store.steampowered.com/search/?sort_by=Reviews_DESC&supportedlang=english&category1=21",
  "maxResults": 75,
  "collectDetails": true
}</code></pre>

<h3>Best Rated Games - Sorted by Reviews</h3>

<pre><code>{
  "sortBy": "Reviews_DESC",
  "maxResults": 100,
  "maxPages": 5,
  "collectDetails": true,
  "language": "english"
}</code></pre>

## Input Parameters

<table>
  <thead>
    <tr>
      <th>Parameter</th>
      <th>Type</th>
      <th>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>startUrl</code></td>
      <td>String</td>
      <td>No</td>
      <td>Custom Steam Store search URL. If provided, overrides other search parameters. Use this for advanced filtering or specific searches.</td>
    </tr>
    <tr>
      <td><code>sortBy</code></td>
      <td>String</td>
      <td>No</td>
      <td>Sort order for results. Options: <code>_ASC</code> (relevance), <code>Released_DESC</code> (newest first), <code>Price_ASC</code>, <code>Price_DESC</code>, <code>Name_ASC</code>, <code>Reviews_DESC</code>. Default: <code>_ASC</code></td>
    </tr>
    <tr>
      <td><code>category</code></td>
      <td>String</td>
      <td>No</td>
      <td>Steam category ID filter. Common values: 998 (All), 21 (Action), 23 (Indie), 9 (Strategy), 3 (RPG), 1 (Action). Leave empty for all categories.</td>
    </tr>
    <tr>
      <td><code>maxPrice</code></td>
      <td>String</td>
      <td>No</td>
      <td>Maximum price filter (e.g., "20" for $20). Leave empty to include all prices. Useful for finding budget games or filtering expensive titles.</td>
    </tr>
    <tr>
      <td><code>tags</code></td>
      <td>String</td>
      <td>No</td>
      <td>Filter by Steam tag IDs (comma-separated). Example: "1695" for Open World. Combine multiple tags for precise filtering.</td>
    </tr>
    <tr>
      <td><code>language</code></td>
      <td>String</td>
      <td>No</td>
      <td>Supported language filter. Options: english, spanish, french, german, italian, japanese, korean, portuguese, russian, schinese, tchinese. Default: <code>english</code></td>
    </tr>
    <tr>
      <td><code>collectDetails</code></td>
      <td>Boolean</td>
      <td>No</td>
      <td>Enable to collect comprehensive game details including full descriptions, system requirements, screenshots, and metadata. Increases runtime but provides richer data. Default: <code>true</code></td>
    </tr>
    <tr>
      <td><code>maxResults</code></td>
      <td>Integer</td>
      <td>No</td>
      <td>Maximum number of games to scrape (1-1000). Higher values increase runtime and compute usage. Default: <code>100</code></td>
    </tr>
    <tr>
      <td><code>maxPages</code></td>
      <td>Integer</td>
      <td>No</td>
      <td>Maximum search result pages to process (1-20). Each page contains approximately 25 games. Default: <code>5</code></td>
    </tr>
    <tr>
      <td><code>maxConcurrency</code></td>
      <td>Integer</td>
      <td>No</td>
      <td>Number of parallel requests (1-10). Higher values = faster scraping but may trigger rate limits. Recommended: 3-5. Default: <code>3</code></td>
    </tr>
    <tr>
      <td><code>proxyConfiguration</code></td>
      <td>Object</td>
      <td>Recommended</td>
      <td>Proxy settings. Recommended to use Apify Proxy (residential or datacenter) to avoid blocking and ensure reliable access. Default: <code>{"useApifyProxy": true}</code></td>
    </tr>
  </tbody>
</table>

## Output Data

<p>
  Each game entry contains comprehensive information structured as JSON. The data includes pricing, reviews, technical specifications, and metadata useful for gaming platforms, price trackers, and market research.
</p>

<h3>Sample Output</h3>

<pre><code>{
  "appId": "730",
  "title": "Counter-Strike 2",
  "type": "game",
  "description": "For over two decades, Counter-Strike has offered an elite competitive experience...",
  "shortDescription": "Competitive tactical FPS",
  "price": "Free",
  "originalPrice": null,
  "discountPercent": null,
  "isFree": true,
  "releaseDate": "27 Sep, 2023",
  "developer": "Valve",
  "publisher": "Valve",
  "reviewSummary": "Very Positive",
  "reviewScore": null,
  "positiveReviews": "485000",
  "genres": "Action, Free to Play",
  "categories": "Multi-player, Steam Achievements, Steam Trading Cards",
  "tags": "FPS, Shooter, Multiplayer, Competitive, Action",
  "screenshots": [
    "https://cdn.akamai.steamstatic.com/steam/apps/730/ss_1.jpg",
    "https://cdn.akamai.steamstatic.com/steam/apps/730/ss_2.jpg"
  ],
  "headerImage": "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg",
  "website": "https://www.counter-strike.net",
  "supportInfo": "https://support.steampowered.com",
  "platforms": "Windows, Mac, Linux",
  "requiredAge": "0",
  "dlcCount": null,
  "achievements": "167",
  "systemRequirements": {
    "windows": "OS: Windows 10, Processor: Intel Core i5 2500k...",
    "mac": "OS: macOS Big Sur 11.0..."
  },
  "url": "https://store.steampowered.com/app/730/",
  "source": "json-api-detailed",
  "scrapedAt": "2024-12-18T10:30:00.000Z"
}</code></pre>

<h3>Output Fields Description</h3>

<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>appId</code></td>
      <td>String</td>
      <td>Unique Steam application identifier</td>
    </tr>
    <tr>
      <td><code>title</code></td>
      <td>String</td>
      <td>Official game title</td>
    </tr>
    <tr>
      <td><code>type</code></td>
      <td>String</td>
      <td>Content type (game, dlc, demo, etc.)</td>
    </tr>
    <tr>
      <td><code>description</code></td>
      <td>String</td>
      <td>Detailed game description (collected when collectDetails=true)</td>
    </tr>
    <tr>
      <td><code>price</code></td>
      <td>String</td>
      <td>Current price with currency symbol or "Free"</td>
    </tr>
    <tr>
      <td><code>originalPrice</code></td>
      <td>String</td>
      <td>Original price before discount (if on sale)</td>
    </tr>
    <tr>
      <td><code>discountPercent</code></td>
      <td>String</td>
      <td>Discount percentage (e.g., "50%")</td>
    </tr>
    <tr>
      <td><code>releaseDate</code></td>
      <td>String</td>
      <td>Game release date</td>
    </tr>
    <tr>
      <td><code>developer</code></td>
      <td>String</td>
      <td>Game developer/studio name(s)</td>
    </tr>
    <tr>
      <td><code>publisher</code></td>
      <td>String</td>
      <td>Game publisher name(s)</td>
    </tr>
    <tr>
      <td><code>reviewSummary</code></td>
      <td>String</td>
      <td>Steam review score (e.g., "Very Positive", "Mixed")</td>
    </tr>
    <tr>
      <td><code>genres</code></td>
      <td>String</td>
      <td>Game genres (comma-separated)</td>
    </tr>
    <tr>
      <td><code>tags</code></td>
      <td>String</td>
      <td>Popular user-defined tags</td>
    </tr>
    <tr>
      <td><code>screenshots</code></td>
      <td>Array</td>
      <td>List of screenshot URLs (up to 5)</td>
    </tr>
    <tr>
      <td><code>platforms</code></td>
      <td>String</td>
      <td>Supported platforms (Windows, Mac, Linux)</td>
    </tr>
    <tr>
      <td><code>systemRequirements</code></td>
      <td>Object</td>
      <td>Minimum and recommended system specs (when collectDetails=true)</td>
    </tr>
    <tr>
      <td><code>url</code></td>
      <td>String</td>
      <td>Direct link to game's Steam Store page</td>
    </tr>
    <tr>
      <td><code>source</code></td>
      <td>String</td>
      <td>Data extraction method used (json-api-detailed, html-detailed, etc.)</td>
    </tr>
    <tr>
      <td><code>scrapedAt</code></td>
      <td>String</td>
      <td>ISO timestamp when data was extracted</td>
    </tr>
  </tbody>
</table>

## Configuration Examples

<h3>Price Comparison Tool</h3>
<pre><code>{
  "sortBy": "Price_DESC",
  "maxResults": 200,
  "collectDetails": false,
  "maxConcurrency": 5
}</code></pre>

<h3>New Releases Research</h3>
<pre><code>{
  "sortBy": "Released_DESC",
  "maxResults": 100,
  "maxPages": 5,
  "collectDetails": true
}</code></pre>

<h3>Budget Gaming Collection</h3>
<pre><code>{
  "maxPrice": "10",
  "sortBy": "Reviews_DESC",
  "maxResults": 150,
  "collectDetails": true
}</code></pre>

<h3>Specific Language Support</h3>
<pre><code>{
  "language": "japanese",
  "maxResults": 50,
  "sortBy": "Reviews_DESC",
  "collectDetails": true
}</code></pre>

## Performance & Optimization

<h3>Recommended Settings by Use Case</h3>

<table>
  <thead>
    <tr>
      <th>Use Case</th>
      <th>Max Results</th>
      <th>Details</th>
      <th>Concurrency</th>
      <th>Est. Runtime</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Quick Test</td>
      <td>10</td>
      <td>false</td>
      <td>3</td>
      <td>~20 seconds</td>
    </tr>
    <tr>
      <td>Price Monitoring</td>
      <td>100</td>
      <td>false</td>
      <td>5</td>
      <td>~1 minute</td>
    </tr>
    <tr>
      <td>Market Research</td>
      <td>200</td>
      <td>true</td>
      <td>3</td>
      <td>~4 minutes</td>
    </tr>
    <tr>
      <td>Full Catalog</td>
      <td>500</td>
      <td>true</td>
      <td>5</td>
      <td>~8-10 minutes</td>
    </tr>
    <tr>
      <td>Comprehensive Analysis</td>
      <td>1000</td>
      <td>true</td>
      <td>3</td>
      <td>~15-20 minutes</td>
    </tr>
  </tbody>
</table>

<h3>Best Practices</h3>

<ul>
  <li><strong>Start Small:</strong> Begin with 10-20 games to test your configuration and validate output format</li>
  <li><strong>Use Proxies:</strong> Enable Apify Proxy (residential recommended) to avoid rate limiting and ensure reliable access</li>
  <li><strong>Optimize Concurrency:</strong> Start with 3, increase to 5-7 for faster scraping if no errors occur</li>
  <li><strong>Balance Detail vs Speed:</strong> Set <code>collectDetails=false</code> for quick price checks, <code>true</code> for comprehensive data</li>
  <li><strong>Monitor Costs:</strong> Each detailed game fetch requires additional requests - estimate ~2-3 requests per game with details</li>
  <li><strong>Schedule Regular Runs:</strong> For price tracking, schedule daily/weekly runs to monitor changes over time</li>
  <li><strong>Filter Strategically:</strong> Use <code>maxPrice</code>, <code>category</code>, and <code>sortBy</code> to target specific game segments</li>
  <li><strong>Batch Processing:</strong> For large datasets (500+ games), split into multiple runs to avoid timeouts</li>
</ul>

<h3>Cost Estimation</h3>

<ul>
  <li><strong>Compute Units:</strong> ~0.01-0.02 per game (basic), ~0.03-0.05 per game (with details)</li>
  <li><strong>Proxy Costs:</strong> Additional charges apply when using Apify Proxy</li>
  <li><strong>100 Games (Basic):</strong> ~$0.10-0.15 platform cost</li>
  <li><strong>100 Games (Detailed):</strong> ~$0.30-0.40 platform cost</li>
  <li><strong>500 Games (Detailed):</strong> ~$1.50-2.00 platform cost</li>
</ul>

## Integration & Data Export

<p>
  Export scraped data in multiple formats for seamless integration with your applications and workflows.
</p>

<h3>Supported Export Formats</h3>

<ul>
  <li><strong>JSON:</strong> Structured data ideal for APIs and web applications</li>
  <li><strong>CSV:</strong> Spreadsheet-friendly format for analysis in Excel, Google Sheets</li>
  <li><strong>Excel:</strong> Direct export to .xlsx files with formatted columns</li>
  <li><strong>HTML Table:</strong> Ready-to-use HTML for embedding in web pages</li>
  <li><strong>RSS Feed:</strong> Subscribe to updates for continuous monitoring</li>
</ul>

<h3>API Access</h3>

<p>
  Access your scraped data programmatically using Apify API. Perfect for automated workflows, scheduled data updates, and integration with external systems.
</p>

<pre><code>// Fetch dataset items via Apify API
const response = await fetch(
  'https://api.apify.com/v2/datasets/YOUR_DATASET_ID/items'
);
const games = await response.json();
</code></pre>

## Technical Details

<h3>Scraping Strategy</h3>

<p>
  This scraper implements a multi-layered approach for maximum reliability and performance:
</p>

<ol>
  <li><strong>JSON API Priority:</strong> First attempts to fetch search results via Steam's JSON API endpoint for speed and reliability</li>
  <li><strong>HTML Fallback:</strong> Automatically switches to HTML parsing if JSON API is unavailable or returns errors</li>
  <li><strong>Detailed Extraction:</strong> When <code>collectDetails=true</code>, fetches comprehensive game data from individual store pages</li>
  <li><strong>Concurrent Processing:</strong> Processes multiple games simultaneously with configurable concurrency limits</li>
  <li><strong>Error Handling:</strong> Graceful error recovery with detailed logging for troubleshooting</li>
</ol>

<h3>Rate Limiting & Reliability</h3>

<ul>
  <li>Built-in rate limiting to respect Steam Store servers</li>
  <li>Automatic retry mechanism for failed requests</li>
  <li>Proxy rotation support for high-volume scraping</li>
  <li>Timeout management to prevent hanging requests</li>
  <li>Graceful shutdown on approaching time limits</li>
</ul>

<h3>Data Quality</h3>

<ul>
  <li>Validates all extracted data for consistency</li>
  <li>Removes duplicate games based on App ID</li>
  <li>Cleans and normalizes price data</li>
  <li>Extracts structured JSON-LD when available</li>
  <li>Provides source attribution for each data point</li>
</ul>

## Troubleshooting

<h3>Common Issues & Solutions</h3>

<dl>
  <dt><strong>No results returned</strong></dt>
  <dd>Check if your filters are too restrictive (maxPrice, category, tags). Try removing filters or increasing maxPages parameter. Verify proxy configuration is enabled.</dd>
  
  <dt><strong>Slow performance</strong></dt>
  <dd>Reduce maxConcurrency to 1-2 if experiencing timeouts. Set collectDetails=false for faster scraping. Use more specific filters to reduce total games processed.</dd>
  
  <dt><strong>Missing detailed data</strong></dt>
  <dd>Ensure collectDetails=true in your configuration. Some games may have limited data on Steam Store. Check the 'source' field to see which extraction method was used.</dd>
  
  <dt><strong>Rate limiting errors</strong></dt>
  <dd>Enable Apify Proxy in proxyConfiguration. Reduce maxConcurrency to 2-3. Add delays between runs if scheduling multiple consecutive executions.</dd>
  
  <dt><strong>Incomplete price data</strong></dt>
  <dd>Some games don't display prices in all regions. Price may show as "Free" for free-to-play games. Check originalPrice field for pre-discount pricing.</dd>
</dl>

## Limitations

<ul>
  <li><strong>Regional Restrictions:</strong> Game availability and prices may vary by region/country</li>
  <li><strong>Dynamic Content:</strong> Some game pages use heavy JavaScript - limited data may be extracted in edge cases</li>
  <li><strong>Rate Limits:</strong> Steam may throttle requests during peak times - use proxies and appropriate concurrency</li>
  <li><strong>Age-Restricted Content:</strong> Some mature content may require authentication - not accessible through this scraper</li>
  <li><strong>Private Games:</strong> Unreleased or hidden games won't appear in public search results</li>
</ul>

## Support & Feedback

<p>
  Need help or have suggestions? We're here to assist you in getting the most out of this scraper.
</p>

<ul>
  <li><strong>Issues:</strong> Report bugs or technical problems through the Apify Console</li>
  <li><strong>Feature Requests:</strong> Share ideas for new features or improvements</li>
  <li><strong>Documentation:</strong> Refer to this README and Apify documentation for detailed guidance</li>
  <li><strong>Community:</strong> Join Apify Discord community for discussions and tips</li>
</ul>

## Privacy & Legal

<p>
  This scraper is designed for ethical data collection from publicly available Steam Store pages. Users must comply with:
</p>

<ul>
  <li>Steam's Terms of Service and acceptable use policies</li>
  <li>Local and international data protection regulations (GDPR, CCPA, etc.)</li>
  <li>Apify Terms of Service and fair use guidelines</li>
  <li>Respect for website rate limits and server resources</li>
</ul>

<p>
  <strong>Disclaimer:</strong> This scraper is provided for legitimate business and research purposes. Users are responsible for ensuring their use complies with all applicable laws and regulations. The scraper extracts only publicly available information visible on Steam Store pages.
</p>

## Updates & Maintenance

<p>
  This scraper is actively maintained to ensure compatibility with Steam Store changes and optimal performance.
</p>

<ul>
  <li><strong>Regular Updates:</strong> Selectors and scraping logic updated to match Steam Store structure</li>
  <li><strong>Bug Fixes:</strong> Prompt resolution of reported issues and errors</li>
  <li><strong>Feature Enhancements:</strong> New features added based on user feedback and market needs</li>
  <li><strong>Performance Optimization:</strong> Continuous improvements for speed and reliability</li>
</ul>

<p>
  <em>Last updated: December 2024 | Version 1.0.0</em>
</p>
  "max_pages": 4
}
```

## 📋 Requirements & Limitations

### Data Freshness
- Jobs updated in real-time from APEC.fr
- Listings typically available for 30-60 days
- Salary data available for ~60% of positions

### Geographic Coverage
- France-wide coverage
- All 101 departments supported
- Major cities: Paris, Lyon, Marseille, Toulouse, Nice, Nantes, Bordeaux

### Language Support
- Primary language: French
- Some international companies list in English
- Location names in French format


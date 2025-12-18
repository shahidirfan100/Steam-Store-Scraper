// Steam Store Scraper - Fast & Stealthy with CheerioCrawler
import { Actor, log } from 'apify';
import { CheerioCrawler } from 'crawlee';

const STEAM_STORE = 'https://store.steampowered.com';
const STEAM_SEARCH = 'https://store.steampowered.com/search/';

// Utility functions
const parsePrice = (priceStr) => {
    if (!priceStr) return null;
    priceStr = priceStr.trim();
    if (!priceStr || priceStr.toLowerCase().includes('free')) return 'Free';
    return priceStr;
};

const cleanText = (text) => {
    if (!text) return null;
    return text.replace(/\s+/g, ' ').trim();
};

const extractGameData = ($, url) => {
    try {
        // General Info
        const title = $('#appHubAppName').text().trim();
        if (!title) return null; // Skip non-game pages

        const description = $('.game_description_snippet').text().trim();
        const headerImage = $('.game_header_image_full').attr('src');
        const releaseDate = $('.release_date').find('.date').text().trim();

        // Reviews
        const reviewElements = $('.game_review_summary');
        const recentReviews = reviewElements.first().text().trim();
        const allReviews = reviewElements.last().text().trim();

        // Company info
        const developers = $('#developers_list a')
            .map((_, el) => $(el).text().trim())
            .get();
        
        const publisherEl = $('.game_area_purchase_game').find('.dev_row').last();
        const publishers = publisherEl
            .find('.summary a')
            .map((_, el) => $(el).text().trim())
            .get();

        // Status
        const comingSoon = $('.game_area_comingsoon').first().text().trim() !== '';
        const earlyAccess = $('#earlyAccessHeader').text().trim() !== '';

        // Platforms
        const platformsEl = $('.game_area_purchase_platform span');
        const supportedPlatforms = [];
        
        if (platformsEl.filter('[class*="win"]').length) supportedPlatforms.push('windows');
        if (platformsEl.filter('[class*="linux"]').length) supportedPlatforms.push('linux');
        if (platformsEl.filter('[class*="mac"]').length) supportedPlatforms.push('mac');
        if (platformsEl.filter('[class*="vr_required"]').length) supportedPlatforms.push('vr_required');

        // Genres
        const genres = $('#genresAndManufacturer span')
            .first()
            .find('a')
            .map((_, el) => $(el).text().trim())
            .get();

        // Features
        const features = $('.game_area_features_list_ctn a')
            .map((_, el) => $(el).text().trim())
            .get();

        // Popular tags
        const popularTags = $('.popular_tags a')
            .map((_, el) => $(el).text().trim())
            .get();

        // Languages
        const languages = {};
        $('#languageTable table tr').each((_, row) => {
            const $row = $(row);
            if ($row.find('th').text() || $row.hasClass('unsupported')) return;
            
            const languageName = $row.find('td').first().text().trim();
            if (languageName) {
                const tds = $row.find('td');
                languages[languageName] = {
                    interface: tds.eq(1).text().trim() === '✔',
                    sound: tds.eq(2).text().trim() === '✔',
                    subtitles: tds.eq(3).text().trim() === '✔',
                };
            }
        });

        // Price & Sales
        let gameAreaPurchaseEl = $('div[id^=game_area_purchase_section_add_to_cart]').first();
        if (!gameAreaPurchaseEl.length || gameAreaPurchaseEl.text().trim() === '') {
            gameAreaPurchaseEl = $('.game_area_purchase_game').first();
        }

        let price = gameAreaPurchaseEl.find('.game_purchase_price').text().trim();
        let sale = false;
        let salePercentage = null;
        let saleUntil = null;

        if (!price) {
            sale = true;
            salePercentage = gameAreaPurchaseEl.find('.discount_pct').text().trim();
            saleUntil = gameAreaPurchaseEl.find('.game_purchase_discount_countdown').text().trim();
            price = gameAreaPurchaseEl.find('.discount_final_price').text().trim();
        }

        // DLC Info
        let isDLC = false;
        let baseDLCGame = null;
        if (features.includes('DLC') || features.includes('Downloadable Content')) {
            isDLC = true;
            baseDLCGame = $('#gameHeaderImageCtn')
                .parent()
                .find('.glance_details p a')
                .attr('href') || null;
        }

        // System Requirements
        const systemRequirements = {};
        $('.game_area_sys_req_leftCol').each((_, el) => {
            const $el = $(el);
            const platform = $el.find('.sysreq_tab').text().trim().toLowerCase() || 'windows';
            const reqsText = $el
                .find('.game_area_sys_req_full')
                .text()
                .trim();
            if (reqsText) systemRequirements[platform] = reqsText;
        });

        return {
            url,
            appId: url.match(/\/app\/(\d+)\//)?.[1] || null,
            title,
            description,
            headerImage,
            releaseDate,
            comingSoon,
            earlyAccess,
            supportedPlatforms,
            features,
            genres,
            popularTags,
            languages,
            price: parsePrice(price),
            sale,
            salePercentage,
            saleUntil,
            recentReviews,
            allReviews,
            isDLC,
            baseDLCGame,
            systemRequirements,
            developers,
            publishers,
            scrapedAt: new Date().toISOString(),
        };
    } catch (error) {
        log.warning(`Error extracting game data from ${url}: ${error.message}`);
        return null;
    }
};

const STEAM_SEARCH_API = 'https://store.steampowered.com/search/results/';
const STEAM_APP_DETAILS_API = 'https://store.steampowered.com/api/appdetails';
const STEAM_STORE_BASE = 'https://store.steampowered.com';

const DEFAULT_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
};

// Main actor
await Actor.init();

try {
    const input = (await Actor.getInput()) || {};
    const {
        startUrl,
        keyword,
        sortBy = '_ASC',
        maxResults = 100,
        maxPages = 5,
        maxConcurrency = 10,
        onlyOnSale = false,
        onlyReleased = true,
        proxyConfiguration,
    } = input;

    log.info('🎮 Steam Store Scraper Started');
    log.info(`⚙️  Configuration: maxResults=${maxResults}, maxPages=${maxPages}, maxConcurrency=${maxConcurrency}`);
    if (keyword) log.info(`🔍 Keyword: ${keyword}`);

    const resultsWanted = Math.max(1, Math.min(5000, Number(maxResults) || 100));
    const maxPagesToProcess = Math.max(1, Math.min(200, Number(maxPages) || 5));
    const concurrency = Math.max(1, Math.min(50, Number(maxConcurrency) || 10));
    const proxyConf = proxyConfiguration ? await Actor.createProxyConfiguration({ ...proxyConfiguration }) : undefined;

    // Build search URL
    let searchUrl = startUrl;
    if (!searchUrl) {
        const params = new URLSearchParams({
            sort_by: sortBy,
            supportedlang: 'english',
        });
        if (keyword) params.set('term', keyword);
        searchUrl = `${STEAM_SEARCH}?${params.toString()}`;
    }

    const requestQueue = await Actor.openRequestQueue();
    let gameCount = 0;
    const seenAppIds = new Set();
    const stats = {
        totalProcessed: 0,
        gamesSaved: 0,
        errors: 0,
        pagesProcessed: 0,
    };

    const startTime = Date.now();
    const MAX_RUNTIME_MS = 4.5 * 60 * 1000; // 4.5 minutes

    // Initial search request
    await requestQueue.addRequest({
        url: searchUrl,
        userData: {
            label: 'SEARCH',
            page: 1,
            isFirstPage: true,
        },
    });

    const crawler = new CheerioCrawler({
        requestQueue,
        maxConcurrency: concurrency,
        useSessionPool: true,
        
        preNavigationHooks: [
            async (_crawlingContext, requestAsBrowserOptions) => {
                // Stealthy headers to avoid age check and blocking
                requestAsBrowserOptions.headers = {
                    ...requestAsBrowserOptions.headers,
                    'Cookie': 'birthtime=0; path=/; max-age=315360000',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9',
                };
            },
        ],

        handlePageFunction: async ({ $, request }) => {
            // Timeout safety check
            const elapsed = Date.now() - startTime;
            if (elapsed > MAX_RUNTIME_MS) {
                log.info(`⏱️  Timeout safety triggered at ${(elapsed / 1000).toFixed(0)}s`);
                await Actor.setValue('TIMEOUT_REACHED', true);
                return;
            }

            const { label, page, isFirstPage } = request.userData;

            if (label === 'SEARCH') {
                // Enqueue game pages
                const gameLinks = $('a[href*="/app/"]')
                    .map((_, el) => {
                        const href = $(el).attr('href');
                        if (href && href.includes('/app/') && !href.includes('/bundle/')) {
                            return new URL(href, STEAM_STORE).href;
                        }
                        return null;
                    })
                    .get()
                    .filter(Boolean);

                log.info(`📄 Page ${page}: Found ${gameLinks.length} game links`);
                stats.pagesProcessed = page;

                for (const link of gameLinks) {
                    if (gameCount >= resultsWanted) break;
                    
                    const appId = link.match(/\/app\/(\d+)\//)?.[1];
                    if (appId && !seenAppIds.has(appId)) {
                        seenAppIds.add(appId);
                        await requestQueue.addRequest({
                            url: link,
                            userData: { label: 'GAME' },
                        });
                    }
                }

                // Paginate if needed
                if (gameCount < resultsWanted && page < maxPagesToProcess) {
                    const nextPageUrl = new URL(searchUrl);
                    nextPageUrl.searchParams.set('page', (page + 1).toString());
                    
                    await requestQueue.addRequest({
                        url: nextPageUrl.toString(),
                        userData: {
                            label: 'SEARCH',
                            page: page + 1,
                        },
                    });
                }
            } else if (label === 'GAME') {
                // Extract game details
                stats.totalProcessed++;
                
                if (gameCount >= resultsWanted) return;

                const gameData = extractGameData($, request.url);
                if (!gameData) return;

                // Apply filters
                if (onlyOnSale && !gameData.sale) return;
                if (onlyReleased && gameData.comingSoon) return;

                await Actor.pushData(gameData);
                gameCount++;
                stats.gamesSaved = gameCount;

                if (gameCount % 10 === 0) {
                    const elapsedSec = (Date.now() - startTime) / 1000;
                    log.info(`⚡ Progress: ${gameCount}/${resultsWanted} games | ${elapsedSec.toFixed(1)}s | ${(gameCount / elapsedSec).toFixed(2)} games/sec`);
                }

                if (gameCount === 1) {
                    log.info(`✅ First game saved! Continuing...`);
                }
            }
        },

        errorHandler: async ({ request, error }) => {
            stats.errors++;
            log.warning(`Error on ${request.url}: ${error.message}`);
        },
    });

    await crawler.run();

    const totalTime = (Date.now() - startTime) / 1000;

    // Final Report
    log.info('='.repeat(70));
    log.info('📊 STEAM STORE SCRAPER - RUN STATISTICS');
    log.info('='.repeat(70));
    log.info(`🎮 Games scraped: ${gameCount}/${resultsWanted}`);
    log.info(`📄 Pages processed: ${stats.pagesProcessed}/${maxPagesToProcess}`);
    log.info(`📋 Total processed: ${stats.totalProcessed}`);
    log.info(`⚠️  Errors: ${stats.errors}`);
    log.info(`⏱️  Runtime: ${totalTime.toFixed(2)}s`);
    log.info(`⚡ Performance: ${(gameCount / totalTime).toFixed(2)} games/second`);
    log.info('='.repeat(70));

    if (gameCount === 0) {
        const errorMsg = 'No games scraped. Check your search parameters or try a different query.';
        log.error(`❌ ${errorMsg}`);
        await Actor.fail(errorMsg);
    } else {
        log.info(`✅ SUCCESS: Scraped ${gameCount} game(s) from Steam Store`);
        await Actor.setValue('OUTPUT_SUMMARY', {
            gamesScrapped: gameCount,
            pagesProcessed: stats.pagesProcessed,
            runtime: totalTime,
            success: true,
        });
    }
} catch (error) {
    log.error(`❌ CRITICAL ERROR: ${error.message}`);
    log.exception(error, 'Actor failed with exception');
    throw error;
} finally {
    await Actor.exit();
}

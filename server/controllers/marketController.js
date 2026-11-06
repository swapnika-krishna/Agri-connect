const axios = require('axios');
const NodeCache = require('node-cache');

// Initialize cache with 1 hour TTL (3600s)
const marketCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

// Realistic benchmark fallback dataset
const SAMPLE_MANDI_PRICES = [
  {
    id: 'mandi_1',
    state: 'Punjab',
    district: 'Ludhiana',
    market: 'Ludhiana (New Grain Market)',
    commodity: 'Wheat',
    variety: 'HD-2967 (Sharbati)',
    arrivalDate: '2026-11-04',
    minPrice: 2275,
    maxPrice: 2580,
    modalPrice: 2450,
  },
  {
    id: 'mandi_2',
    state: 'Punjab',
    district: 'Ludhiana',
    market: 'Khanna Mandi (Asia Largest)',
    commodity: 'Wheat',
    variety: 'PBW-550',
    arrivalDate: '2026-11-04',
    minPrice: 2320,
    maxPrice: 2650,
    modalPrice: 2510,
  },
  {
    id: 'mandi_3',
    state: 'Punjab',
    district: 'Patiala',
    market: 'Patiala Mandi',
    commodity: 'Paddy (Basmati)',
    variety: 'Pusa 1121',
    arrivalDate: '2026-11-04',
    minPrice: 3800,
    maxPrice: 4350,
    modalPrice: 4120,
  },
  {
    id: 'mandi_4',
    state: 'Maharashtra',
    district: 'Nashik',
    market: 'Lasalgaon Mandi (Asia Largest Onion)',
    commodity: 'Onion',
    variety: 'Red Onion (Gavran)',
    arrivalDate: '2026-11-04',
    minPrice: 2150,
    maxPrice: 3200,
    modalPrice: 2850,
  },
  {
    id: 'mandi_5',
    state: 'Maharashtra',
    district: 'Nashik',
    market: 'Pimpalgaon Baswant',
    commodity: 'Tomato',
    variety: 'Hybrid (Vaishnavi)',
    arrivalDate: '2026-11-04',
    minPrice: 1400,
    maxPrice: 2100,
    modalPrice: 1850,
  },
  {
    id: 'mandi_6',
    state: 'Maharashtra',
    district: 'Pune',
    market: 'Pune APMC Gultekdi',
    commodity: 'Sugarcane',
    variety: 'Co-86032',
    arrivalDate: '2026-11-04',
    minPrice: 310,
    maxPrice: 360,
    modalPrice: 340,
  },
  {
    id: 'mandi_7',
    state: 'Gujarat',
    district: 'Rajkot',
    market: 'Rajkot APMC',
    commodity: 'Cotton',
    variety: 'Shankar-6 (Bt Cotton)',
    arrivalDate: '2026-11-04',
    minPrice: 7100,
    maxPrice: 7950,
    modalPrice: 7600,
  },
  {
    id: 'mandi_8',
    state: 'Gujarat',
    district: 'Junagadh',
    market: 'Junagadh Mandi',
    commodity: 'Groundnut',
    variety: 'GG-20 Pods',
    arrivalDate: '2026-11-04',
    minPrice: 5800,
    maxPrice: 6650,
    modalPrice: 6300,
  },
  {
    id: 'mandi_9',
    state: 'Madhya Pradesh',
    district: 'Indore',
    market: 'Indore Chhoithram Mandi',
    commodity: 'Soybean',
    variety: 'Yellow JS-9560',
    arrivalDate: '2026-11-04',
    minPrice: 4200,
    maxPrice: 4850,
    modalPrice: 4620,
  },
  {
    id: 'mandi_10',
    state: 'Madhya Pradesh',
    district: 'Indore',
    market: 'Indore Chhoithram Mandi',
    commodity: 'Potato',
    variety: 'Jyoti / Kufri Lauvkar',
    arrivalDate: '2026-11-04',
    minPrice: 1200,
    maxPrice: 1750,
    modalPrice: 1520,
  },
  {
    id: 'mandi_11',
    state: 'Rajasthan',
    district: 'Sri Ganganagar',
    market: 'Sri Ganganagar Mandi',
    commodity: 'Mustard',
    variety: 'Pusa Bold / Black Mustard',
    arrivalDate: '2026-11-04',
    minPrice: 5400,
    maxPrice: 6150,
    modalPrice: 5850,
  },
  {
    id: 'mandi_12',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    market: 'Guntur Mirchi Yard',
    commodity: 'Chilli',
    variety: 'Teja S17 (Dry Red)',
    arrivalDate: '2026-11-04',
    minPrice: 18500,
    maxPrice: 22400,
    modalPrice: 20800,
  },
  {
    id: 'mandi_13',
    state: 'Karnataka',
    district: 'Kolar',
    market: 'Kolar Tomato Market',
    commodity: 'Tomato',
    variety: 'Abhinav Hybrid',
    arrivalDate: '2026-11-04',
    minPrice: 1350,
    maxPrice: 1980,
    modalPrice: 1720,
  },
  {
    id: 'mandi_14',
    state: 'Uttar Pradesh',
    district: 'Agra',
    market: 'Agra Mandi',
    commodity: 'Potato',
    variety: 'Kufri Bahar',
    arrivalDate: '2026-11-04',
    minPrice: 1100,
    maxPrice: 1620,
    modalPrice: 1410,
  },
  {
    id: 'mandi_15',
    state: 'Bihar',
    district: 'Patna',
    market: 'Patna Musallahpur Mandi',
    commodity: 'Rice / Paddy',
    variety: 'Common Katarni',
    arrivalDate: '2026-11-04',
    minPrice: 2180,
    maxPrice: 2600,
    modalPrice: 2420,
  },
];

/**
 * @desc    Get APMC Mandi commodity rates (proxies data.gov.in with 1h cache & fallback)
 * @route   GET /api/market
 * @access  Public
 */
exports.getPrices = async (req, res, next) => {
  try {
    const { state, district, market, commodity, search } = req.query;
    const cacheKey = `mandi_${state || 'all'}_${district || 'all'}_${commodity || 'all'}`;

    let prices = marketCache.get(cacheKey);
    let isSampleData = false;

    if (!prices) {
      const apiKey = process.env.AGMARKET_API_KEY;

      if (apiKey && apiKey !== 'your_datagov_in_api_key_here') {
        try {
          const apiURL = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&limit=50`;
          const apiRes = await axios.get(apiURL, { timeout: 6000 });
          if (apiRes.data && apiRes.data.records) {
            prices = apiRes.data.records.map((r, i) => ({
              id: `api_${i}`,
              state: r.state || '',
              district: r.district || '',
              market: r.market || '',
              commodity: r.commodity || '',
              variety: r.variety || '',
              arrivalDate: r.arrival_date || new Date().toISOString().split('T')[0],
              minPrice: parseFloat(r.min_price) || 0,
              maxPrice: parseFloat(r.max_price) || 0,
              modalPrice: parseFloat(r.modal_price) || 0,
            }));
            marketCache.set(cacheKey, prices);
          }
        } catch (err) {
          console.warn('[AgriConnect Mandi API Error]:', err.message);
        }
      }

      if (!prices) {
        prices = SAMPLE_MANDI_PRICES;
        isSampleData = true;
      }
    }

    // Apply filtering
    let filtered = [...prices];
    if (state && state !== 'All') {
      filtered = filtered.filter((p) => p.state.toLowerCase() === state.toLowerCase());
    }
    if (district && district !== 'All') {
      filtered = filtered.filter((p) => p.district.toLowerCase() === district.toLowerCase());
    }
    if (market && market !== 'All') {
      filtered = filtered.filter((p) => p.market.toLowerCase().includes(market.toLowerCase()));
    }
    if (commodity && commodity !== 'All') {
      filtered = filtered.filter((p) => p.commodity.toLowerCase() === commodity.toLowerCase());
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.commodity.toLowerCase().includes(s) ||
          p.market.toLowerCase().includes(s) ||
          p.variety.toLowerCase().includes(s) ||
          p.state.toLowerCase().includes(s)
      );
    }

    res.status(200).json({
      success: true,
      count: filtered.length,
      isSampleData,
      data: filtered,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get distinct filter options for states and commodities
 * @route   GET /api/market/filters
 * @access  Public
 */
exports.getFilters = async (req, res, next) => {
  try {
    const states = Array.from(new Set(SAMPLE_MANDI_PRICES.map((p) => p.state))).sort();
    const commodities = Array.from(new Set(SAMPLE_MANDI_PRICES.map((p) => p.commodity))).sort();
    const markets = Array.from(new Set(SAMPLE_MANDI_PRICES.map((p) => p.market))).sort();

    res.status(200).json({
      success: true,
      states,
      commodities,
      markets,
    });
  } catch (error) {
    next(error);
  }
};

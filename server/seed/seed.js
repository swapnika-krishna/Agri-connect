const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Load models
const User = require('../models/User');
const Farm = require('../models/Farm');
const Activity = require('../models/Activity');
const Crop = require('../models/Crop');
const Query = require('../models/Query');
const Reply = require('../models/Reply');
const Notification = require('../models/Notification');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/agriconnect';
    await mongoose.connect(mongoUri);
    console.log('[AgriConnect Seeder]: Connected to MongoDB...');

    // Clear existing data
    await User.deleteMany();
    await Farm.deleteMany();
    await Activity.deleteMany();
    await Crop.deleteMany();
    await Query.deleteMany();
    await Reply.deleteMany();
    await Notification.deleteMany();
    console.log('[AgriConnect Seeder]: Cleared existing collections.');

    // 1. Create Users (1 Admin, 2 Experts, 3 Farmers)
    // Note: User pre-save hook handles bcrypt hashing
    const admin = await User.create({
      name: 'Dr. Virendra Kumar (Director)',
      email: 'admin@agriconnect.org',
      password: 'password123',
      role: 'admin',
      phone: '+91 98123 45678',
      state: 'Delhi',
      district: 'New Delhi',
      isActive: true,
    });

    const expert1 = await User.create({
      name: 'Dr. Ramesh Chandra Sharma',
      email: 'dr.sharma@agriconnect.org',
      password: 'password123',
      role: 'expert',
      phone: '+91 94140 12345',
      state: 'Punjab',
      district: 'Ludhiana',
      isActive: true,
      isApproved: true,
      expertise: ['Crop Disease', 'Pest Control', 'Fertilizer'],
    });

    const expert2 = await User.create({
      name: 'Dr. Priya Patel (Agronomist)',
      email: 'priya.patel@agriconnect.org',
      password: 'password123',
      role: 'expert',
      phone: '+91 98250 67890',
      state: 'Gujarat',
      district: 'Anand',
      isActive: true,
      isApproved: true,
      expertise: ['Soil', 'Irrigation', 'Market'],
    });

    const farmer1 = await User.create({
      name: 'Gurpreet Singh',
      email: 'gurpreet.singh@agriconnect.org',
      password: 'password123',
      role: 'farmer',
      phone: '+91 98765 43210',
      state: 'Punjab',
      district: 'Ludhiana',
      isActive: true,
    });

    const farmer2 = await User.create({
      name: 'Suresh Patil',
      email: 'suresh.patil@agriconnect.org',
      password: 'password123',
      role: 'farmer',
      phone: '+91 99220 11223',
      state: 'Maharashtra',
      district: 'Nashik',
      isActive: true,
    });

    const farmer3 = await User.create({
      name: 'Anita Devi',
      email: 'anita.devi@agriconnect.org',
      password: 'password123',
      role: 'farmer',
      phone: '+91 94312 98765',
      state: 'Bihar',
      district: 'Patna',
      isActive: true,
    });

    console.log('[AgriConnect Seeder]: Users seeded (1 Admin, 2 Experts, 3 Farmers).');

    // 2. Create Farms
    const farm1 = await Farm.create({
      owner: farmer1._id,
      name: 'Guru Nanak Agro Farm',
      state: 'Punjab',
      district: 'Ludhiana',
      latitude: 30.901,
      longitude: 75.8573,
      sizeInAcres: 12.5,
      soilType: 'Alluvial',
      waterSource: 'Borewell',
      currentCrops: ['Wheat', 'Mustard'],
    });

    const farm2 = await Farm.create({
      owner: farmer1._id,
      name: 'Satluj Green Valley Plot',
      state: 'Punjab',
      district: 'Ludhiana',
      latitude: 30.942,
      longitude: 75.892,
      sizeInAcres: 6.0,
      soilType: 'Loamy',
      waterSource: 'Canal',
      currentCrops: ['Potato', 'Maize'],
    });

    const farm3 = await Farm.create({
      owner: farmer2._id,
      name: 'Godavari Vineyard & Onion Estate',
      state: 'Maharashtra',
      district: 'Nashik',
      latitude: 19.9975,
      longitude: 73.7898,
      sizeInAcres: 8.0,
      soilType: 'Black',
      waterSource: 'River',
      currentCrops: ['Onion', 'Tomato', 'Sugarcane'],
    });

    const farm4 = await Farm.create({
      owner: farmer3._id,
      name: 'Ganga Kripa Krishi Farm',
      state: 'Bihar',
      district: 'Patna',
      latitude: 25.5941,
      longitude: 85.1376,
      sizeInAcres: 5.5,
      soilType: 'Alluvial',
      waterSource: 'Rainfed',
      currentCrops: ['Rice', 'Lentil'],
    });

    console.log('[AgriConnect Seeder]: Sample farms seeded.');

    // 3. Create Activities
    await Activity.create([
      {
        farm: farm1._id,
        owner: farmer1._id,
        type: 'Sowing',
        date: '2026-10-25',
        notes: 'Sowed HD-2967 certified high-yield wheat variety with tractor seed drill.',
        cost: 14500,
      },
      {
        farm: farm1._id,
        owner: farmer1._id,
        type: 'Fertilizer',
        date: '2026-11-01',
        notes: 'Applied basal dose of DAP (50kg/acre) and Zinc Sulphate prior to first irrigation.',
        cost: 9200,
      },
      {
        farm: farm1._id,
        owner: farmer1._id,
        type: 'Irrigation',
        date: '2026-11-03',
        notes: 'Crown root initiation stage (CRI) first irrigation run via borewell.',
        cost: 1800,
      },
      {
        farm: farm3._id,
        owner: farmer2._id,
        type: 'Pesticide',
        date: '2026-11-02',
        notes: 'Foliar spray of neem extract and Mancozeb against early purple blotch on onions.',
        cost: 3200,
      },
    ]);
    console.log('[AgriConnect Seeder]: Sample farm activities seeded.');

    // 4. Create 22+ Crops with realistic Indian agronomic parameters
    const cropsCatalog = [
      {
        name: 'Wheat (Gehun)',
        soilTypes: ['Alluvial', 'Loamy', 'Clay'],
        seasons: ['Rabi'],
        minRainfall: 400,
        maxRainfall: 850,
        minTemp: 10,
        maxTemp: 25,
        minPh: 6.0,
        maxPh: 7.5,
        durationDays: 130,
        description: 'Premier staple food crop across Indo-Gangetic plains. Thrives in cool growing conditions with moderate winter moisture.',
        tips: 'Ensure critical irrigation at Crown Root Initiation (20-25 days after sowing). Avoid nitrogen over-application near heading.',
      },
      {
        name: 'Rice / Paddy (Dhan)',
        soilTypes: ['Clay', 'Alluvial', 'Loamy'],
        seasons: ['Kharif'],
        minRainfall: 900,
        maxRainfall: 2000,
        minTemp: 20,
        maxTemp: 37,
        minPh: 5.5,
        maxPh: 7.2,
        durationDays: 140,
        description: 'Major Kharif cereal requiring standing water and warm, humid tropical conditions during active vegetative growth.',
        tips: 'Adopt alternate wetting and drying (AWD) water management to save 25% irrigation water without yield penalty.',
      },
      {
        name: 'Cotton (Kapas)',
        soilTypes: ['Black', 'Alluvial'],
        seasons: ['Kharif'],
        minRainfall: 500,
        maxRainfall: 1100,
        minTemp: 21,
        maxTemp: 35,
        minPh: 6.0,
        maxPh: 8.0,
        durationDays: 170,
        description: 'Major commercial fiber crop well-suited to deep moisture-retentive black cotton soils (regur) of Maharashtra & Gujarat.',
        tips: 'Install yellow sticky traps for whitefly; monitor pink bollworm via pheromone traps from 45 days after sowing.',
      },
      {
        name: 'Sugarcane (Ganna)',
        soilTypes: ['Alluvial', 'Black', 'Loamy'],
        seasons: ['Kharif', 'Zaid'],
        minRainfall: 750,
        maxRainfall: 1600,
        minTemp: 20,
        maxTemp: 38,
        minPh: 6.5,
        maxPh: 8.0,
        durationDays: 330,
        description: 'High-biomass perennial sugar crop requiring deep well-drained fertile soils and assured perennial irrigation.',
        tips: 'Use trash mulching between rows to conserve moisture and suppress weeds during early canopy establishment.',
      },
      {
        name: 'Mustard (Sarson)',
        soilTypes: ['Alluvial', 'Sandy', 'Loamy'],
        seasons: ['Rabi'],
        minRainfall: 250,
        maxRainfall: 500,
        minTemp: 10,
        maxTemp: 26,
        minPh: 6.0,
        maxPh: 7.8,
        durationDays: 105,
        description: 'High-oil content Rabi oilseed with low water requirement, excellent cold tolerance, and high market liquidity.',
        tips: 'Spray sulphur @ 20-30 kg/ha to boost oil percentage and prevent aphid outbreaks during flowering.',
      },
      {
        name: 'Maize (Makka)',
        soilTypes: ['Alluvial', 'Loamy', 'Red'],
        seasons: ['Kharif', 'Rabi', 'Zaid'],
        minRainfall: 500,
        maxRainfall: 950,
        minTemp: 18,
        maxTemp: 34,
        minPh: 5.8,
        maxPh: 7.5,
        durationDays: 100,
        description: 'Versatile cereal known as the "Queen of Cereals" with wide adaptability across seasons for grain, poultry feed, and silage.',
        tips: 'Watch for Fall Armyworm (FAW); apply whorl treatment with Emamectin Benzoate if egg masses appear.',
      },
      {
        name: 'Soybean',
        soilTypes: ['Black', 'Loamy', 'Alluvial'],
        seasons: ['Kharif'],
        minRainfall: 600,
        maxRainfall: 1000,
        minTemp: 20,
        maxTemp: 32,
        minPh: 6.0,
        maxPh: 7.5,
        durationDays: 105,
        description: 'Major protein and edible oil crop prominent in central India (Madhya Pradesh & Maharashtra). Enriches soil nitrogen.',
        tips: 'Inoculate seeds with Rhizobium and PSB cultures prior to sowing to ensure vigorous root nodulation.',
      },
      {
        name: 'Chickpea / Bengal Gram (Chana)',
        soilTypes: ['Black', 'Loamy', 'Sandy'],
        seasons: ['Rabi'],
        minRainfall: 350,
        maxRainfall: 700,
        minTemp: 12,
        maxTemp: 28,
        minPh: 6.0,
        maxPh: 8.0,
        durationDays: 115,
        description: 'Leading winter pulse crop requiring residual moisture; highly drought hardy and effective in crop rotation.',
        tips: 'Practice apical pinching (nipping) at 30-35 days to encourage dense secondary branching and pod formation.',
      },
      {
        name: 'Groundnut / Peanut (Mungphali)',
        soilTypes: ['Sandy', 'Red', 'Loamy'],
        seasons: ['Kharif', 'Zaid'],
        minRainfall: 450,
        maxRainfall: 850,
        minTemp: 22,
        maxTemp: 35,
        minPh: 5.8,
        maxPh: 7.2,
        durationDays: 120,
        description: 'High-value subterranean legume requiring friable loose sandy-loam soils for easy peg penetration.',
        tips: 'Apply Gypsum (200 kg/acre) at flowering stage to ensure high pod filling and prevent empty pods.',
      },
      {
        name: 'Tomato (Tamatar)',
        soilTypes: ['Loamy', 'Alluvial', 'Red', 'Black'],
        seasons: ['Kharif', 'Rabi', 'Zaid'],
        minRainfall: 400,
        maxRainfall: 900,
        minTemp: 16,
        maxTemp: 32,
        minPh: 6.0,
        maxPh: 7.0,
        durationDays: 95,
        description: 'High-return commercial vegetable suitable for year-round cultivation under proper irrigation and staking.',
        tips: 'Use silver-black plastic mulching and drip fertigation to curb blossom-end rot and reduce weed competition.',
      },
      {
        name: 'Onion (Pyaz)',
        soilTypes: ['Loamy', 'Alluvial', 'Black'],
        seasons: ['Kharif', 'Rabi', 'Zaid'],
        minRainfall: 350,
        maxRainfall: 750,
        minTemp: 13,
        maxTemp: 30,
        minPh: 6.2,
        maxPh: 7.4,
        durationDays: 120,
        description: 'High-demand cash crop bulb with robust domestic consumption and export potential from Nashik, Pune & Indore belts.',
        tips: 'Withhold irrigation 10-14 days before harvest to prevent bulb rot and ensure prolonged post-harvest storage shelf-life.',
      },
      {
        name: 'Potato (Aloo)',
        soilTypes: ['Alluvial', 'Sandy', 'Loamy'],
        seasons: ['Rabi'],
        minRainfall: 350,
        maxRainfall: 650,
        minTemp: 12,
        maxTemp: 24,
        minPh: 5.2,
        maxPh: 6.8,
        durationDays: 90,
        description: 'Short duration, tuberous staple producing exceptional caloric yield per unit area in winter months.',
        tips: 'Earth-up ridges properly at 30 days to prevent sunlight from turning tubers green and solanine-rich.',
      },
      {
        name: 'Chilli / Red Pepper (Mirch)',
        soilTypes: ['Black', 'Loamy', 'Red'],
        seasons: ['Kharif', 'Rabi'],
        minRainfall: 450,
        maxRainfall: 1000,
        minTemp: 18,
        maxTemp: 35,
        minPh: 6.0,
        maxPh: 7.5,
        durationDays: 150,
        description: 'High-value spice with massive domestic demand in Andhra Pradesh (Guntur), Karnataka, and Telangana.',
        tips: 'Spray micronutrient mixture containing Boron and Zinc during flowering to minimize flower drop and enhance pungency.',
      },
      {
        name: 'Pigeon Pea / Arhar / Tur Dal',
        soilTypes: ['Black', 'Alluvial', 'Red', 'Loamy'],
        seasons: ['Kharif'],
        minRainfall: 500,
        maxRainfall: 950,
        minTemp: 20,
        maxTemp: 36,
        minPh: 6.2,
        maxPh: 7.8,
        durationDays: 180,
        description: 'Deep-rooted drought-resilient Kharif pulse providing essential dietary protein and soil nitrogen fixation.',
        tips: 'Adopt broad bed furrow (BBF) planting to prevent collar rot during heavy monsoonal rain spells.',
      },
      {
        name: 'Bajra / Pearl Millet',
        soilTypes: ['Sandy', 'Red', 'Loamy'],
        seasons: ['Kharif'],
        minRainfall: 200,
        maxRainfall: 600,
        minTemp: 24,
        maxTemp: 40,
        minPh: 6.5,
        maxPh: 8.5,
        durationDays: 85,
        description: 'Nutri-cereal offering extreme heat and drought tolerance. Thrives in arid sandy belts of Rajasthan & Haryana.',
        tips: 'Requires minimal inputs; highly responsive to a single top-dress of nitrogen after the first shower.',
      },
      {
        name: 'Jowar / Sorghum',
        soilTypes: ['Black', 'Alluvial', 'Loamy'],
        seasons: ['Kharif', 'Rabi'],
        minRainfall: 350,
        maxRainfall: 750,
        minTemp: 20,
        maxTemp: 37,
        minPh: 6.0,
        maxPh: 8.2,
        durationDays: 110,
        description: 'Dual-purpose grain and forage crop that performs reliably under erratic rainfall regimes in peninsular India.',
        tips: 'Harvest at physiological maturity for optimal grain quality and nutritious green stover.',
      },
      {
        name: 'Turmeric (Haldi)',
        soilTypes: ['Loamy', 'Alluvial', 'Red'],
        seasons: ['Kharif'],
        minRainfall: 1000,
        maxRainfall: 1800,
        minTemp: 20,
        maxTemp: 34,
        minPh: 5.8,
        maxPh: 7.2,
        durationDays: 240,
        description: 'Valued spice and medicinal rhizome requiring fertile well-aerated soils and moderate shade tolerance.',
        tips: 'Mulch heavily with green leaves (15 t/ha) immediately after planting to protect rhizomes from dehydration.',
      },
      {
        name: 'Ginger (Adrak)',
        soilTypes: ['Loamy', 'Laterite', 'Red'],
        seasons: ['Kharif'],
        minRainfall: 1200,
        maxRainfall: 2000,
        minTemp: 19,
        maxTemp: 32,
        minPh: 5.5,
        maxPh: 6.8,
        durationDays: 230,
        description: 'High-margin spice demanding humid subtropical climes with well-drained organic loam free from water stagnation.',
        tips: 'Treat seed rhizomes with Trichoderma viride to prevent bacterial soft rot.',
      },
      {
        name: 'Garlic (Lahsun)',
        soilTypes: ['Loamy', 'Alluvial', 'Clay'],
        seasons: ['Rabi'],
        minRainfall: 300,
        maxRainfall: 600,
        minTemp: 12,
        maxTemp: 26,
        minPh: 6.0,
        maxPh: 7.5,
        durationDays: 130,
        description: 'Rabi spice bulb with steady domestic market demand in Madhya Pradesh, Rajasthan, and Gujarat.',
        tips: 'Plant only healthy plump outer cloves; avoid deep sowing to ensure symmetrical multi-clove development.',
      },
      {
        name: 'Cauliflower (Phoolgobhi)',
        soilTypes: ['Loamy', 'Alluvial', 'Sandy'],
        seasons: ['Rabi'],
        minRainfall: 350,
        maxRainfall: 700,
        minTemp: 14,
        maxTemp: 24,
        minPh: 6.0,
        maxPh: 7.0,
        durationDays: 75,
        description: 'Fast-maturing cool season brassica vegetable. Requires balanced irrigation and strict pest control.',
        tips: 'Practice blanching (tying outer leaves over curd) 4-5 days before harvest to keep the curd pristine white.',
      },
      {
        name: 'Okra / Ladyfinger (Bhindi)',
        soilTypes: ['Loamy', 'Alluvial', 'Sandy'],
        seasons: ['Kharif', 'Zaid'],
        minRainfall: 450,
        maxRainfall: 900,
        minTemp: 22,
        maxTemp: 36,
        minPh: 6.0,
        maxPh: 7.6,
        durationDays: 65,
        description: 'Rapid-yielding warm-season vegetable giving harvest flushes every 2-3 days for sustained cash flow.',
        tips: 'Select Yellow Vein Mosaic Virus resistant hybrids like Arka Anamika.',
      },
      {
        name: 'Barley (Jau)',
        soilTypes: ['Sandy', 'Alluvial', 'Loamy'],
        seasons: ['Rabi'],
        minRainfall: 200,
        maxRainfall: 450,
        minTemp: 10,
        maxTemp: 25,
        minPh: 6.5,
        maxPh: 8.5,
        durationDays: 110,
        description: 'Highly salinity and sodicity tolerant cereal with expanding industrial demand for brewing and animal feed.',
        tips: 'Ideal option for saline soils where wheat fails; requires only 2 to 3 light irrigations.',
      },
    ];

    await Crop.insertMany(cropsCatalog);
    console.log(`[AgriConnect Seeder]: ${cropsCatalog.length} Crops seeded with agronomic ranges.`);

    // 5. Create Queries with Replies
    const query1 = await Query.create({
      farmer: farmer1._id,
      farmId: farm1._id,
      title: 'Yellowing of lower leaves and small brown spots on wheat crop',
      description: 'My wheat field was sown 3 weeks ago. Over the past 4 days, the lowest leaves on plot B are turning pale yellow and I noticed tiny elongated spots. First irrigation was completed 3 days ago. Is this nitrogen deficiency or early yellow rust?',
      category: 'Crop Disease',
      status: 'Answered',
    });

    await Reply.create({
      query: query1._id,
      expert: expert1._id,
      message: 'Hello Gurpreet ji. Based on your description right after first irrigation, this is common temporary transient yellowing due to temporary soil saturation (leaching). However, if pustules with yellowish-orange powder appear on rubbing the leaf, it could be Stripe/Yellow Rust. Check the underside: if no powder comes off on your fingers, top-dress 30 kg urea per acre with light sunshine. If powder is present, spray Propiconazole 25% EC (Tilt) @ 1 ml per litre of water immediately.',
    });

    const query2 = await Query.create({
      farmer: farmer2._id,
      farmId: farm3._id,
      title: 'Purple blotch and leaf tip burning in Rabi onion crop',
      description: 'We transplanted onion seedlings 35 days ago. Now noticing water-soaked lesions that turn purplish-brown in the center with yellow halo on outer leaves. Humidity has been high in mornings in Nashik. Please advise best organic and chemical control.',
      category: 'Pest Control',
      status: 'Resolved',
    });

    await Reply.create([
      {
        query: query2._id,
        expert: expert1._id,
        message: 'This is a classic manifestation of Purple Blotch (Alternaria porri), aggravated by high relative morning humidity. Recommended treatment:\n1. Chemical: Spray Difenoconazole 25% EC @ 1 ml/L or Mancozeb 75% WP @ 2.5 g/L mixed with a sticker (Sandovit @ 0.5 ml/L).\n2. Organic: Spray Trichoderma harzianum @ 5 g/L combined with 5% neem seed kernel extract (NSKE).\nAvoid evening overhead sprinkler irrigation.',
      },
      {
        query: query2._id,
        expert: expert2._id,
        message: 'Also ensure proper field drainage. Any water accumulation between raised beds accelerates fungal sporulation.',
      },
    ]);

    const query3 = await Query.create({
      farmer: farmer3._id,
      farmId: farm4._id,
      title: 'Soil test indicates pH 7.9 and low organic carbon. Best amendment before pulse sowing?',
      description: 'We recently tested our alluvial field soil in Patna. Soil pH came out to 7.9 (slightly alkaline) and organic carbon is only 0.38%. We want to sow Lentil (Masur). What organic amendments or biofertilizers should we incorporate?',
      category: 'Soil',
      status: 'Open',
    });

    // 6. Notifications
    await Notification.create([
      {
        user: farmer1._id,
        message: 'Dr. Ramesh Sharma replied to your query: "Yellowing of lower leaves on wheat crop"',
        type: 'query_reply',
        link: `/queries/${query1._id}`,
        isRead: false,
      },
      {
        user: farmer1._id,
        message: 'Weather Alert: 18mm rainfall predicted in Ludhiana over next 48 hours. Postpone pesticide sprays.',
        type: 'weather_alert',
        link: '/weather',
        isRead: false,
      },
      {
        user: expert1._id,
        message: `New Query Assigned: Anita Devi posted "Soil test indicates pH 7.9..." in category Soil.`,
        type: 'query_new',
        link: `/expert/queries/${query3._id}`,
        isRead: false,
      },
    ]);

    console.log('[AgriConnect Seeder]: Queries, replies, and notifications seeded successfully!');
    console.log('\n[DEMO CREDENTIALS]:');
    console.log('Farmer: gurpreet.singh@agriconnect.org / password123');
    console.log('Expert: dr.sharma@agriconnect.org / password123');
    console.log('Admin:  admin@agriconnect.org / password123\n');

    process.exit(0);
  } catch (error) {
    console.error('[AgriConnect Seeder Error]:', error);
    process.exit(1);
  }
};

seedData();

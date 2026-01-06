require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Agent = require('./src/models/Agent');
const Admin = require('./src/models/Admin');
const NGO = require('./src/models/NGO');
const Badge = require('./src/models/Badge');
const CSRCampaign = require('./src/models/CSRCampaign');
const connectDB = require('./src/config/database');

// Connect to database
connectDB();

const seedData = async () => {
  try {
    // Clear existing data (optional - be careful in production!)
    // await User.deleteMany({});
    // await NGO.deleteMany({});
    // await Badge.deleteMany({});
    // await CSRCampaign.deleteMany({});

    console.log('🌱 Seeding database...');

    // Create Admin
    const admin = await Admin.findOne({ email: 'admin@prayas.com' });
    if (!admin) {
      await Admin.create({
        adminId: 'AD-00001',
        email: 'admin@prayas.com',
        password: 'admin123',
      });
      console.log('✅ Admin created: AD-00001 / admin123');
    }

    // Create Test User
    const testUser = await User.findOne({ email: 'user@test.com' });
    if (!testUser) {
      await User.create({
        name: 'Test User',
        email: 'user@test.com',
        phone: '+919888888888',
        password: 'user123',
        role: 'user',
        address: {
          street: '123 Test Street',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
        },
      });
      console.log('✅ Test user created');
    }

    // Create Test Agent
    const testAgent = await Agent.findOne({ email: 'agent@test.com' });
    if (!testAgent) {
      await Agent.create({
        agentId: 'AG-00001',
        name: 'Test Agent',
        email: 'agent@test.com',
        phone: '+919777777777',
        password: 'agent123',
      });
      console.log('✅ Test agent created: AG-00001 / agent123');
    }

    // Create NGOs
    const ngos = [
      {
        name: 'Green Earth Foundation',
        description: 'Working for environmental conservation and sustainability',
        category: 'environment',
        registrationNumber: 'NGO-001',
        verified: true,
        contact: {
          email: 'contact@greenearth.org',
          phone: '+919111111111',
          website: 'https://greenearth.org',
        },
        address: {
          street: 'Eco Street',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
        },
        bankDetails: {
          accountName: 'Green Earth Foundation',
          accountNumber: '1234567890',
          ifscCode: 'BANK0001234',
          bankName: 'State Bank',
        },
        impactStories: [
          {
            title: 'Planting 10,000 Trees',
            description: 'Successfully planted 10,000 trees in urban areas',
            date: new Date(),
          },
        ],
      },
      {
        name: 'Education for All',
        description: 'Providing quality education to underprivileged children',
        category: 'education',
        registrationNumber: 'NGO-002',
        verified: true,
        contact: {
          email: 'info@educationforall.org',
          phone: '+919222222222',
          website: 'https://educationforall.org',
        },
        address: {
          street: 'Education Street',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560002',
        },
        bankDetails: {
          accountName: 'Education for All',
          accountNumber: '2345678901',
          ifscCode: 'BANK0002345',
          bankName: 'State Bank',
        },
      },
      {
        name: 'Health Care Foundation',
        description: 'Providing healthcare services to rural communities',
        category: 'healthcare',
        registrationNumber: 'NGO-003',
        verified: true,
        contact: {
          email: 'contact@healthcare.org',
          phone: '+919333333333',
          website: 'https://healthcare.org',
        },
        address: {
          street: 'Health Street',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560003',
        },
        bankDetails: {
          accountName: 'Health Care Foundation',
          accountNumber: '3456789012',
          ifscCode: 'BANK0003456',
          bankName: 'State Bank',
        },
      },
    ];

    for (const ngoData of ngos) {
      const existingNGO = await NGO.findOne({ registrationNumber: ngoData.registrationNumber });
      if (!existingNGO) {
        await NGO.create(ngoData);
        console.log(`✅ NGO created: ${ngoData.name}`);
      }
    }

    // Create Badges
    const badges = [
      {
        name: 'First Steps',
        description: 'Complete your first pickup',
        icon: '🌱',
        criteria: {
          type: 'pickups',
          threshold: 1,
        },
        tier: 'bronze',
      },
      {
        name: 'Recycling Hero',
        description: 'Complete 10 pickups',
        icon: '♻️',
        criteria: {
          type: 'pickups',
          threshold: 10,
        },
        tier: 'silver',
      },
      {
        name: 'Weight Champion',
        description: 'Recycle 100 kg of materials',
        icon: '⚖️',
        criteria: {
          type: 'weight',
          threshold: 100,
        },
        tier: 'gold',
      },
      {
        name: 'Impact Maker',
        description: 'Donate ₹10,000',
        icon: '💚',
        criteria: {
          type: 'donations',
          threshold: 10000,
        },
        tier: 'platinum',
      },
      {
        name: 'CO2 Warrior',
        description: 'Save 500 kg of CO2',
        icon: '🌍',
        criteria: {
          type: 'co2',
          threshold: 500,
        },
        tier: 'gold',
      },
    ];

    for (const badgeData of badges) {
      const existingBadge = await Badge.findOne({ name: badgeData.name });
      if (!existingBadge) {
        await Badge.create(badgeData);
        console.log(`✅ Badge created: ${badgeData.name}`);
      }
    }

    // Create CSR Campaign
    const campaign = await CSRCampaign.findOne({ campaignName: 'Green Impact 2024' });
    if (!campaign) {
      await CSRCampaign.create({
        companyName: 'Tech Corp',
        campaignName: 'Green Impact 2024',
        description: 'Matching donations for environmental causes',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        matchingRatio: 2, // 2x matching
        maxMatchAmount: 1000000, // ₹10 lakh
        targetNGOs: [],
        isActive: true,
      });
      console.log('✅ CSR Campaign created');
    }

    console.log('✅ Database seeding completed!');
    console.log('\n📝 Test Credentials:');
    console.log('Admin: AD-00001 / admin123');
    console.log('User: user@test.com / user123');
    console.log('Agent: AG-00001 / agent123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();


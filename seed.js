// BACKEND/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Investment = require('./models/Investment');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB for seeding');

  const sampleInvestments = [
    {
      name: 'Village Art Collective',
      category: 'Art',
      sector: 'Artist Empowerment',
      description: 'Support emerging artists in rural African communities.',
      image: 'https://via.placeholder.com/300x200?text=Village+Art+Fund',
      minAmount: 20,
      roi: 10,
      risk: 'Low',
      durationMonths: 6,
      currency: 'KES',
      isAvailable: true,
    },
    {
      name: 'Turnaround Failed Startup - UjuziTech',
      category: 'Turnaround',
      sector: 'Tech Recovery',
      description: 'Help revive a once-promising Kenyan startup.',
      image: 'https://via.placeholder.com/300x200?text=UjuziTech+Turnaround',
      minAmount: 100,
      roi: 25,
      risk: 'High',
      durationMonths: 18,
      currency: 'USD',
      isAvailable: true,
    },
    {
      name: 'Organic Cassava Expansion',
      category: 'Agriculture',
      sector: 'Root Crops',
      description: 'Invest in cassava farming across Western Kenya.',
      image: 'https://via.placeholder.com/300x200?text=Cassava+Expansion',
      minAmount: 50,
      roi: 14,
      risk: 'Medium',
      durationMonths: 9,
      currency: 'KES',
      isAvailable: true,
    },
    {
      name: 'E-learning for All',
      category: 'Education',
      sector: 'Digital Learning',
      description: 'Fund solar-powered digital classrooms in remote schools.',
      image: 'https://via.placeholder.com/300x200?text=E-learning+Fund',
      minAmount: 30,
      roi: 11,
      risk: 'Low',
      durationMonths: 12,
      currency: 'KES',
      isAvailable: true,
    },
    {
      name: 'AfriCode AI Startup',
      category: 'Tech',
      sector: 'AI & Data',
      description: 'Seed a next-gen African AI company building Swahili LLMs.',
      image: 'https://via.placeholder.com/300x200?text=AfriCode+AI',
      minAmount: 200,
      roi: 30,
      risk: 'High',
      durationMonths: 24,
      currency: 'USD',
      isAvailable: true,
    },
  ];

  await Investment.deleteMany();
  await Investment.insertMany(sampleInvestments);

  console.log('✅ Your investments have been seeded!');
  process.exit();
})
.catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});

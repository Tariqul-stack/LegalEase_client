require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userModel = require('./models/user.model');
const lawyerModel = require('./models/lawyer.model');

const User = userModel.default || userModel.User || userModel;
const Lawyer = lawyerModel.default || lawyerModel.Lawyer || lawyerModel;

const lawyers = [
  {
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@legalease.com',
    photo: 'https://i.pravatar.cc/150?img=1',
    bio: 'Experienced criminal defense attorney with a strong record in trial advocacy, bail hearings, and case negotiation.',
    specialization: 'Criminal Law',
    consultationFee: 180,
    status: 'available',
    isPublished: true,
    totalHires: 24,
  },
  {
    name: 'Marcus Bennett',
    email: 'marcus.bennett@legalease.com',
    photo: 'https://i.pravatar.cc/150?img=2',
    bio: 'Criminal law practitioner focused on protecting client rights in misdemeanor, felony, and appeals matters.',
    specialization: 'Criminal Law',
    consultationFee: 220,
    status: 'available',
    isPublished: true,
    totalHires: 18,
  },
  {
    name: 'Priya Shah',
    email: 'priya.shah@legalease.com',
    photo: 'https://i.pravatar.cc/150?img=3',
    bio: 'Corporate counsel helping startups and growing companies with contracts, compliance, and business formation.',
    specialization: 'Corporate Law',
    consultationFee: 350,
    status: 'available',
    isPublished: true,
    totalHires: 31,
  },
  {
    name: 'Daniel Carter',
    email: 'daniel.carter@legalease.com',
    photo: 'https://i.pravatar.cc/150?img=4',
    bio: 'Business attorney specializing in mergers, shareholder agreements, employment policies, and commercial disputes.',
    specialization: 'Corporate Law',
    consultationFee: 420,
    status: 'busy',
    isPublished: true,
    totalHires: 27,
  },
  {
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@legalease.com',
    photo: 'https://i.pravatar.cc/150?img=5',
    bio: 'Compassionate family lawyer handling divorce, custody, child support, adoption, and mediation matters.',
    specialization: 'Family Law',
    consultationFee: 200,
    status: 'available',
    isPublished: true,
    totalHires: 36,
  },
  {
    name: 'Jonathan Reed',
    email: 'jonathan.reed@legalease.com',
    photo: 'https://i.pravatar.cc/150?img=6',
    bio: 'Family law advocate known for practical guidance in sensitive custody, support, and settlement negotiations.',
    specialization: 'Family Law',
    consultationFee: 260,
    status: 'available',
    isPublished: true,
    totalHires: 21,
  },
  {
    name: 'Aisha Khan',
    email: 'aisha.khan@legalease.com',
    photo: 'https://i.pravatar.cc/150?img=7',
    bio: 'Immigration attorney assisting clients with visas, green cards, citizenship applications, and deportation defense.',
    specialization: 'Immigration Law',
    consultationFee: 160,
    status: 'available',
    isPublished: true,
    totalHires: 42,
  },
  {
    name: 'Michael Nguyen',
    email: 'michael.nguyen@legalease.com',
    photo: 'https://i.pravatar.cc/150?img=8',
    bio: 'Immigration lawyer focused on employment-based petitions, family sponsorship, asylum, and complex case strategy.',
    specialization: 'Immigration Law',
    consultationFee: 300,
    status: 'busy',
    isPublished: true,
    totalHires: 29,
  },
];

async function seed() {
  if (!process.env.MONGO_DB_URL) {
    throw new Error('MONGO_DB_URL is missing from .env');
  }

  await mongoose.connect(process.env.MONGO_DB_URL);

  const adminEmail = 'admin@legalease.com';
  const seedEmails = [adminEmail, ...lawyers.map((lawyer) => lawyer.email)];
  const adminPassword = await bcrypt.hash('admin123', 10);
  const lawyerPassword = await bcrypt.hash('lawyer123', 10);

  await Lawyer.deleteMany({});
  await User.deleteMany({ email: { $in: seedEmails } });

  await User.create({
    name: 'Admin',
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
  });

  for (const lawyer of lawyers) {
    const user = await User.create({
      name: lawyer.name,
      email: lawyer.email,
      password: lawyerPassword,
      role: 'lawyer',
      photo: lawyer.photo,
    });

    await Lawyer.create({
      userId: user._id,
      name: lawyer.name,
      email: lawyer.email,
      photo: lawyer.photo,
      bio: lawyer.bio,
      specialization: lawyer.specialization,
      consultationFee: lawyer.consultationFee,
      status: lawyer.status,
      isPublished: lawyer.isPublished,
      totalHires: lawyer.totalHires,
    });
  }

  console.log('Seed completed!');
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

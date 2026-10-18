import { PrismaClient, Role, Category, EventStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  await prisma.payment.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'College Admin',
      email: 'admin@college.edu',
      password: hashedAdminPassword,
      role: Role.ADMIN,
      phone: '9876543210',
      department: 'Administration',
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // Create Sample Student
  const hashedUserPassword = await bcrypt.hash('student123', 10);
  const student = await prisma.user.create({
    data: {
      name: 'Rahul Sharma',
      email: 'student@college.edu',
      password: hashedUserPassword,
      role: Role.USER,
      phone: '9123456780',
      department: 'Computer Science',
    },
  });
  console.log(`✅ Sample user created: ${student.email}`);

  // Create Sample Events
  const eventsData = [
    {
      title: 'HackElite 2026: 24-Hour Hackathon',
      description: 'Annual 24-hour national level hackathon featuring tracks in AI/ML, Web3, and Open Innovation with exciting cash prizes up to ₹1,00,000.',
      venue: 'Main Auditorium & Lab Complex',
      date: new Date('2026-11-15T09:00:00.000Z'),
      maxCapacity: 150,
      fee: 250.0,
      category: Category.TECH,
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
      status: EventStatus.UPCOMING,
      createdById: admin.id,
    },
    {
      title: 'Rhythm & Raag: Inter-College Music Fest',
      description: 'Battle of the bands, solo classical vocal performances, and acoustic nights under the open sky. Show your musical flair!',
      venue: 'Open Air Amphitheatre',
      date: new Date('2026-11-20T17:00:00.000Z'),
      maxCapacity: 300,
      fee: 150.0,
      category: Category.CULTURAL,
      imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
      status: EventStatus.UPCOMING,
      createdById: admin.id,
    },
    {
      title: 'Hands-on Generative AI & LLM Systems',
      description: 'An intensive hands-on workshop on fine-tuning LLMs, building RAG architectures, and deploying production AI agents with industry leaders.',
      venue: 'Seminar Hall 3',
      date: new Date('2026-11-05T10:00:00.000Z'),
      maxCapacity: 60,
      fee: 300.0,
      category: Category.WORKSHOP,
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
      status: EventStatus.UPCOMING,
      createdById: admin.id,
    },
    {
      title: 'Laser Tag Arena: Neon Warfare',
      description: 'Gear up in sensor vests and tactical laser blasters! Team up in high-adrenaline 4v4 neon battles in a fog-filled combat maze.',
      venue: 'Indoor Sports Complex - Arena 1',
      date: new Date('2026-11-12T14:00:00.000Z'),
      maxCapacity: 80,
      fee: 100.0,
      category: Category.INFORMALS,
      imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      status: EventStatus.UPCOMING,
      createdById: admin.id,
    },
    {
      title: 'Soapy Football Championship',
      description: 'Slip, slide, and score! High-energy soapy turf football matches. Safety helmets and knee guards provided for all participants.',
      venue: 'College Football Ground - Turf B',
      date: new Date('2026-11-13T11:00:00.000Z'),
      maxCapacity: 64,
      fee: 120.0,
      category: Category.INFORMALS,
      imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
      status: EventStatus.UPCOMING,
      createdById: admin.id,
    },
  ];

  for (const event of eventsData) {
    const createdEvent = await prisma.event.create({ data: event });
    console.log(`✅ Event created: [${createdEvent.category}] ${createdEvent.title}`);
  }

  console.log('✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

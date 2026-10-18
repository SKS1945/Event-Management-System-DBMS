import { PrismaClient, Role, Category, EventStatus, RegistrationStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seed for College Event Management System...');

  // Clean existing records in reverse dependency order
  await prisma.payment.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Admin
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

  // 2. Create Students
  const defaultPassword = await bcrypt.hash('student123', 10);

  const student1 = await prisma.user.create({
    data: {
      name: 'Rahul Sharma',
      email: 'student@college.edu',
      password: defaultPassword,
      role: Role.USER,
      phone: '9812345678',
      department: 'Computer Science',
    },
  });

  const student2 = await prisma.user.create({
    data: {
      name: 'Ananya Iyer',
      email: 'ananya@college.edu',
      password: defaultPassword,
      role: Role.USER,
      phone: '9823456789',
      department: 'Electronics & Communication',
    },
  });

  const student3 = await prisma.user.create({
    data: {
      name: 'Siddharth Verma',
      email: 'sid@college.edu',
      password: defaultPassword,
      role: Role.USER,
      phone: '9834567890',
      department: 'Information Technology',
    },
  });

  const student4 = await prisma.user.create({
    data: {
      name: 'Pooja Nair',
      email: 'pooja@college.edu',
      password: defaultPassword,
      role: Role.USER,
      phone: '9845678901',
      department: 'Mechanical Engineering',
    },
  });

  console.log('✅ 4 sample student profiles created');

  // 3. Create Events across all 4 categories
  const events = [
    {
      title: 'HackElite 2026: 24-Hour National Hackathon',
      description: 'Annual 24-hour national level hackathon featuring tracks in AI/ML, Web3, and Open Innovation. High-speed WiFi, midnight pizza, mentor support, and prizes up to ₹1,00,000!',
      venue: 'Main Auditorium & CS Labs',
      date: new Date('2026-11-15T09:00:00.000Z'),
      maxCapacity: 150,
      fee: 250.0,
      category: Category.TECH,
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
      status: EventStatus.UPCOMING,
      createdById: admin.id,
    },
    {
      title: 'CodeSprint: Competitive Algorithmic Battle',
      description: 'Speed-coding tournament inspired by ACM ICPC. Test your data structures, dynamic programming, and algorithm optimization under time pressure.',
      venue: 'Computer Center - Lab 4',
      date: new Date('2026-11-18T14:00:00.000Z'),
      maxCapacity: 80,
      fee: 0.0,
      category: Category.TECH,
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      status: EventStatus.UPCOMING,
      createdById: admin.id,
    },
    {
      title: 'Rhythm & Raag: Inter-College Music Fest',
      description: 'Battle of the bands, classical solo vocal performances, and acoustic bonfire nights under the open sky. Show your musical flair to a 1000+ crowd!',
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
      title: 'Nrityanjali: Classical & Street Dance Showcase',
      description: 'From Bharatanatyam and Kathak solos to high-octane hip-hop crew battles. Stage lighting, state-of-the-art sound, and celebrity judges.',
      venue: 'College Main Auditorium',
      date: new Date('2026-11-22T16:00:00.000Z'),
      maxCapacity: 250,
      fee: 100.0,
      category: Category.CULTURAL,
      imageUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=800&q=80',
      status: EventStatus.UPCOMING,
      createdById: admin.id,
    },
    {
      title: 'Hands-on Generative AI & Autonomous Agents',
      description: 'An intensive hands-on workshop on building LLM agents, tool-augmented systems, and deploying scalable inference pipelines with industry specialists.',
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
      title: 'Cloud DevOps & Kubernetes Masterclass',
      description: 'Learn Docker containerization, CI/CD with GitHub Actions, Helm charts, and deploying microservices on managed Kubernetes clusters.',
      venue: 'IT Building - Conference Room 2',
      date: new Date('2026-11-08T11:00:00.000Z'),
      maxCapacity: 50,
      fee: 150.0,
      category: Category.WORKSHOP,
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      status: EventStatus.UPCOMING,
      createdById: admin.id,
    },
    {
      title: 'Neon Laser Tag Arena: Tactical Warfare',
      description: 'Gear up in sensor vests and infrared blasters! Team up in tactical 4v4 neon battles inside a smoke-filled multi-level combat labyrinth.',
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
      title: 'Soapy Football Championship 2026',
      description: 'Slip, slide, and score! High-energy soapy turf football matches. Safety helmets, knee pads, and referee supervision provided for all teams.',
      venue: 'College Football Ground - Turf B',
      date: new Date('2026-11-13T11:00:00.000Z'),
      maxCapacity: 64,
      fee: 120.0,
      category: Category.INFORMALS,
      imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
      status: EventStatus.UPCOMING,
      createdById: admin.id,
    },
    {
      title: 'Midnight Campus Treasure Hunt',
      description: 'Decipher cryptic riddles, hunt across campus landmarks, and unlock the final secret vault before the timer runs out! Teams of 3-4.',
      venue: 'Campus Central Quadrangle',
      date: new Date('2026-11-25T20:00:00.000Z'),
      maxCapacity: 100,
      fee: 50.0,
      category: Category.INFORMALS,
      imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      status: EventStatus.UPCOMING,
      createdById: admin.id,
    },
  ];

  const createdEvents = [];
  for (const event of events) {
    const created = await prisma.event.create({ data: event });
    createdEvents.push(created);
  }
  console.log(`✅ ${createdEvents.length} events created across all categories`);

  // 4. Create Sample Registrations and Verified Payments
  // Rahul registers for HackElite and pays
  const reg1 = await prisma.registration.create({
    data: {
      userId: student1.id,
      eventId: createdEvents[0].id,
      status: RegistrationStatus.CONFIRMED,
    },
  });
  await prisma.payment.create({
    data: {
      registrationId: reg1.id,
      amount: createdEvents[0].fee,
      method: PaymentMethod.UPI,
      status: PaymentStatus.SUCCESS,
      razorpayOrderId: 'order_seed_001',
      razorpayPaymentId: 'pay_rzp_seed_001',
      razorpaySignature: 'sig_seed_001',
      paidAt: new Date(),
    },
  });

  // Rahul registers for Laser Tag and pays
  const reg2 = await prisma.registration.create({
    data: {
      userId: student1.id,
      eventId: createdEvents[6].id,
      status: RegistrationStatus.CONFIRMED,
    },
  });
  await prisma.payment.create({
    data: {
      registrationId: reg2.id,
      amount: createdEvents[6].fee,
      method: PaymentMethod.UPI,
      status: PaymentStatus.SUCCESS,
      razorpayOrderId: 'order_seed_002',
      razorpayPaymentId: 'pay_rzp_seed_002',
      razorpaySignature: 'sig_seed_002',
      paidAt: new Date(),
    },
  });

  // Ananya registers for Music Fest and pays
  const reg3 = await prisma.registration.create({
    data: {
      userId: student2.id,
      eventId: createdEvents[2].id,
      status: RegistrationStatus.CONFIRMED,
    },
  });
  await prisma.payment.create({
    data: {
      registrationId: reg3.id,
      amount: createdEvents[2].fee,
      method: PaymentMethod.CARD,
      status: PaymentStatus.SUCCESS,
      razorpayOrderId: 'order_seed_003',
      razorpayPaymentId: 'pay_rzp_seed_003',
      razorpaySignature: 'sig_seed_003',
      paidAt: new Date(),
    },
  });

  // Siddharth registers for AI workshop and pays
  const reg4 = await prisma.registration.create({
    data: {
      userId: student3.id,
      eventId: createdEvents[4].id,
      status: RegistrationStatus.CONFIRMED,
    },
  });
  await prisma.payment.create({
    data: {
      registrationId: reg4.id,
      amount: createdEvents[4].fee,
      method: PaymentMethod.NET_BANKING,
      status: PaymentStatus.SUCCESS,
      razorpayOrderId: 'order_seed_004',
      razorpayPaymentId: 'pay_rzp_seed_004',
      razorpaySignature: 'sig_seed_004',
      paidAt: new Date(),
    },
  });

  // Pooja registers for CodeSprint (Free event)
  await prisma.registration.create({
    data: {
      userId: student4.id,
      eventId: createdEvents[1].id,
      status: RegistrationStatus.CONFIRMED,
    },
  });

  // Pooja registers for Soapy Football (Pending payment)
  const reg6 = await prisma.registration.create({
    data: {
      userId: student4.id,
      eventId: createdEvents[7].id,
      status: RegistrationStatus.PENDING,
    },
  });
  await prisma.payment.create({
    data: {
      registrationId: reg6.id,
      amount: createdEvents[7].fee,
      method: PaymentMethod.UPI,
      status: PaymentStatus.PENDING,
      razorpayOrderId: 'order_seed_006',
    },
  });

  console.log('✅ Sample registrations & payment transactions seeded successfully');
  console.log('🎉 Seed process finished cleanly!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

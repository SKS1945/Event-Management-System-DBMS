import { PrismaClient, Role, Category, EventStatus, RegistrationStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting rich database seed for College Event Management System...');

  // 1. Clean existing records in reverse dependency order
  await prisma.payment.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Admin Account
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

  // 3. Create Diverse Student Accounts
  const defaultPassword = await bcrypt.hash('student123', 10);

  const studentsData = [
    { name: 'Rahul Sharma', email: 'student@college.edu', phone: '9812345678', department: 'Computer Science' },
    { name: 'Ananya Iyer', email: 'ananya@college.edu', phone: '9823456789', department: 'Electronics & Communication' },
    { name: 'Siddharth Verma', email: 'sid@college.edu', phone: '9834567890', department: 'Information Technology' },
    { name: 'Pooja Nair', email: 'pooja@college.edu', phone: '9845678901', department: 'Mechanical Engineering' },
    { name: 'Rohan Deshmukh', email: 'rohan@college.edu', phone: '9856789012', department: 'Artificial Intelligence & Data Science' },
    { name: 'Sneha Kulkarni', email: 'sneha@college.edu', phone: '9867890123', department: 'Electrical Engineering' },
    { name: 'Vikramaditya Rathore', email: 'vikram@college.edu', phone: '9878901234', department: 'Civil Engineering' },
    { name: 'Meera Krishnan', email: 'meera@college.edu', phone: '9889012345', department: 'Biotechnology' },
    { name: 'Aditya Sengupta', email: 'aditya@college.edu', phone: '9890123456', department: 'Computer Science' },
    { name: 'Tanvi Bhatt', email: 'tanvi@college.edu', phone: '9801234567', department: 'Business Administration (MBA)' },
  ];

  const students = [];
  for (const s of studentsData) {
    const student = await prisma.user.create({
      data: {
        name: s.name,
        email: s.email,
        password: defaultPassword,
        role: Role.USER,
        phone: s.phone,
        department: s.department,
      },
    });
    students.push(student);
  }
  console.log(`✅ ${students.length} student profiles created`);

  // 4. Create Rich Event Catalog (18 events across 4 categories)
  const eventsData = [
    // --- TECH (5 events) ---
    {
      title: 'HackElite 2026: 24-Hour National Hackathon',
      description: 'Annual flagship 24-hour national hackathon featuring tracks in AI/ML, Web3, FinTech, and Open Innovation. High-speed Gigabit WiFi, midnight refreshments, 1-on-1 industry mentorship, and prizes up to ₹1,50,000!\n\nRules & Guidelines:\n• Teams of 2 to 4 members.\n• GitHub repos must be initialized after kickoff.\n• Pre-built templates or plagiarized code will result in immediate disqualification.',
      venue: 'Main Auditorium & CS Computing Complex',
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
      description: 'Speed-coding tournament structured like the ACM ICPC regional rounds. Solve 8 algorithmic problems in 3 hours testing advanced data structures, graph theory, and dynamic programming.\n\nSupported Languages: C++, Java, Python, Go, Rust.\nAutomated testing with real-time leaderboard!',
      venue: 'Turing Computer Lab (Lab 4)',
      date: new Date('2026-11-18T14:00:00.000Z'),
      maxCapacity: 80,
      fee: 0.0, // Free
      category: Category.TECH,
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      status: EventStatus.UPCOMING,
      createdById: admin.id,
    },
    {
      title: 'CyberShield: CTF Ethical Hacking Tournament',
      description: 'Defend and exploit! A Jeopardy-style Capture The Flag competition covering cryptography, binary exploitation, reverse engineering, web security, and digital forensics.\n\nCertificates of Excellence and bug bounty vouchers for top 5 security researchers.',
      venue: 'Cyber Security Operations Center - Room 302',
      date: new Date('2026-11-21T10:00:00.000Z'),
      maxCapacity: 60,
      fee: 150.0,
      category: Category.TECH,
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      status: EventStatus.UPCOMING,
      createdById: admin.id,
    },
    {
      title: 'RoboWars & RoboSoccer Combat Arena',
      description: 'High-torque fighting robots clash inside a heavy-duty polycarbonate enclosure! Spinners, wedges, and lifters battle to the death, followed by the high-speed autonomous robot soccer championship.\n\nWeight categories: Up to 15kg combat bots.',
      venue: 'Mechanical Workshop Quadrangle',
      date: new Date('2026-11-28T11:00:00.000Z'),
      maxCapacity: 75,
      fee: 200.0,
      category: Category.TECH,
      imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
      status: EventStatus.UPCOMING,
      createdById: admin.id,
    },
    {
      title: 'Web3 & DeFi DApp Buildathon',
      description: 'Build decentralized financial protocols, cross-chain bridges, and zero-knowledge identity dapps on Ethereum, Polygon, and Solana. Network with leading Web3 founders and venture capitalists.',
      venue: 'Innovation Hub - Seminar Hall 2',
      date: new Date('2026-12-02T10:00:00.000Z'),
      maxCapacity: 50,
      fee: 100.0,
      category: Category.TECH,
      imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
      status: EventStatus.UPCOMING,
      createdById: admin.id,
    },

    // --- CULTURAL (4 events) ---
    {
      title: 'Rhythm & Raag: Inter-College Battle of the Bands',
      description: 'Rock, fusion, and indie bands face off under stadium lighting! From electric guitar solos to classic Indian semi-classical vocal fusion. Professional audio setup with crowd voting.\n\nGrand Prize: ₹50,000 + Studio Recording Deal.',
      venue: 'Open Air Amphitheatre',
      date: new Date('2026-11-20T17:30:00.000Z'),
      maxCapacity: 300,
      fee: 150.0,
      category: Category.CULTURAL,
      imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
      status: EventStatus.UPCOMING,
      createdById: admin.id,
    },
    {
      title: 'Nrityanjali: Classical & Street Dance Showcase',
      description: 'A dazzling evening of choreography! Bharatanatyam, Kathak, and Odissi classical solos in the first act, followed by heart-thumping crew battles in hip-hop, locking, and contemporary dance.\n\nEvaluated by celebrity dance choreographers.',
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
      title: 'Rangmanch: Annual Street Play & Nukkad Natak',
      description: 'Powerful voices, rhythmic drums, and socially resonant themes. College drama clubs present gripping street plays addressing mental health, environmental ethics, and digital equality in society.',
      venue: 'Central Fountain Plaza',
      date: new Date('2026-11-24T15:00:00.000Z'),
      maxCapacity: 200,
      fee: 0.0, // Free
      category: Category.CULTURAL,
      imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80',
      status: EventStatus.UPCOMING,
      createdById: admin.id,
    },
    {
      title: 'Canvas & Chisel: Fine Arts & Digital Graffiti Exhibition',
      description: 'Live portrait painting, spray-can mural art on giant canvas boards, clay sculpting, and 3D digital concept art demonstrations. Art materials provided to all participants.',
      venue: 'Architecture Atrium & Art Gallery',
      date: new Date('2026-11-26T11:00:00.000Z'),
      maxCapacity: 90,
      fee: 0.0, // Free
      category: Category.CULTURAL,
      imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
      status: EventStatus.UPCOMING,
      createdById: admin.id,
    },

    // --- WORKSHOP (4 events) ---
    {
      title: 'Hands-on Generative AI & Autonomous Agentic Systems',
      description: 'An intensive, hands-on masterclass on building LLM agents, multi-agent orchestrations, RAG pipelines with vector databases, and deploying scalable inference with LangGraph and FastAPI.\n\nPrerequisites: Basic Python familiarity. GPU compute access provided.',
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
      title: 'Cloud DevOps, Docker & Kubernetes Masterclass',
      description: 'Learn modern DevOps hands-on: Docker multi-stage builds, continuous deployment pipelines via GitHub Actions, Kubernetes cluster architecture, Pod autoscaling, and Prometheus monitoring.\n\nIncludes free GCP and AWS cloud sandbox credits.',
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
      title: 'IoT & Embedded Robotics with Raspberry Pi 5',
      description: 'Connect hardware sensors, microcontrollers, and actuators to cloud MQTT brokers. Build real-time IoT smart campus devices with Raspberry Pi 5 and ESP32 boards.\n\nTake-home hardware starter kit provided.',
      venue: 'Embedded Systems Lab (Room 210)',
      date: new Date('2026-11-10T10:30:00.000Z'),
      maxCapacity: 45,
      fee: 250.0,
      category: Category.WORKSHOP,
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      status: EventStatus.UPCOMING,
      createdById: admin.id,
    },
    {
      title: 'UI/UX Design Sprint: Figma to Production Systems',
      description: 'Master component libraries, auto-layout 5.0, interactive micro-interactions, responsive breakpoints, and handoff to React Tailwind code. Led by senior product designers.',
      venue: 'Design Studio Lab (Audi Block)',
      date: new Date('2026-11-14T14:00:00.000Z'),
      maxCapacity: 65,
      fee: 0.0, // Free
      category: Category.WORKSHOP,
      imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80',
      status: EventStatus.UPCOMING,
      createdById: admin.id,
    },

    // --- INFORMALS (5 events) ---
    {
      title: 'Neon Laser Tag Arena: Tactical 4v4 Warfare',
      description: 'Gear up in wireless sensor vests and tactical infrared blasters! Battle in intense 4v4 team deathmatches inside a multi-level smoke-filled neon combat maze with synthwave beats.\n\nProtective gear provided. Medals & vouchers for the winning squad.',
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
      title: 'Soapy Football Cup 2026 (Slip & Slide)',
      description: 'Slip, slide, and score! High-energy soapy turf football matches played on a foam-coated inflatable pitch. Helmets, elbow & knee pads, and waterproof referee monitoring ensured for all teams.',
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
      title: 'Midnight Campus Mystery Treasure Hunt',
      description: 'Decipher encrypted ciphers, hunt across iconic campus landmarks, scan hidden QR clues, and solve the final mystery before time expires! Teams of 3-4 detectives.\n\nClues drop at sharp 8:00 PM.',
      venue: 'Campus Central Quadrangle',
      date: new Date('2026-11-25T20:00:00.000Z'),
      maxCapacity: 100,
      fee: 50.0,
      category: Category.INFORMALS,
      imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      status: EventStatus.UPCOMING,
      createdById: admin.id,
    },
    {
      title: 'Ultimate Gaming LAN Arena (Valorant & EA FC 26)',
      description: '5v5 Valorant Spike Rush brackets and 1v1 EA FC 26 console showdowns on high refresh-rate monitors. Live commentary, shoutcasting, and trophy ceremonies.',
      venue: 'Student Activity Center - Gaming Lounge',
      date: new Date('2026-11-27T12:00:00.000Z'),
      maxCapacity: 96,
      fee: 80.0,
      category: Category.INFORMALS,
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      status: EventStatus.UPCOMING,
      createdById: admin.id,
    },
    {
      title: 'Escape Room: The Secret Vault Challenge',
      description: 'Locked inside the historical physics department archive! Your team has 45 minutes to solve mechanical locks, laser puzzles, and mathematical riddles to escape.',
      venue: 'Old Science Block - Room 104',
      date: new Date('2026-11-29T13:00:00.000Z'),
      maxCapacity: 48,
      fee: 60.0,
      category: Category.INFORMALS,
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      status: EventStatus.UPCOMING,
      createdById: admin.id,
    },
  ];

  const createdEvents: any[] = [];
  for (const ev of eventsData) {
    const created = await prisma.event.create({ data: ev });
    createdEvents.push(created);
  }
  console.log(`✅ ${createdEvents.length} events created across TECH, CULTURAL, WORKSHOP, and INFORMALS`);

  // Helper to register student & create payment
  let paymentCounter = 1;

  async function registerAndPay(
    studentIndex: number,
    eventIndex: number,
    regStatus: RegistrationStatus,
    payStatus?: PaymentStatus,
    method: PaymentMethod = PaymentMethod.UPI
  ) {
    const student = students[studentIndex];
    const event = createdEvents[eventIndex];
    const fee = Number(event.fee);

    const reg = await prisma.registration.create({
      data: {
        userId: student.id,
        eventId: event.id,
        status: regStatus,
        registeredAt: new Date(Date.now() - Math.floor(Math.random() * 5 * 86400000)),
      },
    });

    if (fee > 0 && payStatus) {
      const padId = String(paymentCounter++).padStart(3, '0');
      await prisma.payment.create({
        data: {
          registrationId: reg.id,
          amount: fee,
          method,
          status: payStatus,
          razorpayOrderId: `order_rzp_${padId}`,
          razorpayPaymentId: payStatus === PaymentStatus.SUCCESS || payStatus === PaymentStatus.REFUNDED
            ? `pay_rzp_test_${padId}`
            : null,
          razorpaySignature: payStatus === PaymentStatus.SUCCESS ? `sig_verified_${padId}` : null,
          paidAt: payStatus === PaymentStatus.SUCCESS || payStatus === PaymentStatus.REFUNDED
            ? new Date()
            : null,
        },
      });
    }

    return reg;
  }

  // 5. Seed Diverse Registrations & Transactions

  // Rahul Sharma (Student 0)
  await registerAndPay(0, 0, RegistrationStatus.CONFIRMED, PaymentStatus.SUCCESS, PaymentMethod.UPI); // HackElite
  await registerAndPay(0, 1, RegistrationStatus.CONFIRMED); // CodeSprint (Free)
  await registerAndPay(0, 9, RegistrationStatus.CONFIRMED, PaymentStatus.SUCCESS, PaymentMethod.UPI); // GenAI Workshop
  await registerAndPay(0, 13, RegistrationStatus.CONFIRMED, PaymentStatus.SUCCESS, PaymentMethod.UPI); // Laser Tag

  // Ananya Iyer (Student 1)
  await registerAndPay(1, 5, RegistrationStatus.CONFIRMED, PaymentStatus.SUCCESS, PaymentMethod.CARD); // Music Fest
  await registerAndPay(1, 6, RegistrationStatus.CONFIRMED, PaymentStatus.SUCCESS, PaymentMethod.UPI); // Dance
  await registerAndPay(1, 12, RegistrationStatus.CONFIRMED); // UI/UX (Free)
  await registerAndPay(1, 14, RegistrationStatus.CONFIRMED, PaymentStatus.SUCCESS, PaymentMethod.UPI); // Soapy Football

  // Siddharth Verma (Student 2)
  await registerAndPay(2, 0, RegistrationStatus.CONFIRMED, PaymentStatus.SUCCESS, PaymentMethod.NET_BANKING); // HackElite
  await registerAndPay(2, 2, RegistrationStatus.CONFIRMED, PaymentStatus.SUCCESS, PaymentMethod.UPI); // CyberShield CTF
  await registerAndPay(2, 10, RegistrationStatus.CONFIRMED, PaymentStatus.SUCCESS, PaymentMethod.CARD); // DevOps K8s
  await registerAndPay(2, 16, RegistrationStatus.CONFIRMED, PaymentStatus.SUCCESS, PaymentMethod.UPI); // Gaming LAN

  // Pooja Nair (Student 3)
  await registerAndPay(3, 3, RegistrationStatus.CONFIRMED, PaymentStatus.SUCCESS, PaymentMethod.UPI); // RoboWars
  await registerAndPay(3, 7, RegistrationStatus.CONFIRMED); // Rangmanch Street Play (Free)
  await registerAndPay(3, 14, RegistrationStatus.PENDING, PaymentStatus.PENDING, PaymentMethod.UPI); // Soapy Football (Pending)

  // Rohan Deshmukh (Student 4)
  await registerAndPay(4, 9, RegistrationStatus.CONFIRMED, PaymentStatus.SUCCESS, PaymentMethod.UPI); // GenAI
  await registerAndPay(4, 11, RegistrationStatus.CONFIRMED, PaymentStatus.SUCCESS, PaymentMethod.NET_BANKING); // IoT Raspberry Pi
  await registerAndPay(4, 15, RegistrationStatus.CONFIRMED, PaymentStatus.SUCCESS, PaymentMethod.UPI); // Treasure Hunt

  // Sneha Kulkarni (Student 5)
  await registerAndPay(5, 5, RegistrationStatus.CONFIRMED, PaymentStatus.SUCCESS, PaymentMethod.CARD); // Music Fest
  await registerAndPay(5, 8, RegistrationStatus.CONFIRMED); // Canvas Fine Arts (Free)
  await registerAndPay(5, 13, RegistrationStatus.CONFIRMED, PaymentStatus.SUCCESS, PaymentMethod.UPI); // Laser Tag
  await registerAndPay(5, 17, RegistrationStatus.CONFIRMED, PaymentStatus.SUCCESS, PaymentMethod.WALLET); // Escape Room

  // Vikramaditya Rathore (Student 6)
  await registerAndPay(6, 14, RegistrationStatus.CONFIRMED, PaymentStatus.SUCCESS, PaymentMethod.UPI); // Soapy Football
  await registerAndPay(6, 16, RegistrationStatus.CONFIRMED, PaymentStatus.SUCCESS, PaymentMethod.CARD); // Gaming LAN
  await registerAndPay(6, 0, RegistrationStatus.PENDING, PaymentStatus.PENDING, PaymentMethod.UPI); // HackElite (Pending)

  // Meera Krishnan (Student 7)
  await registerAndPay(7, 8, RegistrationStatus.CONFIRMED); // Canvas Art (Free)
  await registerAndPay(7, 9, RegistrationStatus.CONFIRMED, PaymentStatus.SUCCESS, PaymentMethod.UPI); // GenAI Workshop
  await registerAndPay(7, 13, RegistrationStatus.CANCELLED, PaymentStatus.REFUNDED, PaymentMethod.UPI); // Cancelled & Refunded

  // Aditya Sengupta (Student 8)
  await registerAndPay(8, 0, RegistrationStatus.CONFIRMED, PaymentStatus.SUCCESS, PaymentMethod.UPI); // HackElite
  await registerAndPay(8, 1, RegistrationStatus.CONFIRMED); // CodeSprint (Free)
  await registerAndPay(8, 4, RegistrationStatus.CONFIRMED, PaymentStatus.SUCCESS, PaymentMethod.NET_BANKING); // Web3 DApp

  // Tanvi Bhatt (Student 9)
  await registerAndPay(9, 5, RegistrationStatus.CONFIRMED, PaymentStatus.SUCCESS, PaymentMethod.CARD); // Music Fest
  await registerAndPay(9, 12, RegistrationStatus.CONFIRMED); // UI/UX (Free)
  await registerAndPay(9, 15, RegistrationStatus.CONFIRMED, PaymentStatus.SUCCESS, PaymentMethod.UPI); // Treasure Hunt
  await registerAndPay(9, 17, RegistrationStatus.CANCELLED, PaymentStatus.REFUNDED, PaymentMethod.WALLET); // Cancelled & Refunded

  console.log('✅ Over 28 registrations & payment transactions seeded successfully');
  console.log('🎉 Database seeding complete! Content-rich demonstration ready.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

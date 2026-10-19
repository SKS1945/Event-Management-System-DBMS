-- ====================================================================
-- College Event Management System (CampusPulse) - Test & Demo Seed Data
-- DBMS Project - Population Script
-- ====================================================================

\c event_management;

-- Truncate existing data cleanly
TRUNCATE TABLE "Payment", "Registration", "Event", "User" RESTART IDENTITY CASCADE;

-- ====================================================================
-- 1. INSERT USERS (1 Admin + 10 Students)
-- Passwords:
-- Admin: 'admin123' -> $2b$10$4.Y53twSkho4Qedbt79wQeQJmyLgjvL0sGyUfdtKqrP85ueMk0Kaa
-- Students: 'student123' -> $2b$10$m89lyzKmkOUbIkB0XjNy8OHkHcB4K4dCAlZp8rmVWPQUQzTXbHrv6
-- ====================================================================

INSERT INTO "User" ("id", "name", "email", "password", "role", "phone", "department", "createdAt") VALUES
(1, 'College Admin', 'admin@college.edu', '$2b$10$4.Y53twSkho4Qedbt79wQeQJmyLgjvL0sGyUfdtKqrP85ueMk0Kaa', 'ADMIN', '9876543210', 'Administration', NOW()),
(2, 'Rahul Sharma', 'student@college.edu', '$2b$10$m89lyzKmkOUbIkB0XjNy8OHkHcB4K4dCAlZp8rmVWPQUQzTXbHrv6', 'USER', '9812345678', 'Computer Science', NOW()),
(3, 'Ananya Iyer', 'ananya@college.edu', '$2b$10$m89lyzKmkOUbIkB0XjNy8OHkHcB4K4dCAlZp8rmVWPQUQzTXbHrv6', 'USER', '9823456789', 'Electronics & Communication', NOW()),
(4, 'Siddharth Verma', 'sid@college.edu', '$2b$10$m89lyzKmkOUbIkB0XjNy8OHkHcB4K4dCAlZp8rmVWPQUQzTXbHrv6', 'USER', '9834567890', 'Information Technology', NOW()),
(5, 'Pooja Nair', 'pooja@college.edu', '$2b$10$m89lyzKmkOUbIkB0XjNy8OHkHcB4K4dCAlZp8rmVWPQUQzTXbHrv6', 'USER', '9845678901', 'Mechanical Engineering', NOW()),
(6, 'Rohan Deshmukh', 'rohan@college.edu', '$2b$10$m89lyzKmkOUbIkB0XjNy8OHkHcB4K4dCAlZp8rmVWPQUQzTXbHrv6', 'USER', '9856789012', 'Artificial Intelligence & Data Science', NOW()),
(7, 'Sneha Kulkarni', 'sneha@college.edu', '$2b$10$m89lyzKmkOUbIkB0XjNy8OHkHcB4K4dCAlZp8rmVWPQUQzTXbHrv6', 'USER', '9867890123', 'Electrical Engineering', NOW()),
(8, 'Vikramaditya Rathore', 'vikram@college.edu', '$2b$10$m89lyzKmkOUbIkB0XjNy8OHkHcB4K4dCAlZp8rmVWPQUQzTXbHrv6', 'USER', '9878901234', 'Civil Engineering', NOW()),
(9, 'Meera Krishnan', 'meera@college.edu', '$2b$10$m89lyzKmkOUbIkB0XjNy8OHkHcB4K4dCAlZp8rmVWPQUQzTXbHrv6', 'USER', '9889012345', 'Biotechnology', NOW()),
(10, 'Aditya Sengupta', 'aditya@college.edu', '$2b$10$m89lyzKmkOUbIkB0XjNy8OHkHcB4K4dCAlZp8rmVWPQUQzTXbHrv6', 'USER', '9890123456', 'Computer Science', NOW()),
(11, 'Tanvi Bhatt', 'tanvi@college.edu', '$2b$10$m89lyzKmkOUbIkB0XjNy8OHkHcB4K4dCAlZp8rmVWPQUQzTXbHrv6', 'USER', '9801234567', 'Business Administration (MBA)', NOW());

-- ====================================================================
-- 2. INSERT EVENTS (18 Events across 4 Categories)
-- ====================================================================

INSERT INTO "Event" ("id", "title", "description", "venue", "date", "maxCapacity", "fee", "category", "imageUrl", "status", "createdById", "createdAt", "updatedAt") VALUES
-- TECH
(1, 'HackElite 2026: 24-Hour National Hackathon', 'Annual flagship 24-hour national hackathon featuring tracks in AI/ML, Web3, FinTech, and Open Innovation. High-speed Gigabit WiFi, midnight pizza, mentor support, and prizes up to ₹1,50,000!', 'Main Auditorium & CS Computing Complex', '2026-11-15 09:00:00', 150, 250.00, 'TECH', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', 'UPCOMING', 1, NOW(), NOW()),
(2, 'CodeSprint: Competitive Algorithmic Battle', 'Speed-coding tournament structured like ACM ICPC regional rounds. Solve 8 algorithmic problems in 3 hours testing graph theory and dynamic programming.', 'Turing Computer Lab (Lab 4)', '2026-11-18 14:00:00', 80, 0.00, 'TECH', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80', 'UPCOMING', 1, NOW(), NOW()),
(3, 'CyberShield: CTF Ethical Hacking Tournament', 'Jeopardy-style Capture The Flag competition covering cryptography, binary exploitation, and reverse engineering. Top 5 receive bug bounty vouchers.', 'Cyber Security Operations Center - Room 302', '2026-11-21 10:00:00', 60, 150.00, 'TECH', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', 'UPCOMING', 1, NOW(), NOW()),
(4, 'RoboWars & RoboSoccer Combat Arena', 'High-torque fighting robots clash inside a heavy-duty polycarbonate enclosure! Spinners, wedges, and lifters battle to the death.', 'Mechanical Workshop Quadrangle', '2026-11-28 11:00:00', 75, 200.00, 'TECH', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80', 'UPCOMING', 1, NOW(), NOW()),
(5, 'Web3 & DeFi DApp Buildathon', 'Build decentralized financial protocols, cross-chain bridges, and zero-knowledge identity dapps on Ethereum, Polygon, and Solana.', 'Innovation Hub - Seminar Hall 2', '2026-12-02 10:00:00', 50, 100.00, 'TECH', 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80', 'UPCOMING', 1, NOW(), NOW()),

-- CULTURAL
(6, 'Rhythm & Raag: Inter-College Battle of the Bands', 'Rock, fusion, and indie bands face off under stadium lighting! From electric guitar solos to classic Indian semi-classical vocal fusion. Grand Prize: ₹50,000.', 'Open Air Amphitheatre', '2026-11-20 17:30:00', 300, 150.00, 'CULTURAL', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80', 'UPCOMING', 1, NOW(), NOW()),
(7, 'Nrityanjali: Classical & Street Dance Showcase', 'A dazzling evening of choreography! Classical solos in Act 1 followed by heart-thumping crew battles in hip-hop, locking, and contemporary dance.', 'College Main Auditorium', '2026-11-22 16:00:00', 250, 100.00, 'CULTURAL', 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=800&q=80', 'UPCOMING', 1, NOW(), NOW()),
(8, 'Rangmanch: Annual Street Play & Nukkad Natak', 'Powerful voices, rhythmic drums, and socially resonant themes. College drama clubs present gripping street plays addressing social awareness.', 'Central Fountain Plaza', '2026-11-24 15:00:00', 200, 0.00, 'CULTURAL', 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80', 'UPCOMING', 1, NOW(), NOW()),
(9, 'Canvas & Chisel: Fine Arts & Digital Graffiti Exhibition', 'Live portrait painting, spray-can mural art on giant canvas boards, clay sculpting, and 3D digital concept art demonstrations.', 'Architecture Atrium & Art Gallery', '2026-11-26 11:00:00', 90, 0.00, 'CULTURAL', 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80', 'UPCOMING', 1, NOW(), NOW()),

-- WORKSHOP
(10, 'Hands-on Generative AI & Autonomous Agentic Systems', 'An intensive masterclass on building LLM agents, multi-agent orchestrations, RAG pipelines with vector databases, and scalable inference.', 'Seminar Hall 3', '2026-11-05 10:00:00', 60, 300.00, 'WORKSHOP', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80', 'UPCOMING', 1, NOW(), NOW()),
(11, 'Cloud DevOps, Docker & Kubernetes Masterclass', 'Docker multi-stage builds, continuous deployment pipelines via GitHub Actions, Kubernetes cluster architecture, and Prometheus monitoring.', 'IT Building - Conference Room 2', '2026-11-08 11:00:00', 50, 150.00, 'WORKSHOP', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80', 'UPCOMING', 1, NOW(), NOW()),
(12, 'IoT & Embedded Robotics with Raspberry Pi 5', 'Connect hardware sensors, microcontrollers, and actuators to cloud MQTT brokers. Take-home hardware starter kit provided.', 'Embedded Systems Lab (Room 210)', '2026-11-10 10:30:00', 45, 250.00, 'WORKSHOP', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', 'UPCOMING', 1, NOW(), NOW()),
(13, 'UI/UX Design Sprint: Figma to Production Systems', 'Master component libraries, auto-layout 5.0, interactive micro-interactions, responsive breakpoints, and handoff to React Tailwind code.', 'Design Studio Lab (Audi Block)', '2026-11-14 14:00:00', 65, 0.00, 'WORKSHOP', 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80', 'UPCOMING', 1, NOW(), NOW()),

-- INFORMALS
(14, 'Neon Laser Tag Arena: Tactical 4v4 Warfare', 'Gear up in wireless sensor vests and tactical infrared blasters! Battle in intense 4v4 team deathmatches inside a smoke-filled neon combat maze.', 'Indoor Sports Complex - Arena 1', '2026-11-12 14:00:00', 80, 100.00, 'INFORMALS', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80', 'UPCOMING', 1, NOW(), NOW()),
(15, 'Soapy Football Cup 2026 (Slip & Slide)', 'Slip, slide, and score! High-energy soapy turf football matches played on a foam-coated inflatable pitch with safety gear provided.', 'College Football Ground - Turf B', '2026-11-13 11:00:00', 64, 120.00, 'INFORMALS', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80', 'UPCOMING', 1, NOW(), NOW()),
(16, 'Midnight Campus Mystery Treasure Hunt', 'Decipher encrypted ciphers, hunt across iconic campus landmarks, scan hidden QR clues, and solve the final mystery before time expires!', 'Campus Central Quadrangle', '2026-11-25 20:00:00', 100, 50.00, 'INFORMALS', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80', 'UPCOMING', 1, NOW(), NOW()),
(17, 'Ultimate Gaming LAN Arena (Valorant & EA FC 26)', '5v5 Valorant Spike Rush brackets and 1v1 EA FC 26 console showdowns on high refresh-rate monitors with live commentary and shoutcasting.', 'Student Activity Center - Gaming Lounge', '2026-11-27 12:00:00', 96, 80.00, 'INFORMALS', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80', 'UPCOMING', 1, NOW(), NOW()),
(18, 'Escape Room: The Secret Vault Challenge', 'Locked inside the historical physics archive! Your team has 45 minutes to solve mechanical locks and laser puzzles to escape.', 'Old Science Block - Room 104', '2026-11-29 13:00:00', 48, 60.00, 'INFORMALS', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', 'UPCOMING', 1, NOW(), NOW());

-- ====================================================================
-- 3. INSERT REGISTRATIONS
-- ====================================================================

INSERT INTO "Registration" ("id", "userId", "eventId", "status", "registeredAt") VALUES
-- Rahul (User 2)
(1, 2, 1, 'CONFIRMED', NOW() - INTERVAL '3 days'),
(2, 2, 2, 'CONFIRMED', NOW() - INTERVAL '3 days'),
(3, 2, 10, 'CONFIRMED', NOW() - INTERVAL '2 days'),
(4, 2, 14, 'CONFIRMED', NOW() - INTERVAL '1 day'),

-- Ananya (User 3)
(5, 3, 6, 'CONFIRMED', NOW() - INTERVAL '4 days'),
(6, 3, 7, 'CONFIRMED', NOW() - INTERVAL '3 days'),
(7, 3, 13, 'CONFIRMED', NOW() - INTERVAL '2 days'),
(8, 3, 15, 'CONFIRMED', NOW() - INTERVAL '1 day'),

-- Siddharth (User 4)
(9, 4, 1, 'CONFIRMED', NOW() - INTERVAL '4 days'),
(10, 4, 3, 'CONFIRMED', NOW() - INTERVAL '3 days'),
(11, 4, 11, 'CONFIRMED', NOW() - INTERVAL '2 days'),
(12, 4, 17, 'CONFIRMED', NOW() - INTERVAL '1 day'),

-- Pooja (User 5)
(13, 5, 4, 'CONFIRMED', NOW() - INTERVAL '3 days'),
(14, 5, 8, 'CONFIRMED', NOW() - INTERVAL '2 days'),
(15, 5, 15, 'PENDING', NOW() - INTERVAL '1 day'),

-- Rohan (User 6)
(16, 6, 10, 'CONFIRMED', NOW() - INTERVAL '3 days'),
(17, 6, 12, 'CONFIRMED', NOW() - INTERVAL '2 days'),
(18, 6, 16, 'CONFIRMED', NOW() - INTERVAL '1 day'),

-- Sneha (User 7)
(19, 7, 6, 'CONFIRMED', NOW() - INTERVAL '4 days'),
(20, 7, 9, 'CONFIRMED', NOW() - INTERVAL '3 days'),
(21, 7, 14, 'CONFIRMED', NOW() - INTERVAL '2 days'),
(22, 7, 18, 'CONFIRMED', NOW() - INTERVAL '1 day'),

-- Vikram (User 8)
(23, 8, 15, 'CONFIRMED', NOW() - INTERVAL '3 days'),
(24, 8, 17, 'CONFIRMED', NOW() - INTERVAL '2 days'),
(25, 8, 1, 'PENDING', NOW() - INTERVAL '1 day'),

-- Meera (User 9)
(26, 9, 9, 'CONFIRMED', NOW() - INTERVAL '3 days'),
(27, 9, 10, 'CONFIRMED', NOW() - INTERVAL '2 days'),
(28, 9, 14, 'CANCELLED', NOW() - INTERVAL '4 days'),

-- Aditya (User 10)
(29, 10, 1, 'CONFIRMED', NOW() - INTERVAL '3 days'),
(30, 10, 2, 'CONFIRMED', NOW() - INTERVAL '2 days'),
(31, 10, 5, 'CONFIRMED', NOW() - INTERVAL '1 day'),

-- Tanvi (User 11)
(32, 11, 6, 'CONFIRMED', NOW() - INTERVAL '3 days'),
(33, 11, 13, 'CONFIRMED', NOW() - INTERVAL '2 days'),
(34, 11, 16, 'CONFIRMED', NOW() - INTERVAL '1 day'),
(35, 11, 18, 'CANCELLED', NOW() - INTERVAL '4 days');

-- ====================================================================
-- 4. INSERT PAYMENTS (Razorpay Sandbox Records)
-- ====================================================================

INSERT INTO "Payment" ("id", "registrationId", "amount", "method", "status", "razorpayOrderId", "razorpayPaymentId", "razorpaySignature", "paidAt", "createdAt") VALUES
-- Rahul payments
(1, 1, 250.00, 'UPI', 'SUCCESS', 'order_rzp_001', 'pay_rzp_test_001', 'sig_verified_001', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(2, 3, 300.00, 'UPI', 'SUCCESS', 'order_rzp_002', 'pay_rzp_test_002', 'sig_verified_002', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(3, 4, 100.00, 'UPI', 'SUCCESS', 'order_rzp_003', 'pay_rzp_test_003', 'sig_verified_003', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

-- Ananya payments
(4, 5, 150.00, 'CARD', 'SUCCESS', 'order_rzp_004', 'pay_rzp_test_004', 'sig_verified_004', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
(5, 6, 100.00, 'UPI', 'SUCCESS', 'order_rzp_005', 'pay_rzp_test_005', 'sig_verified_005', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(6, 8, 120.00, 'UPI', 'SUCCESS', 'order_rzp_006', 'pay_rzp_test_006', 'sig_verified_006', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

-- Siddharth payments
(7, 9, 250.00, 'NET_BANKING', 'SUCCESS', 'order_rzp_007', 'pay_rzp_test_007', 'sig_verified_007', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
(8, 10, 150.00, 'UPI', 'SUCCESS', 'order_rzp_008', 'pay_rzp_test_008', 'sig_verified_008', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(9, 11, 150.00, 'CARD', 'SUCCESS', 'order_rzp_009', 'pay_rzp_test_009', 'sig_verified_009', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(10, 12, 80.00, 'UPI', 'SUCCESS', 'order_rzp_010', 'pay_rzp_test_010', 'sig_verified_010', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

-- Pooja payments
(11, 13, 200.00, 'UPI', 'SUCCESS', 'order_rzp_011', 'pay_rzp_test_011', 'sig_verified_011', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(12, 15, 120.00, 'UPI', 'PENDING', 'order_rzp_012', NULL, NULL, NULL, NOW() - INTERVAL '1 day'),

-- Rohan payments
(13, 16, 300.00, 'UPI', 'SUCCESS', 'order_rzp_013', 'pay_rzp_test_013', 'sig_verified_013', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(14, 17, 250.00, 'NET_BANKING', 'SUCCESS', 'order_rzp_014', 'pay_rzp_test_014', 'sig_verified_014', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(15, 18, 50.00, 'UPI', 'SUCCESS', 'order_rzp_015', 'pay_rzp_test_015', 'sig_verified_015', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

-- Sneha payments
(16, 19, 150.00, 'CARD', 'SUCCESS', 'order_rzp_016', 'pay_rzp_test_016', 'sig_verified_016', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
(17, 21, 100.00, 'UPI', 'SUCCESS', 'order_rzp_017', 'pay_rzp_test_017', 'sig_verified_017', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(18, 22, 60.00, 'WALLET', 'SUCCESS', 'order_rzp_018', 'pay_rzp_test_018', 'sig_verified_018', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

-- Vikram payments
(19, 23, 120.00, 'UPI', 'SUCCESS', 'order_rzp_019', 'pay_rzp_test_019', 'sig_verified_019', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(20, 24, 80.00, 'CARD', 'SUCCESS', 'order_rzp_020', 'pay_rzp_test_020', 'sig_verified_020', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(21, 25, 250.00, 'UPI', 'PENDING', 'order_rzp_021', NULL, NULL, NULL, NOW() - INTERVAL '1 day'),

-- Meera payments (including refund)
(22, 27, 300.00, 'UPI', 'SUCCESS', 'order_rzp_022', 'pay_rzp_test_022', 'sig_verified_022', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(23, 28, 100.00, 'UPI', 'REFUNDED', 'order_rzp_023', 'pay_rzp_test_023', 'sig_verified_023', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),

-- Aditya payments
(24, 29, 250.00, 'UPI', 'SUCCESS', 'order_rzp_024', 'pay_rzp_test_024', 'sig_verified_024', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(25, 31, 100.00, 'NET_BANKING', 'SUCCESS', 'order_rzp_025', 'pay_rzp_test_025', 'sig_verified_025', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

-- Tanvi payments (including refund)
(26, 32, 150.00, 'CARD', 'SUCCESS', 'order_rzp_026', 'pay_rzp_test_026', 'sig_verified_026', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(27, 34, 50.00, 'UPI', 'SUCCESS', 'order_rzp_027', 'pay_rzp_test_027', 'sig_verified_027', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
(28, 35, 60.00, 'WALLET', 'REFUNDED', 'order_rzp_028', 'pay_rzp_test_028', 'sig_verified_028', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days');

-- ====================================================================
-- 5. UPDATE SEQUENCES (Auto-increment Continuation)
-- ====================================================================

SELECT setval(pg_get_serial_sequence('"User"', 'id'), coalesce(max("id"), 1)) FROM "User";
SELECT setval(pg_get_serial_sequence('"Event"', 'id'), coalesce(max("id"), 1)) FROM "Event";
SELECT setval(pg_get_serial_sequence('"Registration"', 'id'), coalesce(max("id"), 1)) FROM "Registration";
SELECT setval(pg_get_serial_sequence('"Payment"', 'id'), coalesce(max("id"), 1)) FROM "Payment";

ANALYZE;

-- ====================================================================
-- College Event Management System (CampusPulse) - Sample Queries
-- DBMS Project - Relational & Analytical Queries for Evaluation
-- ====================================================================

\c event_management;

-- --------------------------------------------------------------------
-- Query 1: 4-Table INNER JOIN
-- Retrieve student details, event title, category, ticket status,
-- and Razorpay transaction IDs for all confirmed registrations.
-- --------------------------------------------------------------------
SELECT 
    u.id AS student_id,
    u.name AS student_name,
    u.department,
    e.title AS event_title,
    e.category,
    e.venue,
    r.status AS registration_status,
    p.amount AS fee_paid,
    p.method AS payment_method,
    p.status AS payment_status,
    p."razorpayPaymentId" AS payment_reference
FROM "Registration" r
JOIN "User" u ON r."userId" = u.id
JOIN "Event" e ON r."eventId" = e.id
LEFT JOIN "Payment" p ON p."registrationId" = r.id
WHERE r.status = 'CONFIRMED'
ORDER BY r."registeredAt" DESC;

-- --------------------------------------------------------------------
-- Query 2: Aggregate & GROUP BY with Revenue Calculation
-- Summary of total active events, total confirmed attendees,
-- and total collected revenue grouped by Event Category.
-- --------------------------------------------------------------------
SELECT 
    e.category,
    COUNT(DISTINCT e.id) AS total_events,
    COUNT(r.id) AS total_confirmed_registrations,
    COALESCE(SUM(p.amount), 0.00) AS total_revenue_collected
FROM "Event" e
LEFT JOIN "Registration" r ON e.id = r."eventId" AND r.status = 'CONFIRMED'
LEFT JOIN "Payment" p ON p."registrationId" = r.id AND p.status = 'SUCCESS'
GROUP BY e.category
ORDER BY total_revenue_collected DESC;

-- --------------------------------------------------------------------
-- Query 3: Capacity Utilization & Spots Remaining
-- Identifies events with current attendance numbers and calculates
-- remaining seats and capacity percentage.
-- --------------------------------------------------------------------
SELECT 
    e.id,
    e.title,
    e.category,
    e."maxCapacity" AS max_seats,
    COUNT(r.id) AS booked_seats,
    (e."maxCapacity" - COUNT(r.id)) AS seats_remaining,
    ROUND((COUNT(r.id)::DECIMAL / e."maxCapacity") * 100, 1) AS percent_filled
FROM "Event" e
LEFT JOIN "Registration" r ON e.id = r."eventId" AND r.status != 'CANCELLED'
GROUP BY e.id, e.title, e.category, e."maxCapacity"
ORDER BY percent_filled DESC;

-- --------------------------------------------------------------------
-- Query 4: Department-wise Student Participation
-- Which college departments are most active in campus events?
-- --------------------------------------------------------------------
SELECT 
    u.department,
    COUNT(DISTINCT u.id) AS participating_students,
    COUNT(r.id) AS total_event_registrations
FROM "User" u
JOIN "Registration" r ON u.id = r."userId"
WHERE u.role = 'USER' AND r.status = 'CONFIRMED'
GROUP BY u.department
HAVING COUNT(r.id) > 0
ORDER BY total_event_registrations DESC;

-- --------------------------------------------------------------------
-- Query 5: Subquery - Students Participating in Multiple Categories
-- Find students who have registered for at least one TECH event
-- AND at least one INFORMALS/CULTURAL event.
-- --------------------------------------------------------------------
SELECT 
    u.id, 
    u.name, 
    u.email, 
    u.department
FROM "User" u
WHERE u.id IN (
    -- Students in TECH
    SELECT r."userId" 
    FROM "Registration" r
    JOIN "Event" e ON r."eventId" = e.id
    WHERE e.category = 'TECH' AND r.status = 'CONFIRMED'
)
AND u.id IN (
    -- Students in INFORMALS
    SELECT r."userId" 
    FROM "Registration" r
    JOIN "Event" e ON r."eventId" = e.id
    WHERE e.category = 'INFORMALS' AND r.status = 'CONFIRMED'
);

-- --------------------------------------------------------------------
-- Query 6: Payment Method Breakdown
-- Financial breakdown of payments collected across UPI, Card, Net Banking.
-- --------------------------------------------------------------------
SELECT 
    method,
    COUNT(id) AS transaction_count,
    SUM(amount) AS total_volume,
    ROUND(AVG(amount), 2) AS average_ticket_size
FROM "Payment"
WHERE status = 'SUCCESS'
GROUP BY method
ORDER BY total_volume DESC;

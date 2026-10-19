# Database Configuration & SQL Scripts (`./db_cfg`)

This directory contains standalone, pure PostgreSQL SQL scripts for creating, maintaining, and testing the database for the **CampusPulse — College Event Management System** DBMS project.

---

## 📁 Directory Structure

| File | Purpose | Description |
|---|---|---|
| `01_init_database.sql` | **Database Creation** | Creates the `event_management` database in PostgreSQL if it doesn't already exist. |
| `02_create_schema.sql` | **DDL Schema Definition** | Defines all ENUMs (`Role`, `Category`, `EventStatus`, `RegistrationStatus`, `PaymentStatus`, `PaymentMethod`), tables (`User`, `Event`, `Registration`, `Payment`), primary/foreign keys (`ON DELETE CASCADE`), unique constraints, and indexes. |
| `03_seed_data.sql` | **Test Data Population** | Seeds 1 Admin, 10 Student accounts, 18 events across 4 categories, and 35 registrations with Razorpay payment records, while resetting auto-increment sequences. |
| `04_sample_queries.sql` | **DBMS Analytical Queries** | Pre-written SQL queries demonstrating JOINs, GROUP BY, aggregations, subqueries, and capacity calculations for DBMS course viva / evaluation. |

---

## 🚀 How to Execute the Scripts

### Method 1: Automated One-Liner (Terminal)
Run all setup scripts in sequence from the project root:

```bash
# Set your postgres password if required
export PGPASSWORD=postgres

# 1. Create database
psql -h localhost -U souren -d postgres -f db_cfg/01_init_database.sql

# 2. Create tables & schema
psql -h localhost -U souren -d event_management -f db_cfg/02_create_schema.sql

# 3. Populate sample test data
psql -h localhost -U souren -d event_management -f db_cfg/03_seed_data.sql
```

### Method 2: Interactive `psql` Shell
```bash
psql -h localhost -U souren -d event_management
```
Inside the `psql` prompt, run:
```sql
\i db_cfg/02_create_schema.sql
\i db_cfg/03_seed_data.sql
\i db_cfg/04_sample_queries.sql
```

---

## 🔑 Default Credentials in Seed Data

| Account | Email | Password | Role | Department |
|---|---|---|---|---|
| **Admin** | `admin@college.edu` | `admin123` | ADMIN | Administration |
| **Student 1** | `student@college.edu` | `student123` | USER | Computer Science |
| **Student 2** | `ananya@college.edu` | `student123` | USER | Electronics & Communication |
| **Student 3** | `sid@college.edu` | `student123` | USER | Information Technology |
| **Student 4** | `pooja@college.edu` | `student123` | USER | Mechanical Engineering |
| **Student 5** | `rohan@college.edu` | `student123` | USER | Artificial Intelligence & Data Science |
| **Student 6** | `sneha@college.edu` | `student123` | USER | Electrical Engineering |
| **Student 7** | `vikram@college.edu` | `student123` | USER | Civil Engineering |
| **Student 8** | `meera@college.edu` | `student123` | USER | Biotechnology |
| **Student 9** | `aditya@college.edu` | `student123` | USER | Computer Science |
| **Student 10** | `tanvi@college.edu` | `student123` | USER | Business Administration (MBA) |

---

## 📊 Summary of Populated Content

- **1 Admin Profile**
- **10 Student Profiles**
- **18 Campus Events:**
  - 💻 **TECH (5):** Hackathons, Competitive Coding, Ethical Hacking CTF, RoboWars, Web3 Buildathon
  - 🎭 **CULTURAL (4):** Music Fest, Dance Showcase, Street Play (Nukkad Natak), Fine Arts & Graffiti
  - 🛠️ **WORKSHOP (4):** Generative AI Agents, Cloud DevOps & K8s, IoT Raspberry Pi, UI/UX Design Sprint
  - 🎯 **INFORMALS (5):** Laser Tag 4v4 Arena, Soapy Football Cup, Midnight Treasure Hunt, Gaming LAN Arena, Escape Room
- **35 Registrations:** Spanning Confirmed, Free, Pending Payment, and Cancelled/Refunded statuses.
- **28 Payment Ledger Entries:** Realistically distributed across UPI, Card, Net Banking, and Wallets.

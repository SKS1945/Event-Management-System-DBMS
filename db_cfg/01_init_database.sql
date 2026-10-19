-- ====================================================================
-- College Event Management System (CampusPulse) - Database Init
-- DBMS Project - PostgreSQL
-- ====================================================================

-- 1. Create database if not exists (run connected to default 'postgres' database)
SELECT 'CREATE DATABASE event_management'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'event_management')\gexec

-- Connect to the newly created database
\c event_management;

-- Set standard client encoding
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

# Database Configuration Guide

This project supports both **Supabase Cloud** and **Local PostgreSQL** databases.

## Current Setup: Supabase Cloud

By default, the application uses Supabase cloud database configured in `.env`:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

The Supabase client is automatically configured in `src/lib/supabase.ts`.

---

## Switch to Local PostgreSQL

To use a local PostgreSQL database for development:

### 1. Install PostgreSQL

Install PostgreSQL on your local machine:
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql@15`
- **Linux**: `sudo apt-get install postgresql-15`

### 2. Create Database

```bash
# Start PostgreSQL service
sudo service postgresql start  # Linux
brew services start postgresql  # macOS

# Create database
createdb internal_systems_db

# Or using psql
psql -U postgres
CREATE DATABASE internal_systems_db;
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and update:

```env
# Enable local database mode
VITE_USE_LOCAL_DB=true

# Local PostgreSQL credentials
VITE_LOCAL_DB_HOST=localhost
VITE_LOCAL_DB_PORT=5432
VITE_LOCAL_DB_NAME=internal_systems_db
VITE_LOCAL_DB_USER=postgres
VITE_LOCAL_DB_PASSWORD=your-password
```

### 4. Initialize Database Schema

Create the necessary tables:

```sql
-- Users table (authentication)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Destinations table (tourism)
CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration VARCHAR(50),
  rating DECIMAL(3, 2),
  image VARCHAR(500),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  guests INTEGER NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- KYC Verifications
CREATE TABLE IF NOT EXISTS kyc_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  document_number VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System access logs (Internal Systems Directory)
CREATE TABLE IF NOT EXISTS system_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  system_id VARCHAR(50) NOT NULL,
  system_name VARCHAR(255) NOT NULL,
  accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## How It Works

The application automatically detects which database to use:

- **When `VITE_USE_LOCAL_DB=true`**: Connects to local PostgreSQL
- **Otherwise**: Connects to Supabase cloud

Configuration is in `src/lib/supabase.ts` and handles both scenarios seamlessly.

---

## Database Switching

### Quick Toggle

Simply change the `VITE_USE_LOCAL_DB` variable in your `.env` file:

```env
# Use Supabase Cloud
VITE_USE_LOCAL_DB=false

# OR use Local PostgreSQL
VITE_USE_LOCAL_DB=true
```

Restart your development server after changes.

---

## Troubleshooting

### Connection Errors
- Ensure PostgreSQL service is running
- Verify credentials in `.env` are correct
- Check PostgreSQL is listening on the specified port

### Permission Errors
Grant proper permissions:
```sql
GRANT ALL PRIVILEGES ON DATABASE internal_systems_db TO postgres;
```

### Schema Not Found
Run the initialization SQL script above to create required tables.

---

## Production Deployment

For production, it's recommended to use **Supabase Cloud** for:
- Automatic backups
- Built-in authentication
- Row Level Security (RLS)
- Real-time subscriptions
- Automatic SSL/TLS
- Managed infrastructure

Only use local PostgreSQL for development and testing.

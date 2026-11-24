# RoomSync – Meeting Room Booking System

RoomSync is a meeting room booking application built with Next.js and PostgreSQL. It allows employees to view meeting rooms, check availability, create bookings, and manage their own bookings. Administrators can manage rooms and all bookings.

## Features

### Employee
- Login with email and password.
- View available meeting rooms.
- View room capacity and amenities.
- Check existing bookings for a selected date.
- Book a meeting room.
- View upcoming bookings.
- Cancel own bookings.

### Admin
- Admin dashboard.
- View all meeting rooms.
- Add new meeting rooms.
- Edit room details.
- Activate or deactivate rooms.
- View all bookings.
- Cancel any booking.

### Booking Rules
- Bookings are allowed between 08:00 AM and 08:00 PM.
- Bookings must use 15-minute time increments.
- Minimum booking duration: 15 minutes.
- Maximum booking duration: 4 hours.
- Bookings cannot be made in the past.
- Bookings cannot be made more than 30 days in advance.
- A room cannot have overlapping confirmed bookings.
- Employees can have a maximum of 3 upcoming bookings.
- Admins have no booking limit.
- Inactive rooms cannot be booked.

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Authentication:** Email/password with bcryptjs
- **Package Manager:** pnpm

## Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/Manish9420/Roomsync.git
cd Roomsync
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://postgres.jgywafcxeymaaymsaewp:eAgdk51tWI8DiqcD@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

DIRECT_URL="postgresql://postgres.jgywafcxeymaaymsaewp:eAgdk51tWI8DiqcD@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
```

### 4. Generate Prisma Client

```bash
pnpm prisma generate
```

### 5. Run database migrations

```bash
pnpm prisma migrate dev
```

### 6. Seed the database

```bash
pnpm prisma db seed
```

This creates the demo users and meeting rooms.

### 7. Start the development server

```bash
pnpm dev
```

Open the application:

[http://localhost:3000](http://localhost:3000)

## Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@roomsync.com | Admin@123 |
| Employee | employee@roomsync.com | Employee@123 |
| Employee | employee2@roomsync.com | Employee2@123 |

## Database

The application uses PostgreSQL with Prisma ORM.

### Main Models

- **User:** Stores user information and roles.
- **Room:** Stores meeting room details, capacity, amenities, and active status.
- **Booking:** Stores booking details, timings, ownership, and booking status.

## Important Note

This project is an interview demonstration. Its current login implementation stores user information in browser localStorage and uses the supplied user ID in API requests. It is not production-grade authentication and should be replaced with secure server-side sessions or token-based authentication before production use.

## Author

Developed as a meeting room booking application project using Next.js, Prisma, and PostgreSQL.
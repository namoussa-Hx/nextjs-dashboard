# 📊 Contacts Dashboard — Next.js + Clerk + Supabase

A full-stack dashboard application that displays agencies and employee contacts with user authentication and a **50-contacts-per-day limit**.  
This project demonstrates secure authentication, rate-limited data access, and clean API/database architecture using modern web technologies.

---

## 🚀 Features

### 🔐 User Authentication (Clerk)
- Sign-in / Sign-up
- Session management
- Secure tokens
- Protected routes

### 🌐 Frontend (Next.js)
- Pages: Home, Agencies, Contacts
- Pagination UI
- Dynamic data fetching from API
- Daily limit banner
- Fully protected pages via Clerk

### 🛠 API Layer
- `GET /api/agencies`
- `GET /api/contacts?limit=&offset=`  
  → Enforces daily 50-contact limit  
- `POST /api/view_log`  
  → Increments the user’s view count

### 🗄 Database (Supabase / PostgreSQL)
- `agencies` table  
- `contacts` table  
- `view_logs` (daily limit tracking)  
- SQL UPSERT to safely increment counters



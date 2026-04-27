# Food Redistribution Platform - System Overview

## 🎯 Smart Food Routing System

This platform automatically routes uploaded food based on AI-detected freshness:

### Food Routing Logic

#### ✅ Fresh Food (< 4 hours old)
- **Destination:** NGO Dashboard
- **Freshness Score:** 85-100%
- **Purpose:** Distribution to people in need
- **Status:** Available for NGO acceptance

#### ⚠️ Near Expiry Food (4-8 hours old)
- **Destination:** Farm Dashboard
- **Freshness Score:** 50-80%
- **Purpose:** Composting and recycling
- **Status:** Available for farm acceptance

#### ❌ Expired Food (> 8 hours old)
- **Destination:** Farm Dashboard
- **Freshness Score:** 20-50%
- **Purpose:** Composting and recycling
- **Status:** Available for farm acceptance

---

## 📋 How to Test the System

### Demo Credentials
```
Donor Account:
- Email: donor@demo.com
- Password: donor123

NGO Account:
- Email: ngo@demo.com
- Password: ngo123

Farm Account:
- Email: farm@demo.com
- Password: farm123
```

### Testing Food Upload

1. **Login as Donor** (donor@demo.com / donor123)
2. Click "New Donation" button
3. Upload a food image
4. Fill in food details:
   - Food Type (e.g., "Fresh Vegetables")
   - Quantity (e.g., "5 kg")
   - Prepared Time (select a time)
   - Pickup Location (or use GPS detection)
5. Click "Upload Food"

### Testing Fresh Food Flow (NGO)

**As Donor:**
- Set prepared time to **current time** or within last 3 hours
- Upload the food
- You'll see "Fresh" status with routing message

**As NGO:**
- Logout and login with NGO account
- Go to "Incoming Requests" tab
- You'll see the fresh food listed
- Click "Accept" to process the donation

### Testing Expired Food Flow (Farm)

**As Donor:**
- Set prepared time to **10-12 hours ago**
- Upload the food
- You'll see "Near Expiry" or "Expired" status

**As Farm:**
- Logout and login with Farm account
- Go to "Incoming Requests" tab
- You'll see the expired food listed
- Click "Accept for Composting"

---

## 🔧 Backend Integration

To connect to your FastAPI backend:

1. Open `/services/api.ts`
2. Change `USE_MOCK_API` to `false`:
   ```typescript
   export const USE_MOCK_API = false;
   ```
3. Update `BASE_API_URL` to your backend URL:
   ```typescript
   export const BASE_API_URL = 'https://your-backend-api.com';
   ```

### Expected API Endpoints

Your FastAPI backend should implement these endpoints:

```
POST   /auth/login
POST   /food/upload
GET    /donor/history
GET    /analytics/donor
GET    /ngo/requests
POST   /ngo/accept/{id}
POST   /ngo/reject/{id}
GET    /ngo/deliveries
GET    /analytics/ngo
GET    /farm/requests
POST   /farm/accept/{id}
POST   /farm/reject/{id}
GET    /farm/compost
GET    /analytics/farm
```

---

## 🎨 Key Features

### Donor Dashboard
- Upload food with AI freshness detection
- Track donation history
- View analytics and impact metrics

### NGO Dashboard
- View incoming fresh food donations
- Accept/reject donation requests
- Track delivery status in real-time
- Monitor distribution analytics

### Farm Dashboard
- Receive near-expiry/expired food
- Track composting progress
- View recycling analytics
- Monitor environmental impact

---

## 💡 AI Freshness Detection

The system calculates freshness based on:
- **Prepared Time** vs **Current Time**
- Automatic score calculation
- Smart routing decision
- Confidence level reporting

### Freshness Calculation
```typescript
Hours Since Prepared    Status          Score      Destination
0-4 hours             → Fresh         → 85-100%  → NGO
4-8 hours             → Near Expiry   → 50-80%   → Farm
8+ hours              → Expired       → 20-50%   → Farm
```

---

## 🚀 Production Deployment

When deploying to production:

1. Set up your FastAPI backend
2. Configure authentication endpoints
3. Update `BASE_API_URL` in `/services/api.ts`
4. Set `USE_MOCK_API = false`
5. Ensure all API endpoints match the expected format
6. Test all three dashboards with real data

---

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

All dashboards adapt to different screen sizes automatically.

# AI-Based Food Redistribution & Recycling Platform - Frontend

A production-ready React frontend for managing food donations, redistribution to NGOs, and composting through farms, powered by AI freshness detection.

## 🎯 Features

### Three Role-Based Dashboards

#### 1. **Donor Dashboard**
- Upload food with image, type, quantity, prepared time, and location
- Auto-detect pickup location using geolocation
- View AI-powered freshness status (Fresh/Near Expiry)
- Track donation status in real-time
- Analytics dashboard with charts
- View donation history

#### 2. **NGO Dashboard**
- View incoming food donation requests
- Accept or reject donations
- Track active deliveries with live status
- View delivery routes on map
- Analytics for food received and delivery performance

#### 3. **Farm Dashboard**
- Receive near-expiry food for composting
- Accept or reject composting requests
- Track composting progress
- Monitor environmental impact (CO₂ offset, waste recycled)
- View compost production analytics

## 🏗️ Project Structure

```
src/
├── pages/
│   ├── Login.tsx                 # Authentication page
│   ├── DonorDashboard.tsx        # Donor dashboard with upload & tracking
│   ├── NGODashboard.tsx          # NGO dashboard with requests & deliveries
│   └── FarmDashboard.tsx         # Farm dashboard with composting
│
├── components/
│   ├── DashboardLayout.tsx       # Shared dashboard layout with header
│   ├── FoodUploadForm.tsx        # Food donation upload form
│   ├── DonationCard.tsx          # Reusable donation card component
│   ├── MapView.tsx               # Map visualization for routes
│   ├── AnalyticsChart.tsx        # Chart component for analytics
│   └── StatsCard.tsx             # Statistics card component
│
├── services/
│   └── api.ts                    # Centralized API service layer
│
├── routes/
│   └── ProtectedRoute.tsx        # Role-based route protection
│
├── styles/
│   └── globals.css               # Global styles and animations
│
└── App.tsx                       # Main app with routing
```

## 🔌 API Integration

All API calls are centralized in `/services/api.ts`. Change the backend URL by updating a single variable:

```typescript
export const BASE_API_URL = 'http://localhost:8000';
```

### Authentication
- **POST** `/auth/login` - User login with email & password

### Donor APIs
- **POST** `/food/upload` - Upload food donation (multipart/form-data)
- **GET** `/donor/history` - Get donation history
- **GET** `/analytics/donor` - Get donor analytics

### NGO APIs
- **GET** `/ngo/requests` - Get incoming donation requests
- **POST** `/ngo/accept/{donationId}` - Accept a donation
- **POST** `/ngo/reject/{donationId}` - Reject a donation
- **GET** `/ngo/deliveries` - Get active deliveries
- **GET** `/analytics/ngo` - Get NGO analytics

### Farm APIs
- **GET** `/farm/requests` - Get composting requests
- **POST** `/farm/accept/{requestId}` - Accept composting request
- **POST** `/farm/reject/{requestId}` - Reject composting request
- **GET** `/farm/compost` - Get compost tracking data
- **GET** `/analytics/farm` - Get farm analytics

### Delivery APIs
- **GET** `/delivery/status/{deliveryId}` - Get delivery status
- **GET** `/delivery/route/{deliveryId}` - Get optimized route

## 📊 Expected API Response Formats

### Login Response
```json
{
  "token": "jwt_token_here",
  "role": "donor" | "ngo" | "farm"
}
```

### Food Upload Response
```json
{
  "id": "donation_id",
  "freshnessStatus": "Fresh" | "Near Expiry",
  "confidence": 0.95
}
```

### Donation History Response
```json
{
  "donations": [
    {
      "id": "1",
      "foodType": "Cooked Rice",
      "quantity": "5 kg",
      "status": "Delivered",
      "image": "https://...",
      "pickupLocation": "123 Main St",
      "assignedTo": "Food Bank XYZ",
      "estimatedDelivery": "2 hours",
      "freshnessStatus": "Fresh"
    }
  ]
}
```

### Analytics Response
```json
{
  "totalDonations": 25,
  "successfulDeliveries": 22,
  "wastePrevented": 150,
  "chartData": [
    {
      "period": "Mon",
      "donations": 5,
      "impact": 20
    }
  ]
}
```

### NGO Requests Response
```json
{
  "requests": [
    {
      "id": "1",
      "foodType": "Fresh Vegetables",
      "quantity": "10 kg",
      "status": "Pending",
      "image": "https://...",
      "pickupLocation": "456 Oak Ave",
      "distance": 2.5,
      "freshnessScore": 0.92,
      "freshnessStatus": "Fresh"
    }
  ]
}
```

### Delivery Tracking Response
```json
{
  "deliveries": [
    {
      "id": "1",
      "foodType": "Cooked Meals",
      "quantity": "20 portions",
      "status": "In Transit",
      "estimatedDelivery": "30 minutes",
      "donorLocation": {
        "lat": 40.7128,
        "lng": -74.0060,
        "label": "123 Main St"
      },
      "ngoLocation": {
        "lat": 40.7589,
        "lng": -73.9851,
        "label": "Food Bank"
      },
      "route": [
        { "lat": 40.7128, "lng": -74.0060 },
        { "lat": 40.7589, "lng": -73.9851 }
      ]
    }
  ]
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- Backend API running (FastAPI recommended)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Update API URL in `/services/api.ts`:
```typescript
export const BASE_API_URL = 'YOUR_BACKEND_URL';
```

3. Start development server:
```bash
npm run dev
```

## 🔐 Authentication Flow

1. User logs in via `/login` page
2. Backend returns JWT token and user role
3. Token stored in `localStorage`
4. User redirected to role-specific dashboard
5. All subsequent API calls include token in Authorization header
6. Protected routes verify token and role before rendering

## 🗺️ Map Integration

The `MapView` component is ready for Google Maps or Mapbox integration. To enable:

1. Set up API key in environment:
```bash
VITE_GOOGLE_MAPS_API_KEY=your_key_here
# OR
VITE_MAPBOX_TOKEN=your_token_here
```

2. Integrate map library of choice in `/components/MapView.tsx`

## 📱 Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interactions
- Optimized for tablets and desktops

## 🎨 UI/UX Features

- Clean, professional color palette
- Role-specific color coding (Blue: Donor, Green: NGO, Amber: Farm)
- Loading states for all async operations
- Empty states with helpful messages
- Error handling with user-friendly messages
- Smooth animations and transitions

## 🔄 State Management

- React hooks for local state
- API calls via Axios with async/await
- Token-based authentication
- Real-time data fetching with manual refresh

## 📦 Key Dependencies

- **react-router-dom** - Routing and navigation
- **axios** - HTTP client for API calls
- **recharts** - Charts and analytics visualization
- **lucide-react** - Icon library
- **tailwindcss** - Utility-first CSS framework

## 🧪 Testing the Frontend

### Without Backend (Development):
The app expects real API responses. To test without a backend:

1. Use a mock API service (json-server, Mockoon)
2. Create mock endpoints matching the API structure above

### With Backend:
1. Ensure backend is running
2. Update `BASE_API_URL` to backend URL
3. Test all three user roles separately

## 🔒 Security Considerations

- JWT tokens stored in localStorage
- Protected routes verify authentication and role
- All API requests include auth token
- Input validation on forms
- **Note**: This is frontend-only. Backend must implement proper security (HTTPS, token validation, etc.)

## 🌐 Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

Then update `/services/api.ts`:
```typescript
export const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

## 📝 Development Notes

- All data is fetched from APIs (no hardcoded data)
- Components are reusable and well-structured
- Error handling implemented throughout
- TypeScript for type safety
- Clean code architecture ready for scaling

## 🤝 Backend Integration Checklist

- [ ] Set correct `BASE_API_URL`
- [ ] Implement all API endpoints listed above
- [ ] Return data in expected JSON format
- [ ] Enable CORS for frontend domain
- [ ] Implement JWT authentication
- [ ] Handle file uploads (multipart/form-data)
- [ ] Return AI freshness predictions
- [ ] Implement role-based access control

## 📄 License

This frontend is production-ready and can be integrated with any backend that implements the specified API contract.

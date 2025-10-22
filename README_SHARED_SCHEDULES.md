# Shared Schedule System

This implementation allows multiple users to create schedules from different devices and see all schedules in the app dashboard.

## Features

- **Multi-User Support**: Different users can create schedules from any device
- **Real-Time Updates**: Schedules are synchronized across all devices
- **User Identification**: Each schedule shows who created it
- **Shared Dashboard**: All users can see all schedules in the dashboard
- **Backend API**: RESTful API for schedule management

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Application

#### Option A: Development Mode (Frontend + Backend)
```bash
npm run dev:full
```
This runs both the React frontend (Vite) and the Express backend simultaneously.

#### Option B: Production Mode
```bash
npm run build
npm run start
```

### 3. Access the Application

- **Frontend**: http://localhost:5173 (development) or http://localhost:3001 (production)
- **Backend API**: http://localhost:3001/api

## API Endpoints

- `GET /api/schedules` - Get all schedules
- `POST /api/schedules` - Create a new schedule
- `PUT /api/schedules/:id` - Update a schedule
- `DELETE /api/schedules/:id` - Delete a schedule

## How It Works

### User Identification
- Each device gets a unique user ID stored in localStorage
- Users can set their display name
- Schedules show who created them

### Schedule Sharing
- All schedules are stored on the backend
- Real-time updates every 5 seconds
- All users see all schedules in the dashboard

### Multi-Device Support
- Open the app on different devices/browsers
- Each device gets a unique user ID
- Schedules created on one device appear on all devices
- Users can identify who created each schedule

## Testing Multi-User Functionality

1. **Open Multiple Browser Windows/Tabs**
   - Open the app in different browser windows
   - Each window will have a different user ID

2. **Create Schedules**
   - Set different user names in each window
   - Create schedules with different times and settings
   - Watch schedules appear in all windows

3. **Real-Time Updates**
   - Create a schedule in one window
   - It should appear in other windows within 5 seconds
   - Delete a schedule and see it disappear from all windows

## Deployment

### For Production Deployment:

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Set Environment Variables**
   ```bash
   export PORT=3001
   export NODE_ENV=production
   ```

3. **Run the Server**
   ```bash
   npm run start
   ```

### For Cloud Deployment:

1. **Heroku**
   - Add `"start": "node server.js"` to package.json
   - Deploy with `git push heroku main`

2. **Vercel/Netlify**
   - Build the app with `npm run build`
   - Deploy the `dist` folder
   - Set up a separate backend service

3. **Docker**
   ```dockerfile
   FROM node:18
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 3001
   CMD ["npm", "run", "start"]
   ```

## Database Integration

To use a real database instead of in-memory storage:

1. **Install Database Driver**
   ```bash
   npm install mongoose  # for MongoDB
   # or
   npm install pg        # for PostgreSQL
   ```

2. **Update server.js**
   - Replace in-memory storage with database calls
   - Add database connection and models

3. **Environment Variables**
   ```bash
   export DATABASE_URL=mongodb://localhost:27017/schedules
   # or
   export DATABASE_URL=postgresql://user:pass@localhost:5432/schedules
   ```

## Security Considerations

- Add authentication/authorization
- Implement rate limiting
- Add input validation
- Use HTTPS in production
- Add CORS configuration for specific domains

## Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Make sure the backend is running on port 3001
   - Check that CORS is properly configured

2. **Schedules Not Updating**
   - Check browser console for errors
   - Verify backend is running
   - Check network tab for API calls

3. **User ID Issues**
   - Clear localStorage to reset user ID
   - Check that user ID is being generated correctly

### Debug Mode:

Enable debug logging by setting:
```bash
export DEBUG=true
```

This will show detailed logs in the console.

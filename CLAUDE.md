# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `yarn dev` - Start development server on http://localhost:3000
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

### Package Manager
This project uses **Yarn 1.22.22** as specified in `package.json`. Always use `yarn` commands, not `npm`.

## Project Architecture

### Technology Stack
- **Next.js 15** with App Router
- **TypeScript 5** for type safety
- **Firebase** for authentication and database (client: v11, admin: v13)
- **Tailwind CSS 4** for styling
- **shadcn/ui** for UI components
- **React Hook Form + Zod** for form handling and validation
- **Resend** for email notifications
- **WhatsApp integration** for notifications
- **Recharts** for dashboard analytics and data visualization

### Core Architecture

**Service Management System** - "SejookNamatey" for Sejuk Sejuk Service Sdn Bhd (fictional air conditioning service company)

#### Authentication System
- **Firebase Auth** with email link authentication (passwordless)
- **Role-based access** with custom claims: `admin`, `worker`, `client`
- **Context-based auth** in `app/context/auth-context.tsx`
- **Protected routes** using `components/protected-route.tsx`

#### Application Structure
```
app/
├── api/                         # API routes
│   ├── create-customer-user/    # Customer user creation endpoint
│   ├── create-user-profile/     # User profile management endpoint
│   ├── create-worker/           # Worker creation endpoint
│   ├── email/                   # Email notification endpoint
│   ├── send-customer-login-link/# Customer login link generation
│   ├── set-user-role/           # Role management endpoint
│   └── whatsapp/                # WhatsApp integration endpoint
├── context/                     # React contexts
│   ├── auth-context.tsx         # Authentication state management
│   └── whatsapp.tsx             # WhatsApp context
├── dashboard/                   # Protected dashboard area
│   ├── create-new-worker/       # Worker creation page
│   ├── jobs/                    # Worker job management
│   ├── orders/                  # Order management
│   ├── submit-order/            # Order creation with customer management
│   └── worker-list/             # Worker management page
└── login/                       # Authentication flow
```

#### Component Organization
- **UI Components**: `components/ui/` (shadcn/ui components)
- **App Components**: `components/` (app-specific components)
- **Forms**: `components/forms/` (form components)
- **Dialogs**: `components/dialogs/` (modal dialogs)

#### Data Management
- **Firebase Firestore** for data persistence
- **Type definitions** in `types/global.d.types.ts`
- **Dummy data** in `data/dummy.json` for development

#### Key Features
1. **Role-based Navigation**: Sidebar content changes based on user role
2. **Job Management**: Workers can take and complete jobs with enhanced UI
3. **Order Tracking**: Full order lifecycle management with customer integration
4. **Customer Management**: Customer user creation and email-based authentication
5. **Worker Management**: Admin tools for creating and managing workers
6. **Dashboard Analytics**: Worker performance charts and job distribution metrics
7. **Notification System**: WhatsApp and email notifications for job completion
8. **Email Authentication**: Enhanced passwordless login with customer support
9. **Malaysia Address Support**: Malaysia-specific postcode integration

### User Roles & Permissions
- **Admin**: Full access to submit orders, view all orders, create workers, manage customers
- **Worker**: Access to jobs, can take and complete assignments, view assigned orders
- **Client**: Limited access with email-based authentication for order visibility
- **Customer**: Email-based login access for order tracking (implemented)

### Firebase Configuration
- Client config in `firebase/root.ts`
- Admin SDK in `firebase/admin.ts`
- Uses environment variables for configuration

### Form Handling Pattern
- React Hook Form + Zod validation
- Malaysia address form component for location input
- Consistent error handling and user feedback

### State Management
- React Context for authentication state
- Firebase real-time listeners for data updates
- Role-based UI rendering

## Important Notes

### Security
- Never commit Firebase config keys
- Use environment variables for sensitive data
- Custom claims are managed server-side via API routes

### Code Patterns
- All components use TypeScript
- Consistent naming: kebab-case for files, PascalCase for components
- Error boundaries and loading states
- Mobile-responsive design patterns

### Testing
- **Jest 30.0.0-alpha.7** with React Testing Library for component testing
- **GitHub Actions** workflow configured for CI/CD
- Test commands: `yarn test`, `yarn test:watch`, `yarn test:coverage`
- Mock setup for Firebase, Next.js router, and application services

## Recent Enhancements

### Customer Management System
- **Customer User Creation**: API endpoint for creating customer accounts
- **Email-based Authentication**: Passwordless login system for customers
- **Customer Login Links**: Dedicated API for generating customer login links
- **Order Access Control**: Enhanced Firestore rules for customer order visibility
- **Email Validation**: Client-side email format validation and error handling

### Dashboard Analytics
- **Performance Charts**: Worker performance visualization using Recharts
- **Job Distribution**: Status-based job distribution charts and metrics
- **Enhanced UI**: Improved loading states and responsive design
- **Worker Management**: Admin tools for creating and managing technicians

### Email System Improvements
- **Enhanced Error Handling**: Better feedback for email sending failures
- **User Experience**: Improved prompts for email input and validation
- **Success/Warning Messages**: Clear feedback for email operations
- **Auto-fill Capabilities**: Customer selection with form auto-population

### Firestore Security Updates
- **Role-based Access**: Updated rules for customer email-based access
- **Order Permissions**: Changed from 'submittedBy' to 'assignedTechnician' logic
- **Customer Integration**: Support for customer order visibility
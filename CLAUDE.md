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
├── api/                    # API routes
│   ├── email/             # Email notification endpoint
│   ├── set-user-role/     # Role management endpoint
│   └── whatsapp/          # WhatsApp integration endpoint
├── context/               # React contexts
│   ├── auth-context.tsx   # Authentication state management
│   └── whatsapp.tsx       # WhatsApp context
├── dashboard/             # Protected dashboard area
│   ├── jobs/              # Worker job management
│   ├── orders/            # Order management
│   └── submit-order/      # Order creation
└── login/                 # Authentication flow
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
2. **Job Management**: Workers can take and complete jobs
3. **Order Tracking**: Full order lifecycle management
4. **Notification System**: WhatsApp and email notifications for job completion
5. **Malaysia Address Support**: Malaysia-specific postcode integration

### User Roles & Permissions
- **Admin**: Full access to submit orders, view all orders
- **Worker**: Access to jobs, can take and complete assignments
- **Client**: Limited access (future implementation)

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
- No specific test framework configured - check with user for testing approach
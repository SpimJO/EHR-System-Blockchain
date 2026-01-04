# EHR Blockchain Frontend

A modern React + Vite frontend application for the EHR Blockchain system, built with TypeScript, TanStack Router, and shadcn/ui components.

## Tech Stack

### Core Framework
- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **TypeScript 5.9** - Type safety

### Routing & State Management
- **TanStack Router** - File-based routing with type-safe navigation
- **TanStack Query** - Server state management (5min stale time)
- **React Hook Form** - Form state and validation
- **Zod** - Schema validation and type inference

### UI & Styling
- **shadcn/ui** - Radix UI-based component library
- **Tailwind CSS v4** - Utility-first CSS framework
- **Lucide React** - Icon library (1000+ icons)
- **Radix UI** - Unstyled accessible components
- **class-variance-authority** - Component variants
- **tailwind-merge** - Efficient className merging

### Additional Libraries
- **Socket.io Client** - Real-time WebSocket communication
- **xior** - Modern HTTP client (axios alternative)
- **js-cookie** - Cookie management for JWT tokens
- **Sonner** - Beautiful toast notifications
- **Recharts** - Charts and data visualization
- **Embla Carousel** - Carousel components
- **date-fns** - Date utility library
- **cmdk** - Command palette (⌘K)
- **vaul** - Drawer component

## Installed Dependencies

### Production Dependencies
```json
{
  "@hookform/resolvers": "^5.2.2",
  "@radix-ui/react-*": "Latest versions",
  "@tanstack/react-query": "^5.90.16",
  "@tanstack/react-router": "^1.144.0",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "cmdk": "^1.1.1",
  "date-fns": "^4.1.0",
  "embla-carousel-react": "^8.6.0",
  "input-otp": "^1.4.2",
  "js-cookie": "^3.0.5",
  "lucide-react": "^0.562.0",
  "react": "^19.2.3",
  "react-dom": "^19.2.3",
  "react-hook-form": "^7.70.0",
  "recharts": "^3.6.0",
  "socket.io-client": "^4.8.3",
  "sonner": "^2.0.7",
  "tailwind-merge": "^3.4.0",
  "tailwindcss-animate": "^1.0.7",
  "vaul": "^1.1.2",
  "xior": "^0.8.2",
  "zod": "^4.3.5"
}
```

### Development Dependencies
```json
{
  "@eslint/js": "^9.39.2",
  "@tanstack/router-devtools": "^1.144.0",
  "@tanstack/router-plugin": "^1.145.2",
  "@types/js-cookie": "^3.0.6",
  "@types/node": "^25.0.3",
  "@types/react": "^19.2.7",
  "@types/react-dom": "^19.2.3",
  "@vitejs/plugin-react": "^5.1.2",
  "autoprefixer": "^10.4.23",
  "eslint": "^9.39.2",
  "eslint-plugin-react-hooks": "^7.0.1",
  "eslint-plugin-react-refresh": "^0.4.26",
  "globals": "^17.0.0",
  "postcss": "^8.5.6",
  "tailwindcss": "^4.1.18",
  "typescript": "^5.9.3",
  "typescript-eslint": "^8.51.0",
  "vite": "^7.3.0"
}
```

## Available Icons (Lucide React)

Lucide React provides 1000+ icons. Common icons you'll use:

```tsx
import { 
  User, Lock, Mail, Eye, EyeOff, LogIn, LogOut,
  Home, Settings, Bell, Search, Menu, X,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Check, AlertCircle, Info, XCircle, 
  Plus, Minus, Edit, Trash, Download, Upload,
  Calendar, Clock, File, Folder, Heart, Star,
  Shield, Key, Database, Server, Cloud,
  Activity, Pulse, Stethoscope, FileText, Pill
} from 'lucide-react';

// Usage
<User className="h-4 w-4" />
<Lock className="h-5 w-5 text-primary" />
```

Browse all icons at: https://lucide.dev/icons/

## Setup Instructions

### 1. Install Dependencies
All dependencies are already installed. If you need to reinstall:
```bash
npm install
```

### 2. Configure Environment Variables
Update `.env` with your backend configuration:

```env
VITE_BACKEND_BASE_URL=http://localhost:8080
VITE_BACKEND_WS_BASE_URL=ws://localhost:8080
VITE_API_KEY=your_api_key_from_backend
```

Get the API key from the backend by running:
```bash
cd ../ehr-backend
ts-node src/gen/genApiKey.ts
```

### 3. Start Development Server
```bash
npm run dev
```

The app will be available at: http://localhost:5173

## Available Scripts

- `npm run dev` - Start development server (port 5173)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build (port 37462)

## Project Structure

```
src/
├── app/                    # Page components
│   ├── (auth)/            # Auth pages (Login, Register)
│   ├── (dashboard)/       # Dashboard pages
│   └── (root)/            # Public pages (Home)
├── components/
│   ├── ui/                # shadcn/ui components
│   └── app/               # Custom app components
├── contexts/              # React contexts
│   ├── TanstackProvider.tsx   # Query client provider
│   └── WSProvider.tsx         # WebSocket provider
├── db/
│   ├── api/               # API service functions
│   └── queries/           # TanStack Query hooks
├── hooks/                 # Custom React hooks
│   ├── useToken.ts        # JWT token management
│   └── use-mobile.ts      # Responsive breakpoint
├── http/
│   └── xior.ts            # HTTP client config
├── lib/
│   ├── socket.ts          # Socket.io client
│   └── utils.ts           # Utility functions (cn)
├── middleware/
│   └── authMiddleware.ts  # Route authentication
├── routes/                # TanStack Router
│   ├── routers/           # Route definitions
│   └── _root.tsx          # Root route layout
├── types/                 # TypeScript types
│   ├── app/               # App-specific types
│   └── lib-defs/          # Library definitions
├── validators/            # Zod schemas
│   └── auth.validator.ts  # Auth validation schemas
├── index.css              # Global styles + Tailwind
└── main.tsx               # App entry point
```

## Key Features & Patterns

### Authentication Flow
- JWT tokens stored via `useToken()` hook with js-cookie
- Tokens injected into API requests via xior interceptors
- Protected routes use `authMiddleware.ts` in `beforeLoad`
- Automatic redirect to login on 401 responses

### API Integration
- HTTP client configured in `src/http/xior.ts`
- API functions in `src/db/api/`
- Query hooks in `src/db/queries/`
- Bearer token + `api-key` header on all requests

### WebSocket Connection
- Socket.io client in `src/lib/socket.ts`
- Connection managed via `WSProvider` context
- Auto-reconnection on window focus
- Manual connect/disconnect controls

### Form Handling
- react-hook-form for form state
- Zod schemas for validation
- Type inference from validators
- Integrated with shadcn/ui Form components

### Component Usage
All shadcn/ui components are already installed in `src/components/ui/`:

```tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

<Button variant="default">Click me</Button>
<Input type="email" placeholder="Email" />
<Card>Content</Card>
```

### Styling with Tailwind
```tsx
// Use cn() utility for conditional classes
import { cn } from '@/lib/utils';

<div className={cn(
  "base-styles",
  isActive && "active-styles",
  className
)}>
  Content
</div>
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_BACKEND_BASE_URL` | Backend API base URL | `http://localhost:8080` |
| `VITE_BACKEND_WS_BASE_URL` | WebSocket server URL | `ws://localhost:8080` |
| `VITE_API_KEY` | API key for backend | From backend key generator |

## shadcn/ui Components Available

All components are pre-installed and ready to use:

- **Layout**: Card, Separator, Scroll Area, Resizable
- **Forms**: Input, Textarea, Select, Checkbox, Radio, Switch, Slider
- **Buttons**: Button, Toggle, Button Group
- **Overlays**: Dialog, Sheet, Drawer, Alert Dialog, Popover, Tooltip
- **Navigation**: Navigation Menu, Menubar, Breadcrumb, Tabs, Pagination
- **Feedback**: Alert, Toast (Sonner), Progress, Spinner, Skeleton
- **Data Display**: Table, Badge, Avatar, Accordion, Collapsible
- **Advanced**: Command, Calendar, Chart, Carousel, Context Menu

## Next Steps

1. ✅ Install all frontend dependencies
2. ✅ Configure TypeScript and build tools
3. ✅ Set up Tailwind CSS and shadcn/ui
4. ✅ Configure routing and state management
5. ⏳ Connect to backend API
6. ⏳ Implement authentication flow
7. ⏳ Build EHR-specific UI components
8. ⏳ Integrate blockchain features

## Development Tips

1. **Import Aliases**: Use `@/` prefix for all imports
   ```tsx
   import { Button } from '@/components/ui/button';
   import { useAuth } from '@/db/queries/useAuth';
   ```

2. **Icons**: Browse Lucide icons at https://lucide.dev
   ```tsx
   import { Activity } from 'lucide-react';
   <Activity className="h-4 w-4" />
   ```

3. **Type Safety**: All validators export types
   ```tsx
   import type { LoginInput } from '@/types/app/auth.type';
   ```

4. **Forms**: Use shadcn Form components with react-hook-form
   ```tsx
   import { Form, FormField } from '@/components/ui/form';
   ```

5. **Toasts**: Use Sonner for notifications
   ```tsx
   import { toast } from 'sonner';
   toast.success('Success!');
   ```

## License
ISC

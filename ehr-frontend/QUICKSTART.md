# EHR Blockchain Frontend - Quick Start

## ✅ Setup Complete!

All dependencies have been installed and configured. You're ready to start development!

## Installed Packages Summary

### Core (6 packages)
- React 19.2.3
- Vite 7.3.0
- TypeScript 5.9.3
- TanStack Router 1.144.0
- TanStack Query 5.90.16
- Socket.io Client 4.8.3

### UI Components (27 Radix UI packages)
All shadcn/ui Radix primitives installed

### Icons & Utilities
- Lucide React (1000+ icons)
- Sonner (toasts)
- Recharts (charts)
- date-fns, embla-carousel, cmdk, vaul

### Form & Validation
- react-hook-form 7.70.0
- Zod 4.3.5
- @hookform/resolvers

### HTTP & WebSocket
- xior (HTTP client)
- socket.io-client
- js-cookie

### Styling
- Tailwind CSS 4.1.18
- tailwindcss-animate
- clsx & tailwind-merge
- class-variance-authority

## Quick Start Commands

### 1. Configure Environment
```bash
# Copy and update with your backend URL
cp .env .env.local

# Edit .env.local with your values
VITE_BACKEND_BASE_URL=http://localhost:8080
VITE_BACKEND_WS_BASE_URL=ws://localhost:8080
VITE_API_KEY=get_from_backend
```

### 2. Start Development
```bash
npm run dev
```

App runs at: **http://localhost:5173**

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

Runs at: **http://localhost:37462**

## Project Structure

```
ehr-frontend/
├── src/
│   ├── app/              # Pages (auth, dashboard, root)
│   ├── components/
│   │   ├── ui/          # 50+ shadcn components ✅
│   │   └── app/         # Custom components
│   ├── contexts/        # Providers (Query, WebSocket)
│   ├── db/
│   │   ├── api/         # API functions
│   │   └── queries/     # Query hooks
│   ├── hooks/           # Custom hooks
│   ├── http/            # xior config
│   ├── lib/             # utils, socket
│   ├── middleware/      # Auth middleware
│   ├── routes/          # Router config
│   ├── types/           # TypeScript types
│   └── validators/      # Zod schemas
├── public/              # Static assets
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Configuration Files Created

- ✅ `vite.config.ts` - Vite configuration with path aliases
- ✅ `tsconfig.json` - TypeScript configuration
- ✅ `tailwind.config.ts` - Tailwind CSS with shadcn theme
- ✅ `postcss.config.js` - PostCSS configuration
- ✅ `eslint.config.js` - ESLint flat config
- ✅ `components.json` - shadcn/ui configuration
- ✅ `.env.development` - Dev environment
- ✅ `.env.production` - Production environment
- ✅ `.gitignore` - Git ignore rules

## Key Features Ready to Use

### 1. Import Aliases
```tsx
import { Button } from '@/components/ui/button';
import { useAuth } from '@/db/queries/useAuth';
```

### 2. All shadcn/ui Components
```tsx
import { Card, Input, Dialog, Table, Badge } from '@/components/ui/*';
```

See `COMPONENTS.md` for full list and examples.

### 3. 1000+ Lucide Icons
```tsx
import { Activity, Heart, User, Settings } from 'lucide-react';

<Activity className="h-4 w-4" />
```

Browse: https://lucide.dev/icons

### 4. Form Handling
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({ email: z.string().email() });
const form = useForm({ resolver: zodResolver(schema) });
```

### 5. API Calls with TanStack Query
```tsx
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['patients'],
  queryFn: () => api.getPatients(),
});
```

### 6. Toast Notifications
```tsx
import { toast } from 'sonner';

toast.success('Success!');
toast.error('Error occurred');
```

### 7. WebSocket Connection
```tsx
import { useWebSocket } from '@/contexts/WSProvider';

const { socket, isConnected } = useWebSocket();
```

## Healthcare-Specific Icons

```tsx
import {
  Activity,      // Heart rate
  Pill,          // Medication
  Stethoscope,   // Examination
  Heart,         // Wellness
  Pulse,         // Vitals
  Thermometer,   // Temperature
  Hospital,      // Facility
  Clipboard,     // Records
  Calendar,      // Appointments
  FileText,      // Documents
} from 'lucide-react';
```

## Next Steps

1. **Connect to Backend**
   - Get API key from backend: `cd ../ehr-backend && ts-node src/gen/genApiKey.ts`
   - Update `.env.local` with the API key

2. **Start Backend Server**
   ```bash
   cd ../ehr-backend
   npm run dev
   ```

3. **Start Frontend Server**
   ```bash
   cd ../ehr-frontend
   npm run dev
   ```

4. **Build Components**
   - Create custom components in `src/components/app/`
   - Use shadcn/ui components from `src/components/ui/`
   - Add API functions in `src/db/api/`
   - Create query hooks in `src/db/queries/`

5. **Implement Features**
   - Patient management UI
   - Medical records interface
   - Blockchain transaction display
   - Real-time notifications via WebSocket

## Common Tasks

### Add a New Page
1. Create file in `src/app/(group)/PageName.tsx`
2. Define route in `src/routes/routers/`
3. Import in route configuration

### Create a Form
```tsx
import { useForm } from 'react-hook-form';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function MyForm() {
  const form = useForm();
  
  return (
    <Form {...form}>
      <FormField name="field" render={({ field }) => (
        <Input {...field} />
      )} />
      <Button type="submit">Submit</Button>
    </Form>
  );
}
```

### Make API Call
```tsx
import { useQuery } from '@tanstack/react-query';
import { api } from '@/db/api';

export function usePatients() {
  return useQuery({
    queryKey: ['patients'],
    queryFn: api.getPatients,
  });
}
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173
npm run dev
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Rebuild TypeScript
npm run build
```

## Resources

- **README.md** - Full documentation
- **COMPONENTS.md** - Component reference & examples
- **shadcn/ui**: https://ui.shadcn.com
- **Lucide Icons**: https://lucide.dev/icons
- **TanStack Router**: https://tanstack.com/router
- **TanStack Query**: https://tanstack.com/query

---

## 🎉 You're All Set!

Run `npm run dev` and start building your EHR Blockchain application!

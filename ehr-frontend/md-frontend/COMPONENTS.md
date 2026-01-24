# shadcn/ui Components Quick Reference

## Installation Status: ✅ ALL COMPONENTS INSTALLED

All shadcn/ui components and their dependencies are already installed and ready to use.

## Available Components

### Buttons & Actions
- **Button** - `@/components/ui/button`
- **Toggle** - `@/components/ui/toggle`
- **Toggle Group** - `@/components/ui/toggle-group`
- **Button Group** - `@/components/ui/button-group`

### Form Components
- **Input** - `@/components/ui/input`
- **Textarea** - `@/components/ui/textarea`
- **Select** - `@/components/ui/select`
- **Checkbox** - `@/components/ui/checkbox`
- **Radio Group** - `@/components/ui/radio-group`
- **Switch** - `@/components/ui/switch`
- **Slider** - `@/components/ui/slider`
- **Input OTP** - `@/components/ui/input-otp`
- **Form** - `@/components/ui/form`
- **Field** - `@/components/ui/field`
- **Label** - `@/components/ui/label`
- **Input Group** - `@/components/ui/input-group`

### Layout & Containers
- **Card** - `@/components/ui/card`
- **Separator** - `@/components/ui/separator`
- **Scroll Area** - `@/components/ui/scroll-area`
- **Resizable** - `@/components/ui/resizable`
- **Aspect Ratio** - `@/components/ui/aspect-ratio`
- **Sidebar** - `@/components/ui/sidebar`

### Overlays & Modals
- **Dialog** - `@/components/ui/dialog`
- **Sheet** - `@/components/ui/sheet`
- **Drawer** - `@/components/ui/drawer` (Vaul)
- **Alert Dialog** - `@/components/ui/alert-dialog`
- **Popover** - `@/components/ui/popover`
- **Tooltip** - `@/components/ui/tooltip`
- **Hover Card** - `@/components/ui/hover-card`
- **Context Menu** - `@/components/ui/context-menu`
- **Dropdown Menu** - `@/components/ui/dropdown-menu`

### Navigation
- **Navigation Menu** - `@/components/ui/navigation-menu`
- **Menubar** - `@/components/ui/menubar`
- **Breadcrumb** - `@/components/ui/breadcrumb`
- **Tabs** - `@/components/ui/tabs`
- **Pagination** - `@/components/ui/pagination`

### Feedback & Status
- **Alert** - `@/components/ui/alert`
- **Toast** - `@/components/ui/sonner` (Sonner)
- **Progress** - `@/components/ui/progress`
- **Spinner** - `@/components/ui/spinner`
- **Skeleton** - `@/components/ui/skeleton`
- **Badge** - `@/components/ui/badge`

### Data Display
- **Table** - `@/components/ui/table`
- **Avatar** - `@/components/ui/avatar`
- **Accordion** - `@/components/ui/accordion`
- **Collapsible** - `@/components/ui/collapsible`
- **Chart** - `@/components/ui/chart` (Recharts)
- **Carousel** - `@/components/ui/carousel` (Embla)
- **Calendar** - `@/components/ui/calendar`
- **Empty** - `@/components/ui/empty`
- **Item** - `@/components/ui/item`

### Advanced
- **Command** - `@/components/ui/command` (cmdk)
- **Kbd** - `@/components/ui/kbd`

## Icon Library: Lucide React

### Healthcare Icons
```tsx
import {
  Activity,        // Heart rate monitor
  Pill,           // Medication
  Stethoscope,    // Medical examination
  Heart,          // Health/wellness
  Pulse,          // Vital signs
  Syringe,        // Injections
  Thermometer,    // Temperature
  Ambulance,      // Emergency
  Hospital,       // Healthcare facility
  Clipboard,      // Medical records
  FileText,       // Documents
  Calendar,       // Appointments
  Clock,          // Time/scheduling
  AlertCircle,    // Alerts/warnings
  CheckCircle,    // Confirmation
  XCircle,        // Error/cancel
} from 'lucide-react';
```

### Common UI Icons
```tsx
import {
  User, Users,              // User management
  Lock, Unlock, Key,        // Security
  Mail, Phone, MapPin,      // Contact
  Home, Settings, Bell,     // Navigation
  Search, Filter, X,        // Actions
  Menu, MoreVertical,       // Menus
  ChevronDown, ChevronUp,   // Navigation
  ChevronLeft, ChevronRight,
  ArrowLeft, ArrowRight,    // Navigation
  Plus, Minus, Edit, Trash, // CRUD operations
  Download, Upload, Share,  // File operations
  Eye, EyeOff,             // Visibility
  Check, X,                // Confirmation
  Info, AlertTriangle,      // Notifications
  Star, Heart, Bookmark,    // Favorites
  Calendar, Clock,          // Time
  File, Folder,            // Files
  Image, Video,            // Media
  Database, Server, Cloud,  // Infrastructure
  Shield, ShieldCheck,      // Security
} from 'lucide-react';
```

### Blockchain Icons
```tsx
import {
  Link,           // Blockchain connection
  Lock,           // Encryption
  Key,            // Private keys
  Database,       // Data storage
  Shield,         // Security
  Fingerprint,    // Biometric/identity
  QrCode,         // QR scanning
  Hash,           // Hash values
  Network,        // Network connectivity
  Server,         // Nodes
} from 'lucide-react';
```

## Quick Usage Examples

### Button
```tsx
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

<Button variant="default">Save</Button>
<Button variant="outline">Cancel</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Plus /></Button>
```

### Card
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Patient Record</CardTitle>
    <CardDescription>Medical history overview</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    <Button>Save Changes</Button>
  </CardFooter>
</Card>
```

### Form with Input
```tsx
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';

const form = useForm();

<Form {...form}>
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input type="email" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

### Dialog
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

### Toast (Sonner)
```tsx
import { toast } from 'sonner';

// Success
toast.success('Record saved successfully!');

// Error
toast.error('Failed to save record');

// Info
toast.info('Processing your request...');

// Warning
toast.warning('Please review the changes');

// Custom
toast('Custom message', {
  description: 'Additional details here',
  action: {
    label: 'Undo',
    onClick: () => console.log('Undo'),
  },
});
```

### Table
```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Age</TableHead>
      <TableHead>Diagnosis</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>45</TableCell>
      <TableCell>Diabetes</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Badge
```tsx
import { Badge } from '@/components/ui/badge';

<Badge variant="default">Active</Badge>
<Badge variant="secondary">Pending</Badge>
<Badge variant="destructive">Critical</Badge>
<Badge variant="outline">Inactive</Badge>
```

### Avatar
```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

<Avatar>
  <AvatarImage src="/avatar.jpg" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

### Select
```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Tabs
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="details">Details</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
  <TabsContent value="details">Details content</TabsContent>
</Tabs>
```

## Styling with cn() Utility

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  "base-styles p-4 rounded-lg",
  isActive && "bg-primary text-white",
  disabled && "opacity-50 cursor-not-allowed",
  className // Allow external className override
)}>
  Content
</div>
```

## Component Variants (CVA)

```tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-white",
        outline: "border border-input",
      },
      size: {
        sm: "h-8 px-3",
        lg: "h-12 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);
```

## Resources

- **shadcn/ui Docs**: https://ui.shadcn.com
- **Lucide Icons**: https://lucide.dev/icons
- **Radix UI**: https://www.radix-ui.com
- **Tailwind CSS**: https://tailwindcss.com
- **TanStack Router**: https://tanstack.com/router
- **TanStack Query**: https://tanstack.com/query

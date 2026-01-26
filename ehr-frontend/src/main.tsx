import "./index.css"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import TanstackProvider from './contexts/TanstackProvider';
import { ThemeProvider } from './components/theme-provider';
import { routerTree } from './routes/_root';
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
// import { TanStackRouterDevtools } from '@tanstack/router-devtools';

const router = createRouter({ routeTree: routerTree });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="ehr-ui-theme">
      <TanstackProvider>
        <RouterProvider router={router} />
        <Toaster />
        {/* <TanStackRouterDevtools router={router} /> */}
      </TanstackProvider>
    </ThemeProvider>
  </StrictMode>,
)

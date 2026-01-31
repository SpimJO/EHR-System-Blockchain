import "./index.css"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import TanstackProvider from './contexts/TanstackProvider';
import { ThemeProvider } from './components/theme-provider';
import { routeTree } from './routeTree.gen';
import { RouterProvider, createRouter } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from '@tanstack/router-devtools';

const router = createRouter({ routeTree });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="ehr-ui-theme">
      <TanstackProvider>
        <RouterProvider router={router} />
        {/* <TanStackRouterDevtools router={router} /> */}
      </TanstackProvider>
    </ThemeProvider>
  </StrictMode>,
)

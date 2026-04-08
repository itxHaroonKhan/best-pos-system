import type {Metadata} from 'next';
import './globals.css';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/contexts/theme-context';
import { LanguageProvider } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Menu, PanelLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Elites | Advanced POS System',
  description: 'Next-generation retail billing, inventory, and reporting.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
          <LanguageProvider>
            <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <SidebarInset>
              <div className="flex flex-col min-h-screen">
                {/* Mobile Header with Sidebar Trigger */}
                <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 h-14 lg:hidden">
                  <div className="flex items-center gap-2">
                    <SidebarTrigger className="md:hidden" />
                    <span className="font-semibold text-sm">Elites POS</span>
                  </div>
                </header>
                <main className="flex-1 p-4 lg:p-6 overflow-y-auto overflow-x-visible">
                  {children}
                </main>
              </div>
            </SidebarInset>
          </SidebarProvider>
          </LanguageProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

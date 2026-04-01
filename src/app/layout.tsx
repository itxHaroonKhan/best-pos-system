import type {Metadata} from 'next';
import './globals.css';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Toaster } from '@/components/ui/toaster';

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen w-full bg-background">
            <AppSidebar />
            <SidebarInset>
              <main className="flex-1 p-6 overflow-y-auto">
                {children}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
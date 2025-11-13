import './globals.css'
import { Providers } from './providers'
import { Toaster } from "@/components/ui/sonner"

export const metadata = {
  title: 'Todo App',
  description: 'Learn shadcn/ui + React Query',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <Toaster /> {/* اعلان‌ها اینجا رندر می‌شن */}
        </Providers>
      </body>
    </html>
  )
}

import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { CommandMenu } from "@/components/command-menu/command-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeToaster } from "@/components/theme-toaster"
import { FilteredAnalytics } from "@/components/filtered-analytics"
import { SITE_URL } from "@/lib/site"
import "./globals.css"

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

const SITE_DESCRIPTION = "Portfolio of Keythe Rueckert - Product Designer who builds in code, prototyping product interfaces in React."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s - Keythe Rueckert",
    default: "Keythe Rueckert - Product Designer",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: "Keythe Rueckert - Product Designer",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Keythe Rueckert",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Keythe Rueckert - Product Designer",
    description: SITE_DESCRIPTION,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){if(localStorage.getItem('theme')==='dark'){document.documentElement.classList.add('dark')}})()`,
          }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-3 focus-visible:top-3 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-foreground focus-visible:px-4 focus-visible:py-2 focus-visible:text-[14px] focus-visible:font-medium focus-visible:text-background"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Keythe Rueckert",
              jobTitle: "Product Designer",
              url: SITE_URL,
              sameAs: ["https://www.linkedin.com/in/keythee/", "https://github.com/theuxkey-cpu"],
            }),
          }}
        />
        {children}
        <CommandMenu />
        <ThemeToggle />
        <ThemeToaster />
        <FilteredAnalytics />
      </body>
    </html>
  )
}

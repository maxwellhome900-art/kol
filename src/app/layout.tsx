import type { Metadata, Viewport } from "next";
import { Outfit, Syne } from "next/font/google";
import "./globals.css";
import { GlobalMarkoAgent } from "@/components/chat/GlobalMarkoAgent";
import { BookingProvider } from "@/context/booking-context";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { site } from "@/lib/data";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: `${site.businessName} — ${site.name}`,
    template: `%s — ${site.businessName}`,
  },
  description:
    `${site.businessName}: portrait sessions from $350 and extended sessions from $450, with picture-only orders from $10. Evening holds run 7 PM–1 AM. ${site.agentName} handles booking and questions.`,
  keywords: [
    "portfolio",
    "software engineer",
    "photographer",
    "React",
    "street photography",
  ],
  authors: [{ name: site.name }],
  openGraph: {
    title: `${site.businessName} — ${site.name}`,
    description:
      `${site.businessName}: software engineering, Times Square photography, evening holds, and ${site.agentName} for inquiries.`,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.businessName} — ${site.name}`,
    description:
      `${site.businessName}: photography gallery, portrait and extended sessions from $350 / $450, picture-only work from $10, and ${site.agentName}.`,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${syne.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        <ThemeProvider>
          <BookingProvider>
            {children}
            <GlobalMarkoAgent />
          </BookingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

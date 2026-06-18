import { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { NewsletterBanner } from "./newsletter-banner";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <NewsletterBanner />
      <Footer />
    </div>
  );
}

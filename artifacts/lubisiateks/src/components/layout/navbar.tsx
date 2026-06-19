import { Link, useLocation } from "wouter";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth-context";
import { ShoppingCart, Menu, X, ShieldCheck, User, LogIn } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthDrawer } from "@/components/auth/auth-drawer";

export function Navbar() {
  const [location] = useLocation();
  const { items } = useCart();
  const { user, isLoggedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/services", label: "IT Services" },
    { href: "/shop", label: "Accessory Shop" },
    { href: "/website-templates", label: "Websites" },
    { href: "/deals", label: "Deals" },
    { href: "/blog", label: "Blog" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/contact", label: "Contact" },
  ];

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <nav className="sticky top-0 z-30 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <ShieldCheck className="h-6 w-6" />
            <span>LubisiaTech</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === item.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/checkout" className="relative text-foreground hover:text-primary transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 rounded-full bg-secondary text-white">
                  {totalItems}
                </Badge>
              )}
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAuthOpen(true)}
              className="gap-2"
            >
              {isLoggedIn ? (
                <>
                  <div className="h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:block text-sm">{user?.name.split(" ")[0]}</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </>
              )}
            </Button>
          </div>

          {/* Mobile Nav Toggle */}
          <div className="md:hidden flex items-center gap-3">
            <Link href="/checkout" className="relative text-foreground">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 rounded-full bg-secondary text-white">
                  {totalItems}
                </Badge>
              )}
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setAuthOpen(true)}>
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-b bg-white">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium ${
                    location === item.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/track-order"
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-muted-foreground"
              >
                Track Order
              </Link>
            </div>
          </div>
        )}
      </nav>

      <AuthDrawer open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Laptop, ShieldCheck, Zap, ExternalLink, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useListServices, useListProducts } from "@workspace/api-client-react";

const PORTFOLIO = [
  {
    title: "CPSB Trans Nzoia — Website Modernisation",
    description:
      "Upgraded the County Public Service Board of Trans Nzoia's website to a modern, fast, and mobile-responsive stack. Improved performance, accessibility, and ease of content management.",
    url: "https://cpsbtransnzoia.co.ke/",
    tags: ["Web Upgrade", "Modern Stack", "CMS"],
    status: "Completed",
  },
  {
    title: "CPSB Trans Nzoia — Intercom Installation",
    description:
      "Installed and fully configured an Intercom communication system at the County Public Service Board offices in Trans Nzoia, improving internal and visitor communication workflows.",
    url: null,
    tags: ["Hardware", "Networking", "Configuration"],
    status: "Completed",
  },
  {
    title: "CPSB Bungoma — Recruitment System",
    description:
      "Designing and building a digital recruitment management system for the County Public Service Board of Bungoma County, enabling end-to-end job posting, application, and shortlisting.",
    url: null,
    tags: ["Web App", "Recruitment", "Database"],
    status: "In Progress",
  },
  {
    title: "CPSB West Pokot — Recruitment System",
    description:
      "Building a tailored recruitment system for the County Public Service Board of West Pokot, streamlining the hiring process for county government positions.",
    url: null,
    tags: ["Web App", "Recruitment", "Database"],
    status: "In Progress",
  },
];

const DIRECTORS = [
  {
    initials: "MJ",
    name: "Moses Juma",
    role: "Chief Executive Officer",
    bio: "Leads business strategy, client relations, and growth initiatives. With deep expertise in e-commerce and web sales, Moses drives LubisiaTech's vision of accessible IT for Kenyan businesses.",
    color: "bg-primary/15 text-primary",
  },
  {
    initials: "KO",
    name: "Kevin Odhiambo",
    role: "Information Technology Director",
    bio: "Oversees all technical operations — from web development and infrastructure to system installations and database architecture. Kevin ensures every solution delivered meets the highest technical standards.",
    color: "bg-secondary/15 text-secondary",
  },
];

export function Home() {
  const { data: services, isLoading: servicesLoading } = useListServices();
  const { data: products, isLoading: productsLoading } = useListProducts();

  const featuredServices = services?.slice(0, 3) || [];
  const featuredProducts = products?.slice(0, 4) || [];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-foreground text-background overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src="/images/hero.png" alt="Modern IT Shop" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10 flex flex-col items-center text-center">
          <Badge variant="outline" className="mb-6 bg-primary/20 text-primary-foreground hover:bg-primary/30 text-sm py-1 px-3 border-primary/30 backdrop-blur">
            Kitale's Trusted Tech Partner
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl">
            Professional IT Solutions &amp; Premium Accessories
          </h1>
          <p className="text-lg md:text-xl text-muted max-w-2xl mb-10">
            We empower Kenyan businesses with reliable web services and high-quality computer accessories, delivering excellence from Kitale Town to the rest of the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/services">
              <Button size="lg" className="text-base font-semibold px-8">
                Explore Services
              </Button>
            </Link>
            <Link href="/shop">
              <Button size="lg" variant="outline" className="text-base font-semibold px-8 text-foreground bg-background hover:bg-background/90 border-transparent">
                Shop Accessories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-16 bg-muted/50 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg text-primary shrink-0">
                <Laptop className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Expert IT Support</h3>
                <p className="text-muted-foreground text-sm">Professional assistance for all your hardware and software needs.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg text-primary shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Quality Guaranteed</h3>
                <p className="text-muted-foreground text-sm">We only stock premium, tested computer accessories that last.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-lg text-primary shrink-0">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Fast Delivery</h3>
                <p className="text-muted-foreground text-sm">Quick turnaround times for both services and product deliveries.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Our IT Services</h2>
              <p className="text-muted-foreground">Comprehensive solutions for modern businesses.</p>
            </div>
            <Link href="/services" className="hidden md:flex items-center text-primary font-medium hover:underline">
              View all services <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredServices.map(service => (
                <Card key={service.id} data-testid={`card-service-${service.id}`} className="border-border shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3">{service.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{service.description}</p>
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-border/50">
                      <span className="font-medium">
                        {service.price ? `KES ${Number(service.price).toLocaleString()}` : "Custom Quote"}
                      </span>
                      <Link href={`/contact?service=${service.id}`}>
                        <Button variant="ghost" size="sm" className="text-primary p-0 hover:bg-transparent hover:underline">Inquire</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <div className="mt-8 text-center md:hidden">
            <Link href="/services">
              <Button variant="outline" className="w-full">View all services</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio / Work We've Done */}
      <section className="py-20 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Work We've Done</h2>
              <p className="text-muted-foreground max-w-2xl">
                Real projects delivered for county government institutions and businesses across Kenya.
              </p>
            </div>
            <Link href="/portfolio" className="hidden md:flex items-center text-primary font-medium hover:underline">
              Full case studies <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PORTFOLIO.map((project) => (
              <div
                key={project.title}
                data-testid={`card-portfolio-${project.title.replace(/\s+/g, "-").toLowerCase()}`}
                className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-lg leading-snug">{project.title}</h3>
                  <span className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    project.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    <CheckCircle2 className="h-3 w-3" />
                    {project.status}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map(tag => (
                    <span key={tag} className="bg-muted text-muted-foreground text-xs font-medium px-2.5 py-1 rounded-md">{tag}</span>
                  ))}
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                    >
                      Visit site <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Accessories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Accessories</h2>
              <p className="text-muted-foreground">Upgrade your workspace with premium gear.</p>
            </div>
            <Link href="/shop" className="hidden md:flex items-center text-primary font-medium hover:underline">
              Visit shop <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="aspect-square bg-muted animate-pulse rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <Link key={product.id} href={`/shop/${product.id}`} className="group block" data-testid={`link-product-${product.id}`}>
                  <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">No image</div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-muted-foreground mb-1">{product.category}</div>
                      <h3 className="font-semibold text-sm md:text-base mb-2 line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                      <div className="font-bold text-foreground">KES {Number(product.price).toLocaleString()}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-8 text-center md:hidden">
            <Link href="/shop">
              <Button variant="outline" className="w-full">Visit shop</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Meet the Directors */}
      <section className="py-20 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-end gap-3">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Meet the Directors</h2>
              <p className="text-muted-foreground">The experienced team behind LubisiaTech Solutions.</p>
            </div>
            <Users className="h-8 w-8 text-muted-foreground mb-3 hidden md:block" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {DIRECTORS.map((director) => (
              <div key={director.name} data-testid={`card-director-${director.name.replace(/\s+/g, "-").toLowerCase()}`} className="bg-card border border-border rounded-2xl p-8 shadow-sm flex gap-6">
                <div className={`w-16 h-16 shrink-0 rounded-full ${director.color} flex items-center justify-center font-bold text-xl`}>
                  {director.initials}
                </div>
                <div>
                  <div className="font-bold text-lg">{director.name}</div>
                  <div className="text-primary text-sm font-medium mb-3">{director.role}</div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{director.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to upgrade your IT infrastructure?</h2>
          <p className="text-primary-foreground/80 text-lg mb-4 max-w-2xl mx-auto">
            Whether you need a complete office network setup or just a new mechanical keyboard, we're here to help.
          </p>
          <p className="text-primary-foreground/90 font-semibold text-lg mb-10">
            Call us: <a href="tel:+254711293263" className="underline underline-offset-4 hover:text-white">+254 711 293 263</a>
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="font-semibold px-8 text-primary">
              Contact Us Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

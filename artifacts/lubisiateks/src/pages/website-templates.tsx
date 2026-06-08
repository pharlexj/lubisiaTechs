import { useState } from "react";
import { useListWebsiteTemplates, type WebsiteTemplate } from "@workspace/api-client-react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Globe, ShoppingCart, Eye, Star, Clock, Layers, CheckCircle,
  Monitor, Store, Briefcase, Heart, Building2,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

const CATEGORIES = ["All", "Business", "E-commerce", "Portfolio", "NGO", "Government", "Restaurant"];

const CATEGORY_ICONS: Record<string, React.ComponentType<any>> = {
  Business: Briefcase,
  "E-commerce": Store,
  Portfolio: Monitor,
  NGO: Heart,
  Government: Building2,
  Restaurant: Layers,
  All: Globe,
};

export function WebsiteTemplates() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [previewTemplate, setPreviewTemplate] = useState<WebsiteTemplate | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const { addItem } = useCart();

  const { data: templates = [], isLoading } = useListWebsiteTemplates(
    activeCategory !== "All" ? { category: activeCategory } : {},
    {},
  );

  function handleAddToCart(template: WebsiteTemplate) {
    // Map website template to the Product shape the cart expects
    addItem({
      id: template.id,
      name: template.name,
      description: template.description,
      category: "Website Template",
      price: Number(template.price),
      stock: 99,
      imageUrl: template.screenshotUrl ?? null,
      featured: template.featured,
      createdAt: template.createdAt,
    }, 1);
    toast.success(`"${template.name}" added to cart!`);
  }

  function getFeatures(featuresStr: string): string[] {
    try {
      return JSON.parse(featuresStr);
    } catch {
      return [];
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-white py-20 px-4">
        <div className="container mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-medium mb-2">
            <Globe className="h-4 w-4" />
            Ready-Made Websites for Kenya
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Website Templates</h1>
          <p className="text-xl text-white/85 max-w-2xl mx-auto">
            Professional, mobile-responsive websites built for Kenyan businesses.
            Preview, purchase, and go live fast.
          </p>
          <div className="flex items-center justify-center gap-8 pt-4 text-sm text-white/80">
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4" /> Mobile-First Design</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4" /> Local Support</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4" /> M-Pesa Integrated</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat] ?? Globe;
            return (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className="gap-2"
              >
                <Icon className="h-3.5 w-3.5" />
                {cat}
              </Button>
            );
          })}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-muted animate-pulse" />
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-3 bg-muted animate-pulse rounded w-full" />
                  <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <Globe className="h-16 w-16 text-muted-foreground mx-auto" />
            <h3 className="text-xl font-semibold">No templates in this category yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We're adding more templates regularly. Contact us for a custom website solution.
            </p>
            <Button asChild>
              <Link href="/contact">Request Custom Website</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => {
              const features = getFeatures(template.features ?? "[]");
              return (
                <Card key={template.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                  {/* Screenshot / Preview */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/15 h-48 flex items-center justify-center">
                    {template.screenshotUrl ? (
                      <img
                        src={template.screenshotUrl}
                        alt={template.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-primary/60">
                        <Monitor className="h-12 w-12" />
                        <span className="text-sm">{template.category}</span>
                      </div>
                    )}
                    {template.featured && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-amber-500 text-white border-0 gap-1">
                          <Star className="h-3 w-3 fill-white" /> Featured
                        </Badge>
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      {template.previewUrl && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="gap-2"
                          onClick={() => { setPreviewTemplate(template); setPreviewLoading(true); }}
                        >
                          <Eye className="h-4 w-4" /> Preview
                        </Button>
                      )}
                      <Button size="sm" className="gap-2" onClick={() => handleAddToCart(template)}>
                        <ShoppingCart className="h-4 w-4" /> Buy
                      </Button>
                    </div>
                  </div>

                  <CardHeader className="pb-2 pt-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg leading-tight">{template.name}</h3>
                        <Badge variant="secondary" className="mt-1 text-xs">{template.category}</Badge>
                      </div>
                      <span className="text-xl font-bold text-primary">
                        KES {Number(template.price).toLocaleString()}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>

                    {features.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {features.slice(0, 4).map((f, i) => (
                          <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                            {f}
                          </span>
                        ))}
                        {features.length > 4 && (
                          <span className="text-xs text-muted-foreground px-1">+{features.length - 4} more</span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {(template.deliveryDays ?? 0) > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {template.deliveryDays} day delivery
                        </span>
                      )}
                      {template.techStack && (
                        <span className="flex items-center gap-1">
                          <Layers className="h-3 w-3" /> {template.techStack}
                        </span>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="gap-2 pt-0">
                    {template.previewUrl && (
                      <Button
                        variant="outline"
                        className="flex-1 gap-2"
                        size="sm"
                        onClick={() => { setPreviewTemplate(template); setPreviewLoading(true); }}
                      >
                        <Eye className="h-3.5 w-3.5" /> Preview
                      </Button>
                    )}
                    <Button
                      className="flex-1 gap-2"
                      size="sm"
                      onClick={() => handleAddToCart(template)}
                    >
                      <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-10 border">
          <h2 className="text-2xl font-bold mb-3">Need Something Custom?</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Can't find the perfect template? Our team builds custom websites tailored to your business from scratch.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">Get a Free Quote</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/portfolio">View Our Work</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b flex-row items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {previewTemplate?.name} — Live Preview
            </DialogTitle>
            <div className="flex items-center gap-2">
              {previewTemplate?.previewUrl && (
                <a
                  href={previewTemplate.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <Eye className="h-3 w-3" /> Open in new tab
                </a>
              )}
              <Button size="sm" onClick={() => { if (previewTemplate) { handleAddToCart(previewTemplate); setPreviewTemplate(null); } }} className="gap-2">
                <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
              </Button>
            </div>
          </DialogHeader>
          {previewTemplate?.previewUrl ? (
            <div className="relative flex-1 h-full">
              {previewLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
                  <div className="text-center space-y-2">
                    <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground">Loading preview...</p>
                  </div>
                </div>
              )}
              <iframe
                src={previewTemplate.previewUrl}
                className="w-full h-full"
                style={{ height: "calc(90vh - 5rem)" }}
                onLoad={() => setPreviewLoading(false)}
                title="Template Preview"
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground">No preview available for this template</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

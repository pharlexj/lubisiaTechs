import { useState } from "react";
import { useListAffiliatePrograms, useListAffiliateLinks, useTrackAffiliateLinkClick } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Star } from "lucide-react";

export function Deals() {
  const [selectedProgram, setSelectedProgram] = useState<number | undefined>(undefined);
  const { data: programs } = useListAffiliatePrograms();
  const { data: links, isLoading } = useListAffiliateLinks(
    selectedProgram ? { programId: selectedProgram } : {}
  );
  
  const trackClick = useTrackAffiliateLinkClick();

  const handleShopNow = async (linkId: number) => {
    try {
      const res = await trackClick.mutateAsync({ id: linkId });
      window.open(res.redirectUrl, '_blank');
    } catch {
      // click tracking failed silently
    }
  };

  const featuredLinks = links?.filter(l => l.featured) || [];
  const regularLinks = links?.filter(l => !l.featured) || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Partner Deals & Online Offers</h1>
        <p className="text-lg text-muted-foreground">Curated products from trusted online retailers — shop via our partner links</p>
      </div>

      {programs && programs.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <Button 
            variant={selectedProgram === undefined ? "default" : "outline"}
            onClick={() => setSelectedProgram(undefined)}
            className="rounded-full"
          >
            All Programs
          </Button>
          {programs.map(prog => (
            <Button
              key={prog.id}
              variant={selectedProgram === prog.id ? "default" : "outline"}
              onClick={() => setSelectedProgram(prog.id)}
              className="rounded-full flex items-center gap-2"
            >
              {prog.name}
            </Button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="animate-pulse flex flex-col h-full bg-card rounded-xl border border-border">
              <div className="aspect-square bg-muted rounded-t-xl w-full" />
              <div className="p-4 flex flex-col flex-1 gap-3">
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="mt-auto h-10 bg-muted rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : links && links.length > 0 ? (
        <div className="space-y-12">
          {featuredLinks.length > 0 && selectedProgram === undefined && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <h2 className="text-2xl font-bold tracking-tight">Featured Deals</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredLinks.map(link => (
                  <DealCard key={link.id} link={link} onShop={() => handleShopNow(link.id)} />
                ))}
              </div>
            </div>
          )}

          <div>
            {(featuredLinks.length > 0 && selectedProgram === undefined) && (
              <h2 className="text-2xl font-bold tracking-tight mb-6">All Deals</h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {regularLinks.map(link => (
                <DealCard key={link.id} link={link} onShop={() => handleShopNow(link.id)} />
              ))}
              {selectedProgram !== undefined && featuredLinks.map(link => (
                <DealCard key={link.id} link={link} onShop={() => handleShopNow(link.id)} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-24 bg-muted/30 rounded-2xl border border-dashed">
          <h3 className="text-xl font-medium mb-2">No deals available</h3>
          <p className="text-muted-foreground">Check back later for new offers.</p>
        </div>
      )}
    </div>
  );
}

function DealCard({ link, onShop }: { link: any, onShop: () => void }) {
  return (
    <Card className="h-full flex flex-col overflow-hidden border-border/50 hover:border-primary/50 transition-all hover:shadow-md group">
      <div className="relative aspect-square bg-white p-4 flex items-center justify-center">
        {link.imageUrl ? (
          <img 
            src={link.imageUrl} 
            alt={link.title} 
            className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-muted-foreground text-sm">No Image</div>
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {link.program && (
            <Badge className="bg-foreground text-background">{link.program.name}</Badge>
          )}
          {link.featured && (
            <Badge className="bg-yellow-500 text-black hover:bg-yellow-500 flex gap-1 px-1.5"><Star className="h-3 w-3 fill-black" /> Top Deal</Badge>
          )}
        </div>
      </div>
      <CardContent className="p-4 flex flex-col flex-1 bg-card">
        <div className="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">{link.category}</div>
        <h3 className="font-semibold text-foreground line-clamp-2 mb-3 min-h-[3rem] group-hover:text-primary transition-colors">
          {link.title}
        </h3>
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-4">
            {link.price && (
              <span className="text-xl font-bold">{link.currency} {parseFloat(link.price).toLocaleString()}</span>
            )}
            {link.originalPrice && link.originalPrice !== link.price && (
              <span className="text-sm text-muted-foreground line-through">
                {parseFloat(link.originalPrice).toLocaleString()}
              </span>
            )}
          </div>
          <Button onClick={onShop} className="w-full gap-2" variant="default">
            Shop Now <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

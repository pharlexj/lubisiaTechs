import { useState } from "react";
import { Link } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, Filter, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Shop() {
  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState("");
  const { data: products, isLoading } = useListProducts(category ? { category } : undefined);
  const { addItem } = useCart();
  const { toast } = useToast();

  const categories = ["All", "Keyboards", "Mice", "Stands", "Hubs", "Cables", "Audio"];

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    addItem(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Accessory Shop</h1>
          <p className="text-muted-foreground">Premium gear for your workspace.</p>
        </div>
        
        <div className="flex w-full md:w-auto items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-24 bg-card border rounded-xl p-5">
            <div className="flex items-center gap-2 font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              <Filter className="h-4 w-4" />
              Categories
            </div>
            <div className="flex flex-col gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat === "All" ? "" : cat)}
                  className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    (category === cat || (category === "" && cat === "All"))
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="animate-pulse border rounded-xl overflow-hidden">
                  <div className="aspect-square bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-6 bg-muted rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts?.length === 0 ? (
            <div className="text-center py-24 border border-dashed rounded-xl bg-muted/20">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No products found</h2>
              <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts?.map((product, i) => (
                <Link key={product.id} href={`/shop/${product.id}`} className="group block" data-reveal="up" data-delay={String((i % 3) * 100)}>
                  <div className="hover-up rounded-xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all h-full flex flex-col">
                    <div className="aspect-square bg-muted relative overflow-hidden p-6 flex items-center justify-center">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
                      )}
                      
                      {product.stock <= 5 && product.stock > 0 && (
                        <div className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                          Only {product.stock} left
                        </div>
                      )}
                      {product.stock === 0 && (
                        <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                          Out of stock
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5 flex flex-col flex-1">
                      <div className="text-xs text-muted-foreground mb-1.5">{product.category}</div>
                      <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors flex-1">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="font-bold text-lg">KES {product.price.toLocaleString()}</div>
                        <Button 
                          size="icon" 
                          variant="secondary"
                          className="rounded-full h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0"
                          disabled={product.stock === 0}
                          onClick={(e) => handleAddToCart(e, product)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

import { useParams, Link, useLocation } from "wouter";
import { useGetProduct } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ShoppingCart, Check, ShieldAlert, Zap, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { data: product, isLoading, isError } = useGetProduct(Number(id), {
    query: { enabled: !!id, queryKey: ['product', id] }
  });
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 animate-pulse">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-24 h-4 bg-muted rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-muted rounded-2xl"></div>
          <div className="space-y-6 pt-8">
            <div className="h-10 bg-muted rounded w-3/4"></div>
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
            <div className="h-12 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/shop">
          <Button>Return to Shop</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast({
      title: "Added to cart",
      description: `${quantity}x ${product.name} added to cart.`,
    });
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    setLocation('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/shop" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        {/* Product Image */}
        <div className="bg-white border rounded-3xl p-8 md:p-16 flex items-center justify-center aspect-square relative">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-muted-foreground">No image available</div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col pt-4 md:pt-8">
          <div className="mb-2 text-primary font-medium tracking-wide uppercase text-sm">
            {product.category}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
            {product.name}
          </h1>
          
          <div className="text-3xl font-bold mb-6">
            KES {product.price.toLocaleString()}
          </div>

          <div className="prose prose-sm text-muted-foreground mb-8 leading-relaxed">
            {product.description}
          </div>

          <Separator className="mb-8" />

          {/* Value Props */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm font-medium">Quality Assured</div>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm font-medium">Fast Local Delivery</div>
            </div>
          </div>

          <div className="space-y-6 mt-auto">
            <div className="flex items-center gap-4">
              <span className="font-medium text-sm">Quantity</span>
              <div className="flex items-center border rounded-lg bg-background">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 hover:bg-muted text-muted-foreground transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-1.5 hover:bg-muted text-muted-foreground transition-colors"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              <span className="text-sm text-muted-foreground">
                {product.stock > 0 ? (
                  <span className="flex items-center text-secondary"><Check className="h-4 w-4 mr-1"/> In stock ({product.stock})</span>
                ) : (
                  <span className="flex items-center text-destructive"><ShieldAlert className="h-4 w-4 mr-1"/> Out of stock</span>
                )}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                size="lg" 
                variant="outline" 
                className="flex-1 text-base h-14"
                disabled={product.stock === 0}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button 
                size="lg" 
                className="flex-1 text-base h-14"
                disabled={product.stock === 0}
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

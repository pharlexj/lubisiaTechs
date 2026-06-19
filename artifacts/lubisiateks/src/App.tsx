import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/lib/cart";
import { AuthProvider } from "@/lib/auth-context";
import { Layout } from "@/components/layout/layout";
import NotFound from "@/pages/not-found";
import { Home } from "@/pages/home";
import { Services } from "@/pages/services";
import { Shop } from "@/pages/shop";
import { ProductDetail } from "@/pages/product";
import { Checkout } from "@/pages/checkout";
import { Contact } from "@/pages/contact";
import { AdminDashboard } from "@/pages/admin/dashboard";
import { Portfolio } from "@/pages/portfolio";
import { Blog } from "@/pages/blog";
import { BlogDetail } from "@/pages/blog-detail";
import { Deals } from "@/pages/deals";
import { TrackOrder } from "@/pages/track-order";
import { WebsiteTemplates } from "@/pages/website-templates";
import { About } from "@/pages/about";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/services" component={Services} />
        <Route path="/shop" component={Shop} />
        <Route path="/shop/:id" component={ProductDetail} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/contact" component={Contact} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogDetail} />
        <Route path="/deals" component={Deals} />
        <Route path="/track-order" component={TrackOrder} />
        <Route path="/website-templates" component={WebsiteTemplates} />
        <Route path="/about" component={About} />
        <Route path="/admin" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
            <Sonner richColors position="top-right" />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

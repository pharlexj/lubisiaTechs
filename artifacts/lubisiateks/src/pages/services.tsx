import { useListServices } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, Monitor, Code, ShieldCheck, Database, Wrench } from "lucide-react";

export function Services() {
  const { data: services, isLoading } = useListServices();

  const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'web development': return <Code className="h-5 w-5" />;
      case 'networking': return <Server className="h-5 w-5" />;
      case 'hardware repair': return <Wrench className="h-5 w-5" />;
      case 'cybersecurity': return <ShieldCheck className="h-5 w-5" />;
      case 'data recovery': return <Database className="h-5 w-5" />;
      default: return <Monitor className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div data-reveal="up" className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Professional IT Services</h1>
        <p className="text-lg text-muted-foreground">
          Expert technical solutions designed for modern Kenyan businesses. 
          From hardware repair to custom web development.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-24 bg-muted rounded-t-xl" />
              <CardContent className="h-32 bg-muted/50" />
            </Card>
          ))}
        </div>
      ) : services?.length === 0 ? (
        <div className="text-center py-24 bg-muted/30 rounded-xl border border-dashed">
          <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No services found</h2>
          <p className="text-muted-foreground">We are currently updating our service catalog.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services?.map((service, i) => (
            <Card key={service.id} data-reveal="up" data-delay={String((i % 3) * 150)} className="hover-up flex flex-col border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
                    {getIcon(service.category)}
                  </div>
                  <Badge variant="secondary" className="bg-secondary/10 text-secondary-foreground hover:bg-secondary/20">
                    {service.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{service.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t border-border/50 pt-6 mt-4">
                <div className="font-semibold text-foreground">
                  {service.price ? `KES ${service.price.toLocaleString()}` : 'Custom Quote'}
                </div>
                <Link href={`/contact?service=${service.id}`}>
                  <Button variant="default" size="sm">Request Service</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

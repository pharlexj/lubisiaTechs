import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTrackOrder } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Search, Package, CheckCircle, Truck, Clock, XCircle, Mail, Phone } from "lucide-react";

const STATUS_STEPS = [
  { key: "pending", label: "Order Placed", icon: Clock, description: "Your order has been received" },
  { key: "processing", label: "Processing", icon: Package, description: "We are preparing your order" },
  { key: "shipped", label: "On the Way", icon: Truck, description: "Your order is being delivered" },
  { key: "delivered", label: "Delivered", icon: CheckCircle, description: "Order delivered successfully" },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  processing: "bg-blue-100 text-blue-700 border-blue-200",
  shipped: "bg-purple-100 text-purple-700 border-purple-200",
  delivered: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

function getStepIndex(status: string) {
  const idx = STATUS_STEPS.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : 0;
}

interface TrackForm {
  orderId: string;
  email: string;
}

export function TrackOrder() {
  const [params, setParams] = useState<{ orderId: number; email: string } | null>(null);
  const form = useForm<TrackForm>();

  const { data: order, isLoading, isError, error } = useTrackOrder(
    params ? { orderId: params.orderId, email: params.email } : { orderId: 0, email: "" },
    { query: { enabled: !!params } as any }
  );

  function handleSubmit(data: TrackForm) {
    const id = parseInt(data.orderId);
    if (isNaN(id) || id <= 0) {
      form.setError("orderId", { message: "Enter a valid order number" });
      return;
    }
    setParams({ orderId: id, email: data.email });
  }

  const currentStep = order ? getStepIndex(order.status) : -1;
  const isCancelled = order?.status === "cancelled";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-12 px-4">
      <div className="container mx-auto max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Track Your Order</h1>
          <p className="text-muted-foreground">
            Enter your order number and email address to see the latest status
          </p>
        </div>

        {/* Search Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Lookup</CardTitle>
            <CardDescription>Use the email address you placed the order with</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orderId">Order Number</Label>
                  <Input
                    id="orderId"
                    placeholder="e.g. 1234"
                    {...form.register("orderId", { required: "Required" })}
                  />
                  {form.formState.errors.orderId && (
                    <p className="text-xs text-destructive">{form.formState.errors.orderId.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="track-email">Email Address</Label>
                  <Input
                    id="track-email"
                    type="email"
                    placeholder="you@example.com"
                    {...form.register("email", { required: "Required" })}
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                <Search className="h-4 w-4" />
                {isLoading ? "Looking up order..." : "Track Order"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error state */}
        {isError && params && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="pt-6 flex items-start gap-3">
              <XCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-destructive">Order not found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  We couldn't find order #{params.orderId} for {params.email}. Please check the details and try again.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Result */}
        {order && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Order #{order.id}</CardTitle>
                    <CardDescription className="mt-1">
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-KE", {
                        year: "numeric", month: "long", day: "numeric"
                      })}
                    </CardDescription>
                  </div>
                  <Badge className={`text-sm px-3 py-1 ${STATUS_COLORS[order.status] ?? ""}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Steps */}
                {!isCancelled ? (
                  <div className="relative">
                    <div className="flex justify-between relative">
                      {/* Progress line */}
                      <div className="absolute top-5 left-5 right-5 h-0.5 bg-muted" />
                      <div
                        className="absolute top-5 left-5 h-0.5 bg-primary transition-all duration-500"
                        style={{ right: `${(STATUS_STEPS.length - 1 - currentStep) / (STATUS_STEPS.length - 1) * (100 - 10)}%` }}
                      />
                      {STATUS_STEPS.map((step, idx) => {
                        const Icon = step.icon;
                        const done = idx <= currentStep;
                        return (
                          <div key={step.key} className="flex flex-col items-center gap-2 relative z-10">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all ${done ? "bg-primary border-primary text-white" : "bg-background border-muted text-muted-foreground"}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="text-center">
                              <p className={`text-xs font-medium ${done ? "text-primary" : "text-muted-foreground"}`}>
                                {step.label}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Current status message */}
                    <div className="mt-6 p-3 bg-primary/5 rounded-lg text-center">
                      <p className="text-sm font-medium text-primary">
                        {STATUS_STEPS[currentStep]?.description ?? "Processing your order"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-100">
                    <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                    <p className="text-sm text-red-700">This order has been cancelled. Contact us for assistance.</p>
                  </div>
                )}

                <Separator />

                {/* Customer Info */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Delivery Contact</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      {order.customerEmail}
                    </div>
                    {order.customerPhone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        {order.customerPhone}
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex items-center justify-between font-medium">
                  <span>Total Amount</span>
                  <span className="text-lg">KES {order.totalAmount.toLocaleString()}</span>
                </div>

                {order.notes && (
                  <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <span className="font-medium">Note: </span>{order.notes}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card className="bg-muted/30">
              <CardContent className="pt-6 text-center space-y-2">
                <p className="text-sm font-medium">Need help with your order?</p>
                <p className="text-sm text-muted-foreground">
                  Call us on{" "}
                  <a href="tel:+254711293263" className="text-primary hover:underline font-medium">
                    +254 711 293 263
                  </a>{" "}
                  or visit us in Kitale Town
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

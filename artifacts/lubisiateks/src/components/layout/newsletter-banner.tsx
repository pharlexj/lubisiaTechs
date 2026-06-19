import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSubscribeNewsletter } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface NewsletterForm {
  email: string;
  name: string;
}

export function NewsletterBanner() {
  const [subscribed, setSubscribed] = useState(false);
  const form = useForm<NewsletterForm>();
  const mutation = useSubscribeNewsletter();

  async function onSubmit(data: NewsletterForm) {
    try {
      await mutation.mutateAsync({ data: { email: data.email, name: data.name || null } });
      setSubscribed(true);
      toast.success("You're subscribed! Welcome to the LubisiaTech newsletter.");
    } catch {
      toast.error("Subscription failed. Please try again.");
    }
  }

  return (
    <section className="bg-primary py-14 px-4">
      <div className="container mx-auto max-w-2xl text-center space-y-6 text-white">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-white/20 mx-auto">
          <Mail className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Stay in the Loop</h2>
          <p className="text-white/80 mt-2">
            Get tech tips, special deals, and the latest from LubisiaTech Solutions — straight to your inbox.
          </p>
        </div>
        {subscribed ? (
          <div className="flex items-center justify-center gap-2 text-green-300 font-medium">
            <CheckCircle className="h-5 w-5" />
            You're subscribed! Thank you.
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              placeholder="Your email address"
              type="email"
              required
              className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus-visible:ring-white/50"
              {...form.register("email", { required: true })}
            />
            <Button
              type="submit"
              variant="secondary"
              disabled={mutation.isPending}
              className="whitespace-nowrap"
            >
              {mutation.isPending ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        )}
        <p className="text-xs text-white/60">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}

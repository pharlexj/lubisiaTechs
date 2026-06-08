import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useCreateInquiry, useListServices } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MapPin, Phone, CheckCircle2 } from "lucide-react";

export function Contact() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const serviceId = searchParams.get('service');
  
  const { data: services } = useListServices();
  const createInquiry = useCreateInquiry();
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    serviceInterest: "",
    message: ""
  });

  useEffect(() => {
    if (serviceId && services) {
      const service = services.find(s => s.id.toString() === serviceId);
      if (service) {
        setFormData(prev => ({
          ...prev,
          serviceInterest: service.name,
          subject: `Inquiry about ${service.name}`
        }));
      }
    }
  }, [serviceId, services]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createInquiry.mutateAsync({
        data: formData
      });
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-xl text-center">
        <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Message Sent Successfully!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for reaching out to LubisiaTech Solutions. Our team will review your inquiry and get back to you shortly.
        </p>
        <Button onClick={() => setIsSuccess(false)} variant="outline">
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to upgrade your IT infrastructure or need expert technical support? 
            Contact our Kitale-based team today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Contact Info */}
          <div className="md:col-span-4 space-y-8">
            <div className="bg-card border rounded-2xl p-8 shadow-sm">
              <h3 className="font-semibold text-xl mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg text-primary shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">Our Location</div>
                    <div className="text-muted-foreground text-sm">Kitale Town, Trans-Nzoia County<br/>Kenya</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg text-primary shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">Phone Number</div>
                    <div className="text-muted-foreground text-sm">
                      <a href="tel:+254711293263" className="hover:text-primary transition-colors">+254 711 293 263</a>
                      <br/>Mon-Fri, 8am-5pm
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg text-primary shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">Email Address</div>
                    <div className="text-muted-foreground text-sm">
                      <a href="mailto:info@lubisiatechsolutions.co.ke" className="hover:text-primary transition-colors">info@lubisiatechsolutions.co.ke</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-8">
            <div className="bg-card border rounded-2xl p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                    <Input 
                      id="name" 
                      required 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="Jayla Juma"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                    <Input 
                      id="email" 
                      type="email" 
                      required 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="jayla@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      placeholder="+254 7..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceInterest">Service of Interest</Label>
                    <Select 
                      value={formData.serviceInterest} 
                      onValueChange={val => setFormData({...formData, serviceInterest: val})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        {services?.map(service => (
                          <SelectItem key={service.id} value={service.name}>{service.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject <span className="text-destructive">*</span></Label>
                  <Input 
                    id="subject" 
                    required 
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                    placeholder="How can we help?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message <span className="text-destructive">*</span></Label>
                  <Textarea 
                    id="message" 
                    required 
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    placeholder="Tell us about your project or inquiry..."
                    className="min-h-[150px]"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full md:w-auto px-8" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

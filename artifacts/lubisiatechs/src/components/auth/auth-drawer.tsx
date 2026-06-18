import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth-context";
import { useLoginUser, useRegisterUser } from "@workspace/api-client-react";
import { User, LogOut, LogIn, UserPlus, X, Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface AuthDrawerProps {
  open: boolean;
  onClose: () => void;
}

type Tab = "login" | "signup";

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  newsletter: boolean;
}

export function AuthDrawer({ open, onClose }: AuthDrawerProps) {
  const { user, login, logout, isAdmin } = useAuth();
  const [tab, setTab] = useState<Tab>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const loginMutation = useLoginUser();
  const registerMutation = useRegisterUser();

  const loginForm = useForm<LoginForm>();
  const registerForm = useForm<RegisterForm>({ defaultValues: { newsletter: true } });

  async function handleLogin(data: LoginForm) {
    try {
      const result = await loginMutation.mutateAsync({ data: { email: data.email, password: data.password } });
      login(result.token, result.user);
      toast.success(`Welcome back, ${result.user.name}!`);
      onClose();
    } catch {
      toast.error("Invalid email or password");
    }
  }

  async function handleRegister(data: RegisterForm) {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const result = await registerMutation.mutateAsync({
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
          newsletterSubscribed: data.newsletter,
        },
      });
      login(result.token, result.user);
      toast.success(`Account created! Welcome, ${result.user.name}!`);
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? "Registration failed";
      toast.error(msg);
    }
  }

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">
              {user ? "My Account" : "Sign In"}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {user ? (
            /* Logged-in state */
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-lg">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Badge variant={isAdmin ? "default" : "secondary"} className="mt-1 text-xs">
                    {isAdmin ? "Admin" : "Customer"}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Quick Links</h3>
                <div className="space-y-2">
                  <a href="/track-order" onClick={onClose} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-sm">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Track My Order
                  </a>
                  <a href="/shop" onClick={onClose} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-sm">
                    <User className="h-4 w-4 text-primary" />
                    Browse Shop
                  </a>
                  {isAdmin && (
                    <a href="/admin" onClick={onClose} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-sm">
                      <Lock className="h-4 w-4 text-primary" />
                      Admin Dashboard
                    </a>
                  )}
                </div>
              </div>

              <Separator />

              <Button
                variant="outline"
                className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/5"
                onClick={() => { logout(); onClose(); toast.success("Signed out successfully"); }}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            /* Auth forms */
            <div className="space-y-6">
              {/* Tabs */}
              <div className="flex bg-muted/50 rounded-lg p-1">
                <button
                  onClick={() => setTab("login")}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${tab === "login" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <LogIn className="h-4 w-4" /> Login
                  </span>
                </button>
                <button
                  onClick={() => setTab("signup")}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${tab === "signup" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <UserPlus className="h-4 w-4" /> Sign Up
                  </span>
                </button>
              </div>

              {tab === "login" ? (
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-9"
                        {...loginForm.register("email", { required: true })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-9 pr-10"
                        {...loginForm.register("password", { required: true })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing in..." : "Sign In"}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    No account?{" "}
                    <button type="button" onClick={() => setTab("signup")} className="text-primary hover:underline">
                      Sign up here
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reg-name"
                        placeholder="Jayla Juma"
                        className="pl-9"
                        {...registerForm.register("name", { required: true })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-9"
                        {...registerForm.register("email", { required: true })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reg-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 6 characters"
                        className="pl-9 pr-10"
                        {...registerForm.register("password", { required: true, minLength: 6 })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-confirm">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reg-confirm"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Repeat password"
                        className="pl-9 pr-10"
                        {...registerForm.register("confirmPassword", { required: true })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 accent-primary"
                      {...registerForm.register("newsletter")}
                    />
                    <span className="text-sm text-muted-foreground">
                      Subscribe to our newsletter for tech tips, deals and news from LubisiaTech
                    </span>
                  </label>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Creating account..." : "Create Account"}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button type="button" onClick={() => setTab("login")} className="text-primary hover:underline">
                      Sign in
                    </button>
                  </p>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/30 text-center">
          <p className="text-xs text-muted-foreground">
            LubisiaTech Solutions — Kitale Town, Kenya
          </p>
        </div>
      </div>
    </>
  );
}

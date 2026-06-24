import { useState } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/lib/cart";
import { useCreateOrder } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import {
	Trash2,
	ShoppingBag,
	Smartphone,
	CreditCard,
	CheckCircle2,
	Loader2,
} from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

type PaymentMethod = "mpesa" | "later";

type MpesaState =
	| { status: "idle" }
	| { status: "pushing" }
	| { status: "awaiting"; message: string }
	| { status: "error"; message: string };

export function Checkout() {
	const { items, total, removeItem, updateQuantity, clearCart } = useCart();
	const [, setLocation] = useLocation();
	const { toast } = useToast();
	const createOrder = useCreateOrder();

	const [formData, setFormData] = useState({
		customerName: "",
		customerEmail: "",
		customerPhone: "",
		notes: "",
	});

	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
	const [mpesaPhone, setMpesaPhone] = useState("");
	const [mpesaState, setMpesaState] = useState<MpesaState>({ status: "idle" });
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [orderId, setOrderId] = useState<number | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (items.length === 0) return;
		setIsSubmitting(true);

		try {
			const order = await createOrder.mutateAsync({
				data: {
					customerName: formData.customerName,
					customerEmail: formData.customerEmail,
					customerPhone: formData.customerPhone,
					notes: formData.notes,
					items: items.map((item) => ({
						productId: item.product.id,
						quantity: item.quantity,
						unitPrice: item.product.price,
					})),
				},
			});

			setOrderId(order.id);

			if (paymentMethod === "mpesa") {
				const phone = mpesaPhone || formData.customerPhone;
				if (!phone) {
					toast({
						title: "Phone number required",
						description: "Enter an M-Pesa phone number to proceed.",
						variant: "destructive",
					});
					setIsSubmitting(false);
					return;
				}

				setMpesaState({ status: "pushing" });

				const res = await fetch("/api/mpesa/stk-push", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						phone,
						amount: total,
						orderId: order.id,
						reference: `ORDER-${order.id}`,
					}),
				});

				const data = (await res.json()) as { message?: string; error?: string };

				if (!res.ok) {
					if (res.status === 503) {
						// M-Pesa not configured — fall through to "pay later" confirmation
						toast({
							title: "M-Pesa not yet configured",
							description:
								"The admin will contact you to arrange payment. Your order has been placed!",
						});
						setMpesaState({ status: "idle" });
					} else {
						setMpesaState({
							status: "error",
							message: data.error ?? "STK push failed. Please try again.",
						});
						setIsSubmitting(false);
						return;
					}
				} else {
					setMpesaState({
						status: "awaiting",
						message:
							data.message ?? "Check your phone and enter your M-Pesa PIN.",
					});
				}
			}

			clearCart();
			setIsSuccess(true);
		} catch {
			toast({
				title: "Order Failed",
				description:
					"There was an issue submitting your order. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// ── Success Screen ─────────────────────────────────────────────────────────
	if (isSuccess) {
		const mpesaAwaiting = mpesaState.status === "awaiting";
		return (
			<div className="container mx-auto px-4 py-24 max-w-2xl text-center">
				<div
					className={cn(
						"w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8",
						mpesaAwaiting
							? "bg-green-100 text-green-600 animate-pulse"
							: "bg-secondary/20 text-secondary",
					)}
				>
					{mpesaAwaiting ? (
						<Smartphone className="h-10 w-10" />
					) : (
						<CheckCircle2 className="h-10 w-10" />
					)}
				</div>

				<h1 className="text-4xl font-bold mb-4">
					{mpesaAwaiting ? "Check Your Phone!" : "Order Placed!"}
				</h1>

				{mpesaAwaiting ? (
					<>
						<div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 text-left">
							<p className="font-semibold text-green-800 mb-2 flex items-center gap-2">
								<Smartphone className="h-5 w-5" /> M-Pesa STK Push Sent
							</p>
							<p className="text-green-700 text-sm">{mpesaState.message}</p>
							<ol className="mt-4 space-y-2 text-sm text-green-700 list-decimal list-inside">
								<li>An M-Pesa prompt appeared on your phone</li>
								<li>Enter your M-Pesa PIN to complete payment</li>
								<li>You'll receive a confirmation SMS from M-Pesa</li>
							</ol>
						</div>
						<p className="text-sm text-muted-foreground mb-6">
							Order #{orderId} has been recorded. If you don't receive the
							prompt, check your phone network or contact us on WhatsApp.
						</p>
					</>
				) : (
					<p className="text-lg text-muted-foreground mb-10">
						Thank you! We've received your order and will contact you shortly
						regarding payment and delivery to{" "}
						{formData.customerPhone || formData.customerEmail}.
					</p>
				)}

				<Link href="/shop">
					<Button size="lg">Continue Shopping</Button>
				</Link>
			</div>
		);
	}

	// ── Empty Cart ─────────────────────────────────────────────────────────────
	if (items.length === 0) {
		return (
			<div className="container mx-auto px-4 py-24 text-center">
				<ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-50" />
				<h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
				<p className="text-muted-foreground mb-8">
					Looks like you haven't added anything yet.
				</p>
				<Link href="/shop">
					<Button>Browse Products</Button>
				</Link>
			</div>
		);
	}

	// ── Checkout Form ──────────────────────────────────────────────────────────
	return (
		<div className="container mx-auto px-4 py-12">
			<h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
				{/* ── Left: Customer Details + Payment ── */}
				<div className="lg:col-span-7 space-y-6">
					{/* Customer details */}
					<div className="bg-card border rounded-2xl p-6 md:p-8">
						<h2 className="text-xl font-semibold mb-6">Customer Details</h2>
						<form
							id="checkout-form"
							onSubmit={handleSubmit}
							className="space-y-6"
						>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<Label htmlFor="customerName">
										Full Name <span className="text-destructive">*</span>
									</Label>
									<Input
										id="customerName"
										required
										value={formData.customerName}
										onChange={(e) =>
											setFormData({ ...formData, customerName: e.target.value })
										}
										placeholder="Jayla Juma"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="customerPhone">
										Phone Number <span className="text-destructive">*</span>
									</Label>
									<Input
										id="customerPhone"
										required
										value={formData.customerPhone}
										onChange={(e) => {
											setFormData({
												...formData,
												customerPhone: e.target.value,
											});
											if (!mpesaPhone) setMpesaPhone(e.target.value);
										}}
										placeholder="0700 000 000"
									/>
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor="customerEmail">
									Email Address <span className="text-destructive">*</span>
								</Label>
								<Input
									id="customerEmail"
									type="email"
									required
									value={formData.customerEmail}
									onChange={(e) =>
										setFormData({ ...formData, customerEmail: e.target.value })
									}
									placeholder="jayla@example.com"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="notes">Delivery Notes (Optional)</Label>
								<Textarea
									id="notes"
									value={formData.notes}
									onChange={(e) =>
										setFormData({ ...formData, notes: e.target.value })
									}
									placeholder="Any special instructions for delivery..."
									className="min-h-[80px]"
								/>
							</div>
						</form>
					</div>

					{/* Payment method */}
					<div className="bg-card border rounded-2xl p-6 md:p-8">
						<h2 className="text-xl font-semibold mb-4">Payment Method</h2>
						<div className="grid grid-cols-2 gap-3 mb-6">
							<button
								type="button"
								onClick={() => setPaymentMethod("mpesa")}
								className={cn(
									"flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
									paymentMethod === "mpesa"
										? "border-green-500 bg-green-50"
										: "border-border hover:border-muted-foreground",
								)}
							>
								<div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
									<Smartphone className="h-5 w-5 text-green-600" />
								</div>
								<div className="text-center">
									<p className="font-semibold text-sm">M-Pesa</p>
									<p className="text-xs text-muted-foreground">STK Push</p>
								</div>
								{paymentMethod === "mpesa" && (
									<CheckCircle2 className="h-4 w-4 text-green-500 absolute top-3 right-3" />
								)}
							</button>

							<button
								type="button"
								onClick={() => setPaymentMethod("later")}
								className={cn(
									"flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
									paymentMethod === "later"
										? "border-primary bg-primary/5"
										: "border-border hover:border-muted-foreground",
								)}
							>
								<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
									<CreditCard className="h-5 w-5 text-primary" />
								</div>
								<div className="text-center">
									<p className="font-semibold text-sm">Pay Later</p>
									<p className="text-xs text-muted-foreground">Cash / Bank</p>
								</div>
							</button>
						</div>

						{paymentMethod === "mpesa" && (
							<div className="space-y-3 bg-green-50 border border-green-200 rounded-xl p-4">
								<div className="flex items-center gap-2 text-green-800 font-medium text-sm">
									<Smartphone className="h-4 w-4" /> M-Pesa Payment Details
								</div>
								<div className="space-y-1">
									<Label htmlFor="mpesaPhone" className="text-sm">
										M-Pesa Phone Number
									</Label>
									<Input
										id="mpesaPhone"
										value={mpesaPhone}
										onChange={(e) => setMpesaPhone(e.target.value)}
										placeholder="0712 345 678"
										className="bg-white"
									/>
									<p className="text-xs text-muted-foreground">
										You'll receive a push notification on this number to confirm
										payment of <strong>KES {total.toLocaleString()}</strong>.
									</p>
								</div>
								{mpesaState.status === "error" && (
									<p className="text-sm text-destructive">
										⚠ {mpesaState.message}
									</p>
								)}
							</div>
						)}

						{paymentMethod === "later" && (
							<div className="bg-muted/40 rounded-xl p-4 text-sm text-muted-foreground">
								<p>
									Your order will be confirmed and we'll contact you at{" "}
									<strong>
										{formData.customerPhone || "your phone number"}
									</strong>{" "}
									to arrange payment via bank transfer, cash, or other methods.
								</p>
							</div>
						)}
					</div>
				</div>

				{/* ── Right: Order Summary ── */}
				<div className="lg:col-span-5">
					<div className="bg-muted/30 border rounded-2xl p-6 md:p-8 sticky top-24">
						<h2 className="text-xl font-semibold mb-6">Order Summary</h2>

						<div className="space-y-4 mb-6 max-h-[350px] overflow-y-auto pr-2">
							{items.map((item) => (
								<div key={item.product.id} className="flex gap-4">
									<div className="w-16 h-16 bg-white border rounded-md overflow-hidden flex-shrink-0">
										{item.product.imageUrl && (
											<img
												src={item.product.imageUrl}
												alt={item.product.name}
												className="w-full h-full object-cover"
											/>
										)}
									</div>
									<div className="flex-1 flex flex-col justify-between">
										<div className="flex justify-between items-start">
											<h4 className="text-sm font-medium line-clamp-2 leading-tight pr-4">
												{item.product.name}
											</h4>
											<button
												onClick={() => removeItem(item.product.id)}
												className="text-muted-foreground hover:text-destructive transition-colors"
											>
												<Trash2 className="h-4 w-4" />
											</button>
										</div>
										<div className="flex justify-between items-center mt-2">
											<div className="flex items-center border rounded bg-background h-7">
												<button
													onClick={() =>
														updateQuantity(item.product.id, item.quantity - 1)
													}
													className="px-2 text-xs text-muted-foreground hover:bg-muted"
												>
													-
												</button>
												<span className="w-6 text-center text-xs font-medium">
													{item.quantity}
												</span>
												<button
													onClick={() =>
														updateQuantity(item.product.id, item.quantity + 1)
													}
													className="px-2 text-xs text-muted-foreground hover:bg-muted"
													disabled={item.quantity >= item.product.stock}
												>
													+
												</button>
											</div>
											<span className="text-sm font-semibold">
												KES{" "}
												{(item.product.price * item.quantity).toLocaleString()}
											</span>
										</div>
									</div>
								</div>
							))}
						</div>

						<Separator className="mb-4" />

						<div className="space-y-3 mb-8">
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Subtotal</span>
								<span className="font-medium">
									KES {total.toLocaleString()}
								</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Shipping</span>
								<span className="font-medium text-secondary">
									Calculated later
								</span>
							</div>
							<Separator className="my-2" />
							<div className="flex justify-between items-center">
								<span className="font-semibold text-lg">Total</span>
								<span className="font-bold text-xl text-primary">
									KES {total.toLocaleString()}
								</span>
							</div>
						</div>

						<Button
							type="submit"
							form="checkout-form"
							className={cn(
								"w-full h-12 text-base gap-2",
								paymentMethod === "mpesa" && "bg-green-600 hover:bg-green-700",
							)}
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin" />
									{mpesaState.status === "pushing"
										? "Sending M-Pesa prompt…"
										: "Processing…"}
								</>
							) : paymentMethod === "mpesa" ? (
								<>
									<Smartphone className="h-4 w-4" /> Pay KES{" "}
									{total.toLocaleString()} via M-Pesa
								</>
							) : (
								"Place Order"
							)}
						</Button>

						<p className="text-xs text-center text-muted-foreground mt-3">
							{paymentMethod === "mpesa"
								? "You'll receive an M-Pesa prompt on your phone."
								: "Payment will be arranged after order confirmation."}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

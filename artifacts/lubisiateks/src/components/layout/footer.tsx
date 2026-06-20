import { ShieldCheck } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
		<footer className="bg-foreground text-background py-12">
			<div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-8">
				<div className="md:col-span-2">
					<Link
						href="/"
						className="flex items-center gap-2 font-bold text-xl mb-4"
					>
						<ShieldCheck className="h-6 w-6 text-primary" />
						<span>LubisiaTech Solutions</span>
					</Link>
					<p className="text-muted-foreground text-sm mb-6">
						Professional IT & web services tailored for Kenyan businesses. Based
						in Kitale Town, Trans-Nzoia County.
					</p>
					<div className="space-y-2">
						<div className="text-xs text-muted-foreground uppercase font-semibold tracking-wide mb-3">
							Leadership
						</div>
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
								MJ
							</div>
							<div>
								<div className="text-sm font-medium">Moses Juma</div>
								<div className="text-xs text-muted-foreground">
									Chief Executive Officer
								</div>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-sm">
								KO
							</div>
							<div>
								<div className="text-sm font-medium">Kevin Odhiambo</div>
								<div className="text-xs text-muted-foreground">IT Director</div>
							</div>
						</div>
					</div>
				</div>
				<div>
					<h3 className="font-semibold mb-4">Quick Links</h3>
					<ul className="space-y-2 text-sm text-muted-foreground">
						<li>
							<Link href="/" className="hover:text-primary transition-colors">
								Home
							</Link>
						</li>
						<li>
							<Link
								href="/services"
								className="hover:text-primary transition-colors"
							>
								IT Services
							</Link>
						</li>
						<li>
							<Link
								href="/shop"
								className="hover:text-primary transition-colors"
							>
								Accessory Shop
							</Link>
						</li>
						<li>
							<Link
								href="/deals"
								className="hover:text-primary transition-colors"
							>
								Deals
							</Link>
						</li>
						<li>
							<Link
								href="/blog"
								className="hover:text-primary transition-colors"
							>
								Blog
							</Link>
						</li>
						<li>
							<Link
								href="/portfolio"
								className="hover:text-primary transition-colors"
							>
								Portfolio
							</Link>
						</li>
						<li>
							<Link
								href="/contact"
								className="hover:text-primary transition-colors"
							>
								Contact Us
							</Link>
						</li>
					</ul>
				</div>
				<div>
					<h3 className="font-semibold mb-4">Contact</h3>
					<ul className="space-y-2 text-sm text-muted-foreground">
						<li>Kitale Town, Vision Gate</li>
						<li>Trans-Nzoia County, Kenya</li>
						<li className="pt-1">
							<a
								href="tel:+254711293263"
								className="hover:text-primary transition-colors"
							>
								+254 711 293 263
							</a>
						</li>
						<li>
							<a
								href="mailto:info@lubisiatechsolutions.co.ke"
								className="hover:text-primary transition-colors"
							>
								lubisiatechsolutions@gmail.com
							</a>
						</li>
					</ul>
				</div>
				<div>
					<h3 className="font-semibold mb-4">Legal</h3>
					<ul className="space-y-2 text-sm text-muted-foreground">
						<li>
							<Link
								href="/admin"
								className="hover:text-primary transition-colors"
							>
								Admin Portal
							</Link>
						</li>
						<li>Terms of Service</li>
						<li>Privacy Policy</li>
						<li className="pt-2 text-xs">Reg: BN-2RCYYB96</li>
					</ul>
				</div>
			</div>
			<div className="container mx-auto px-4 mt-8 pt-8 border-t border-white/10 text-center text-sm text-muted-foreground">
				&copy; {new Date().getFullYear()} LubisiaTech Solutions. All rights
				reserved.
			</div>
		</footer>
	);
}

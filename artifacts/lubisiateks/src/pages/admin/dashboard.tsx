import { useState, useRef } from "react";
import { useUpload } from "@workspace/object-storage-web";
import {
  useGetSummaryStats, getGetSummaryStatsQueryKey,
  useListServices, getListServicesQueryKey, useCreateService, useUpdateService, useDeleteService,
  useListProducts, getListProductsQueryKey, useCreateProduct, useUpdateProduct, useDeleteProduct,
  useListOrders, getListOrdersQueryKey, useUpdateOrder,
  useListInquiries, getListInquiriesQueryKey, useUpdateInquiry,
  useListBlogPosts, getListBlogPostsQueryKey, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost,
  useListSettings, getListSettingsQueryKey, useUpsertSetting,
  useListAffiliatePrograms, getListAffiliateProgramsQueryKey, useCreateAffiliateProgram, useUpdateAffiliateProgram, useDeleteAffiliateProgram,
  useListAffiliateLinks, getListAffiliateLinksQueryKey, useCreateAffiliateLink, useUpdateAffiliateLink, useDeleteAffiliateLink,
  useListNewsletterSubscribers,
  useListWebsiteTemplates, getListWebsiteTemplatesQueryKey, useCreateWebsiteTemplate, useUpdateWebsiteTemplate, useDeleteWebsiteTemplate,
  useListAboutSections, getListAboutSectionsQueryKey, useUpsertAboutSection,
  useListTeamMembers, getListTeamMembersQueryKey, useCreateTeamMember, useUpdateTeamMember, useDeleteTeamMember,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Package, ShoppingCart, MessageSquare, DollarSign, Activity,
  Pencil, Trash2, Plus, MousePointerClick, FileText, Settings,
  Link2, LayoutDashboard, Wrench, BookOpen, RefreshCw, CheckCircle,
  Users, Mail, Globe, Monitor, Clock, Layers, Smartphone, Upload, ImageIcon, X as XIcon,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "pending" ? "border-orange-400 text-orange-500" :
    status === "completed" ? "border-green-500 text-green-600" :
    status === "processing" ? "border-blue-500 text-blue-600" :
    status === "new" ? "border-primary text-primary" :
    status === "resolved" ? "border-green-500 text-green-600" :
    "border-muted-foreground text-muted-foreground";
  return <Badge variant="outline" className={color}>{status}</Badge>;
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: React.ElementType; color: string }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
        </div>
        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Services Tab ──────────────────────────────────────────────────────────────

function ServicesTab() {
  const qc = useQueryClient();
  const { data: services, isLoading } = useListServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", description: "", category: "", price: "", imageUrl: "", featured: false });

  const invalidate = () => qc.invalidateQueries({ queryKey: getListServicesQueryKey() });

  const openNew = () => { setEditing(null); setForm({ name: "", description: "", category: "", price: "", imageUrl: "", featured: false }); setOpen(true); };
  const openEdit = (s: any) => { setEditing(s.id); setForm({ name: s.name, description: s.description, category: s.category, price: s.price?.toString() ?? "", imageUrl: s.imageUrl ?? "", featured: s.featured ?? false }); setOpen(true); };

  const handleSave = async () => {
    const data = { name: form.name, description: form.description, category: form.category, price: form.price ? Number(form.price) : null, imageUrl: form.imageUrl || null, featured: form.featured };
    if (editing !== null) {
      await updateService.mutateAsync({ id: editing, data });
    } else {
      await createService.mutateAsync({ data });
    }
    invalidate();
    setOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this service?")) return;
    await deleteService.mutateAsync({ id });
    invalidate();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">IT Services</h2>
        <Button onClick={openNew} size="sm" className="gap-2"><Plus className="h-4 w-4" /> New Service</Button>
      </div>
      {isLoading ? <div className="h-32 bg-muted animate-pulse rounded-xl" /> : (
        <div className="rounded-xl border divide-y">
          {(services ?? []).map(s => (
            <div key={s.id} className="flex items-center justify-between p-4 gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{s.name}</span>
                  <Badge variant="secondary">{s.category}</Badge>
                  {s.featured && <Badge className="bg-yellow-500 text-black hover:bg-yellow-500 text-xs">Featured</Badge>}
                </div>
                <p className="text-sm text-muted-foreground truncate mt-0.5">{s.description}</p>
                {s.price && <p className="text-sm font-medium mt-0.5">KES {Number(s.price).toLocaleString()}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="icon" variant="ghost" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
          {(services ?? []).length === 0 && <p className="text-center py-8 text-muted-foreground">No services yet.</p>}
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Service" : "New Service"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>Category</Label><Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} /></div>
            <div><Label>Price (KES, optional)</Label><Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></div>
            <div><Label>Image URL (optional)</Label><Input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} /></div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="featured-svc" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="h-4 w-4" />
              <Label htmlFor="featured-svc">Featured on homepage</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.name || !form.description || !form.category}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Products Tab ─────────────────────────────────────────────────────────────

function ProductsTab() {
  const qc = useQueryClient();
  const { data: products, isLoading } = useListProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", description: "", category: "", price: "", stock: "0", imageUrl: "", featured: false });

  const invalidate = () => qc.invalidateQueries({ queryKey: getListProductsQueryKey() });

  const openNew = () => { setEditing(null); setForm({ name: "", description: "", category: "", price: "", stock: "0", imageUrl: "", featured: false }); setOpen(true); };
  const openEdit = (p: any) => { setEditing(p.id); setForm({ name: p.name, description: p.description, category: p.category, price: String(p.price), stock: String(p.stock), imageUrl: p.imageUrl ?? "", featured: p.featured ?? false }); setOpen(true); };

  const handleSave = async () => {
    const data = { name: form.name, description: form.description, category: form.category, price: Number(form.price), stock: Number(form.stock), imageUrl: form.imageUrl || null, featured: form.featured };
    if (editing !== null) {
      await updateProduct.mutateAsync({ id: editing, data });
    } else {
      await createProduct.mutateAsync({ data });
    }
    invalidate();
    setOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct.mutateAsync({ id });
    invalidate();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Accessories & Products</h2>
        <Button onClick={openNew} size="sm" className="gap-2"><Plus className="h-4 w-4" /> New Product</Button>
      </div>
      {isLoading ? <div className="h-32 bg-muted animate-pulse rounded-xl" /> : (
        <div className="rounded-xl border divide-y">
          {(products ?? []).map(p => (
            <div key={p.id} className="flex items-center justify-between p-4 gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{p.name}</span>
                  <Badge variant="secondary">{p.category}</Badge>
                  {p.featured && <Badge className="bg-yellow-500 text-black hover:bg-yellow-500 text-xs">Featured</Badge>}
                </div>
                <div className="text-sm text-muted-foreground mt-0.5 flex gap-3">
                  <span>KES {Number(p.price).toLocaleString()}</span>
                  <span>Stock: {p.stock}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
          {(products ?? []).length === 0 && <p className="text-center py-8 text-muted-foreground">No products yet.</p>}
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Product" : "New Product"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>Category</Label><Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Price (KES)</Label><Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></div>
              <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} /></div>
            </div>
            <div><Label>Image URL (optional)</Label><Input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} /></div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="featured-prd" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="h-4 w-4" />
              <Label htmlFor="featured-prd">Featured on homepage</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.name || !form.price}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Blog Tab ──────────────────────────────────────────────────────────────────

function BlogTab() {
  const qc = useQueryClient();
  const { data: posts, isLoading } = useListBlogPosts();
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const deletePost = useDeleteBlogPost();

  const [open, setOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", category: "News", author: "", coverImageUrl: "", published: false });

  const invalidate = () => qc.invalidateQueries({ queryKey: getListBlogPostsQueryKey() });

  const toSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const openNew = () => { setEditingSlug(null); setForm({ title: "", slug: "", excerpt: "", content: "", category: "News", author: "", coverImageUrl: "", published: false }); setOpen(true); };
  const openEdit = (p: any) => { setEditingSlug(p.slug); setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content, category: p.category, author: p.author ?? "", coverImageUrl: p.coverImageUrl ?? "", published: p.published }); setOpen(true); };

  const handleSave = async () => {
    const data = { title: form.title, slug: form.slug, excerpt: form.excerpt, content: form.content, category: form.category, author: form.author || null, coverImageUrl: form.coverImageUrl || null, published: form.published };
    if (editingSlug) {
      await updatePost.mutateAsync({ slug: editingSlug, data });
    } else {
      await createPost.mutateAsync({ data });
    }
    invalidate();
    setOpen(false);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this post?")) return;
    await deletePost.mutateAsync({ slug });
    invalidate();
  };

  const CATEGORIES = ["News", "Projects", "Tech Tips", "Announcements"];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Blog Posts</h2>
        <Button onClick={openNew} size="sm" className="gap-2"><Plus className="h-4 w-4" /> New Post</Button>
      </div>
      {isLoading ? <div className="h-32 bg-muted animate-pulse rounded-xl" /> : (
        <div className="rounded-xl border divide-y">
          {(posts ?? []).map(p => (
            <div key={p.slug} className="flex items-center justify-between p-4 gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{p.title}</span>
                  <Badge variant="secondary">{p.category}</Badge>
                  <Badge variant={p.published ? "default" : "outline"} className={p.published ? "" : "text-muted-foreground"}>
                    {p.published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-0.5">
                  {p.author && <span>{p.author} · </span>}
                  {new Date(p.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(p.slug)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
          {(posts ?? []).length === 0 && <p className="text-center py-8 text-muted-foreground">No blog posts yet.</p>}
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editingSlug ? "Edit Post" : "New Blog Post"}</DialogTitle></DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: editingSlug ? f.slug : toSlug(e.target.value) }))} />
            </div>
            <div>
              <Label>Slug (URL)</Label>
              <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="font-mono text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Author (optional)</Label><Input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} /></div>
            </div>
            <div><Label>Cover Image URL (optional)</Label><Input value={form.coverImageUrl} onChange={e => setForm(f => ({ ...f, coverImageUrl: e.target.value }))} /></div>
            <div><Label>Excerpt (short summary)</Label><Textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={2} /></div>
            <div><Label>Content</Label><Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={8} /></div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="published" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="h-4 w-4" />
              <Label htmlFor="published">Published (visible on website)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.title || !form.slug || !form.excerpt || !form.content}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Affiliate Tab ────────────────────────────────────────────────────────────

function AffiliateTab() {
  const qc = useQueryClient();
  const { data: programs } = useListAffiliatePrograms();
  const { data: links, isLoading: linksLoading } = useListAffiliateLinks();
  const createProgram = useCreateAffiliateProgram();
  const updateProgram = useUpdateAffiliateProgram();
  const deleteProgram = useDeleteAffiliateProgram();
  const createLink = useCreateAffiliateLink();
  const updateLink = useUpdateAffiliateLink();
  const deleteLink = useDeleteAffiliateLink();

  const [tab, setTab] = useState<"programs" | "links">("programs");

  // Programs form
  const [progOpen, setProgOpen] = useState(false);
  const [editingProg, setEditingProg] = useState<number | null>(null);
  const [progForm, setProgForm] = useState({ name: "", slug: "", baseUrl: "", affiliateId: "", description: "", logoUrl: "", commissionRate: "", active: true });

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: getListAffiliateProgramsQueryKey() });
    qc.invalidateQueries({ queryKey: getListAffiliateLinksQueryKey() });
  };

  const toSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const openNewProg = () => { setEditingProg(null); setProgForm({ name: "", slug: "", baseUrl: "", affiliateId: "", description: "", logoUrl: "", commissionRate: "", active: true }); setProgOpen(true); };
  const openEditProg = (p: any) => { setEditingProg(p.id); setProgForm({ name: p.name, slug: p.slug, baseUrl: p.baseUrl, affiliateId: p.affiliateId, description: p.description ?? "", logoUrl: p.logoUrl ?? "", commissionRate: p.commissionRate?.toString() ?? "", active: p.active }); setProgOpen(true); };

  const handleSaveProg = async () => {
    const data: any = { name: progForm.name, slug: progForm.slug, baseUrl: progForm.baseUrl, affiliateId: progForm.affiliateId, description: progForm.description || null, logoUrl: progForm.logoUrl || null, commissionRate: progForm.commissionRate ? Number(progForm.commissionRate) : null, active: progForm.active };
    if (editingProg !== null) {
      await updateProgram.mutateAsync({ id: editingProg, data });
    } else {
      await createProgram.mutateAsync({ data });
    }
    invalidateAll();
    setProgOpen(false);
  };

  const handleDeleteProg = async (id: number) => {
    if (!confirm("Delete this program? All its links will also be deleted.")) return;
    await deleteProgram.mutateAsync({ id });
    invalidateAll();
  };

  // Links form
  const [linkOpen, setLinkOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<number | null>(null);
  const [linkForm, setLinkForm] = useState({ programId: "", title: "", description: "", affiliateUrl: "", imageUrl: "", category: "", price: "", originalPrice: "", currency: "KES", featured: false, active: true });

  const openNewLink = () => { setEditingLink(null); setLinkForm({ programId: "", title: "", description: "", affiliateUrl: "", imageUrl: "", category: "", price: "", originalPrice: "", currency: "KES", featured: false, active: true }); setLinkOpen(true); };
  const openEditLink = (l: any) => { setEditingLink(l.id); setLinkForm({ programId: String(l.programId), title: l.title, description: l.description ?? "", affiliateUrl: l.affiliateUrl, imageUrl: l.imageUrl ?? "", category: l.category, price: l.price?.toString() ?? "", originalPrice: l.originalPrice?.toString() ?? "", currency: l.currency, featured: l.featured, active: l.active }); setLinkOpen(true); };

  const handleSaveLink = async () => {
    const data: any = { programId: Number(linkForm.programId), title: linkForm.title, description: linkForm.description || null, affiliateUrl: linkForm.affiliateUrl, imageUrl: linkForm.imageUrl || null, category: linkForm.category, price: linkForm.price ? Number(linkForm.price) : null, originalPrice: linkForm.originalPrice ? Number(linkForm.originalPrice) : null, currency: linkForm.currency, featured: linkForm.featured, active: linkForm.active };
    if (editingLink !== null) {
      await updateLink.mutateAsync({ id: editingLink, data });
    } else {
      await createLink.mutateAsync({ data });
    }
    invalidateAll();
    setLinkOpen(false);
  };

  const handleDeleteLink = async (id: number) => {
    if (!confirm("Delete this affiliate link?")) return;
    await deleteLink.mutateAsync({ id });
    invalidateAll();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b pb-2 mb-4">
        <Button variant={tab === "programs" ? "default" : "ghost"} size="sm" onClick={() => setTab("programs")}>Programs</Button>
        <Button variant={tab === "links" ? "default" : "ghost"} size="sm" onClick={() => setTab("links")}>Product Links</Button>
      </div>

      {tab === "programs" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Affiliate Programs</h2>
            <Button onClick={openNewProg} size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add Program</Button>
          </div>
          <div className="rounded-xl border divide-y">
            {(programs ?? []).map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{p.name}</span>
                    <Badge variant={p.active ? "default" : "outline"} className={p.active ? "" : "text-muted-foreground"}>{p.active ? "Active" : "Inactive"}</Badge>
                    {p.commissionRate && <span className="text-sm text-green-600 font-medium">{p.commissionRate}% commission</span>}
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">
                    ID: {p.affiliateId} · {p.totalClicks} clicks
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="icon" variant="ghost" onClick={() => openEditProg(p)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDeleteProg(p.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
            {(programs ?? []).length === 0 && <p className="text-center py-8 text-muted-foreground">No affiliate programs yet. Add Jumia to get started.</p>}
          </div>
          <Dialog open={progOpen} onOpenChange={setProgOpen}>
            <DialogContent>
              <DialogHeader><DialogTitle>{editingProg ? "Edit Program" : "New Affiliate Program"}</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Program Name (e.g. Jumia Kenya)</Label>
                  <Input value={progForm.name} onChange={e => setProgForm(f => ({ ...f, name: e.target.value, slug: editingProg ? f.slug : toSlug(e.target.value) }))} />
                </div>
                <div><Label>Slug</Label><Input value={progForm.slug} onChange={e => setProgForm(f => ({ ...f, slug: e.target.value }))} className="font-mono text-sm" /></div>
                <div><Label>Base URL (e.g. https://www.jumia.co.ke)</Label><Input value={progForm.baseUrl} onChange={e => setProgForm(f => ({ ...f, baseUrl: e.target.value }))} /></div>
                <div><Label>Your Affiliate ID / Publisher ID</Label><Input value={progForm.affiliateId} onChange={e => setProgForm(f => ({ ...f, affiliateId: e.target.value }))} /></div>
                <div><Label>Commission Rate % (optional)</Label><Input type="number" value={progForm.commissionRate} onChange={e => setProgForm(f => ({ ...f, commissionRate: e.target.value }))} /></div>
                <div><Label>Description (optional)</Label><Input value={progForm.description} onChange={e => setProgForm(f => ({ ...f, description: e.target.value }))} /></div>
                <div><Label>Logo URL (optional)</Label><Input value={progForm.logoUrl} onChange={e => setProgForm(f => ({ ...f, logoUrl: e.target.value }))} /></div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="prog-active" checked={progForm.active} onChange={e => setProgForm(f => ({ ...f, active: e.target.checked }))} className="h-4 w-4" />
                  <Label htmlFor="prog-active">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setProgOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveProg} disabled={!progForm.name || !progForm.baseUrl || !progForm.affiliateId}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {tab === "links" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Affiliate Product Links</h2>
            <Button onClick={openNewLink} size="sm" className="gap-2" disabled={!programs?.length}><Plus className="h-4 w-4" /> Add Link</Button>
          </div>
          {!programs?.length && <p className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg border border-dashed">Add a program first before adding product links.</p>}
          {linksLoading ? <div className="h-32 bg-muted animate-pulse rounded-xl" /> : (
            <div className="rounded-xl border divide-y">
              {(links ?? []).map(l => (
                <div key={l.id} className="flex items-center justify-between p-4 gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{l.title}</span>
                      <Badge variant="secondary">{l.programName}</Badge>
                      <Badge variant="outline">{l.category}</Badge>
                      {l.featured && <Badge className="bg-yellow-500 text-black hover:bg-yellow-500 text-xs">Featured</Badge>}
                      {!l.active && <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>}
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5 flex gap-3">
                      {l.price && <span>{l.currency} {Number(l.price).toLocaleString()}</span>}
                      <span className="flex items-center gap-1"><MousePointerClick className="h-3 w-3" /> {l.clicks} clicks</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="icon" variant="ghost" onClick={() => openEditLink(l)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDeleteLink(l.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
              {(links ?? []).length === 0 && <p className="text-center py-8 text-muted-foreground">No affiliate links yet.</p>}
            </div>
          )}
          <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>{editingLink ? "Edit Affiliate Link" : "New Affiliate Product Link"}</DialogTitle></DialogHeader>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                <div>
                  <Label>Program</Label>
                  <Select value={linkForm.programId} onValueChange={v => setLinkForm(f => ({ ...f, programId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select program" /></SelectTrigger>
                    <SelectContent>{(programs ?? []).map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Product Title</Label><Input value={linkForm.title} onChange={e => setLinkForm(f => ({ ...f, title: e.target.value }))} /></div>
                <div><Label>Full Affiliate URL (your tracking link)</Label><Input value={linkForm.affiliateUrl} onChange={e => setLinkForm(f => ({ ...f, affiliateUrl: e.target.value }))} placeholder="https://c.jumia.io/?a=XXXX&..." /></div>
                <div><Label>Category</Label><Input value={linkForm.category} onChange={e => setLinkForm(f => ({ ...f, category: e.target.value }))} placeholder="Laptops, Phones, Accessories..." /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label>Price</Label><Input type="number" value={linkForm.price} onChange={e => setLinkForm(f => ({ ...f, price: e.target.value }))} /></div>
                  <div><Label>Original Price</Label><Input type="number" value={linkForm.originalPrice} onChange={e => setLinkForm(f => ({ ...f, originalPrice: e.target.value }))} /></div>
                  <div><Label>Currency</Label><Input value={linkForm.currency} onChange={e => setLinkForm(f => ({ ...f, currency: e.target.value }))} /></div>
                </div>
                <div><Label>Product Image URL (optional)</Label><Input value={linkForm.imageUrl} onChange={e => setLinkForm(f => ({ ...f, imageUrl: e.target.value }))} /></div>
                <div><Label>Description (optional)</Label><Textarea value={linkForm.description} onChange={e => setLinkForm(f => ({ ...f, description: e.target.value }))} rows={2} /></div>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="link-featured" checked={linkForm.featured} onChange={e => setLinkForm(f => ({ ...f, featured: e.target.checked }))} className="h-4 w-4" />
                    <Label htmlFor="link-featured">Featured</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="link-active" checked={linkForm.active} onChange={e => setLinkForm(f => ({ ...f, active: e.target.checked }))} className="h-4 w-4" />
                    <Label htmlFor="link-active">Active</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setLinkOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveLink} disabled={!linkForm.programId || !linkForm.title || !linkForm.affiliateUrl || !linkForm.category}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}

// ─── Settings Tab ──────────────────────────────────────────────────────────────

const SENSITIVE_KEYS = ["secret", "key", "passkey", "password", "token", "pass"];
const isSensitive = (key: string) =>
  SENSITIVE_KEYS.some((k) => key.toLowerCase().includes(k));

const GROUP_META: Record<string, { icon: React.ComponentType<any>; description: string; color: string }> = {
  "M-Pesa": {
    icon: Smartphone,
    description:
      "Safaricom Daraja API credentials. Get them at developer.safaricom.co.ke → My Apps. Use 'sandbox' environment for testing and 'live' for production.",
    color: "text-green-600",
  },
};

function SettingsField({ s, edits, setEdits }: {
  s: { key: string; label: string; value: string };
  edits: Record<string, string>;
  setEdits: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  const [show, setShow] = useState(false);
  const sensitive = isSensitive(s.key);
  const value = edits[s.key] !== undefined ? edits[s.key] : s.value;

  return (
    <div className="space-y-1">
      <Label className="text-sm font-medium flex items-center gap-1.5">
        {s.label}
        {sensitive && (
          <span className="text-xs font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            sensitive
          </span>
        )}
      </Label>
      <div className="relative">
        <Input
          type={sensitive && !show ? "password" : "text"}
          value={value}
          onChange={(e) =>
            setEdits((prev) => ({ ...prev, [s.key]: e.target.value }))
          }
          placeholder={sensitive ? "••••••••" : ""}
          className="pr-10"
        />
        {sensitive && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
            onClick={() => setShow((v) => !v)}
          >
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
}

function SettingsTab() {
  const qc = useQueryClient();
  const { data: settings, isLoading } = useListSettings();
  const upsert = useUpsertSetting();
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const grouped = (settings ?? []).reduce(
    (acc, s) => {
      if (!acc[s.group]) acc[s.group] = [];
      acc[s.group].push(s);
      return acc;
    },
    {} as Record<string, typeof settings extends (infer T)[] | undefined ? T[] : never[]>
  );

  const handleSave = async (group: string) => {
    setSaving(group);
    const groupSettings = grouped[group] ?? [];
    await Promise.all(
      groupSettings.map((s) => {
        const val = edits[s.key] !== undefined ? edits[s.key] : s.value;
        return upsert.mutateAsync({
          key: s.key,
          data: { value: val, label: s.label, group: s.group },
        });
      })
    );
    qc.invalidateQueries({ queryKey: getListSettingsQueryKey() });
    setSaving(null);
    setSaved(group);
    setTimeout(() => setSaved(null), 3000);
  };

  if (isLoading) return <div className="h-32 bg-muted animate-pulse rounded-xl" />;

  if ((settings ?? []).length === 0) {
    return (
      <div className="text-center py-12 border rounded-xl border-dashed">
        <Settings className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground">No site settings configured yet.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Settings will appear here once seeded.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Site Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure integrations and API keys for your website.
        </p>
      </div>

      {Object.entries(grouped).map(([group, items]) => {
        const meta = GROUP_META[group];
        const GroupIcon = meta?.icon;
        return (
          <Card key={group}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                {GroupIcon && (
                  <GroupIcon className={`h-4 w-4 ${meta.color ?? "text-muted-foreground"}`} />
                )}
                {group}
              </CardTitle>
              {meta?.description && (
                <CardDescription className="text-sm leading-relaxed">
                  {meta.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {(items as any[]).map((s: any) => (
                <SettingsField
                  key={s.key}
                  s={s}
                  edits={edits}
                  setEdits={setEdits}
                />
              ))}

              {group === "M-Pesa" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800 space-y-2">
                  <p className="font-semibold flex items-center gap-2">
                    <Smartphone className="h-4 w-4" /> How to get your M-Pesa API keys
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-green-700">
                    <li>
                      Go to{" "}
                      <a
                        href="https://developer.safaricom.co.ke"
                        target="_blank"
                        rel="noreferrer"
                        className="underline font-medium"
                      >
                        developer.safaricom.co.ke
                      </a>
                    </li>
                    <li>Create an app and copy the Consumer Key & Secret</li>
                    <li>For STK Push, use the <strong>Lipa Na M-Pesa Online</strong> API</li>
                    <li>Set Callback URL to: <code className="bg-green-100 px-1 rounded text-xs font-mono">https://your-domain.com/api/mpesa/callback</code></li>
                    <li>Change Environment from <code className="bg-green-100 px-1 rounded text-xs font-mono">sandbox</code> to <code className="bg-green-100 px-1 rounded text-xs font-mono">live</code> when ready</li>
                  </ol>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  className="gap-2"
                  disabled={saving === group}
                  onClick={() => handleSave(group)}
                >
                  {saving === group ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  Save {group} Settings
                </Button>
                {saved === group && (
                  <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" /> Saved!
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────

function OrdersTab() {
  const qc = useQueryClient();
  const { data: orders, isLoading } = useListOrders();
  const updateOrder = useUpdateOrder();

  const handleStatus = async (id: number, status: string) => {
    await updateOrder.mutateAsync({ id, data: { status } });
    qc.invalidateQueries({ queryKey: getListOrdersQueryKey() });
  };

  const STATUSES = ["pending", "processing", "completed", "cancelled"];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Orders</h2>
      {isLoading ? <div className="h-32 bg-muted animate-pulse rounded-xl" /> : (
        <div className="rounded-xl border divide-y">
          {(orders ?? []).map(o => (
            <div key={o.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">Order #{o.id}</span>
                  <StatusBadge status={o.status} />
                </div>
                <div className="text-sm text-muted-foreground mt-0.5">{o.customerName} · {o.customerEmail}</div>
                <div className="text-sm font-medium mt-0.5">KES {Number(o.totalAmount).toLocaleString()}</div>
              </div>
              <Select value={o.status} onValueChange={v => handleStatus(o.id, v)}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          ))}
          {(orders ?? []).length === 0 && <p className="text-center py-8 text-muted-foreground">No orders yet.</p>}
        </div>
      )}
    </div>
  );
}

// ─── Inquiries Tab ────────────────────────────────────────────────────────────

function InquiriesTab() {
  const qc = useQueryClient();
  const { data: inquiries, isLoading } = useListInquiries();
  const updateInquiry = useUpdateInquiry();

  const handleStatus = async (id: number, status: string) => {
    await updateInquiry.mutateAsync({ id, data: { status } });
    qc.invalidateQueries({ queryKey: getListInquiriesQueryKey() });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Inquiries</h2>
      {isLoading ? <div className="h-32 bg-muted animate-pulse rounded-xl" /> : (
        <div className="rounded-xl border divide-y">
          {(inquiries ?? []).map(i => (
            <div key={i.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{i.subject}</span>
                  <StatusBadge status={i.status} />
                  {i.serviceInterest && <Badge variant="outline">{i.serviceInterest}</Badge>}
                </div>
                {i.status === "new" && (
                  <Button size="sm" variant="outline" onClick={() => handleStatus(i.id, "resolved")}>Mark Resolved</Button>
                )}
              </div>
              <div className="text-sm text-muted-foreground">{i.name} · {i.email} {i.phone && `· ${i.phone}`}</div>
              <p className="text-sm bg-muted/30 p-3 rounded-md border border-border/50">{i.message}</p>
            </div>
          ))}
          {(inquiries ?? []).length === 0 && <p className="text-center py-8 text-muted-foreground">No inquiries yet.</p>}
        </div>
      )}
    </div>
  );
}

// ─── Website Templates Tab ────────────────────────────────────────────────────

const TEMPLATE_CATS = ["Business", "E-commerce", "Portfolio", "NGO", "Government", "Restaurant"];

const emptyTpl = () => ({
  name: "", description: "", category: "Business", price: "",
  previewUrl: "", screenshotUrl: "", features: "", techStack: "",
  deliveryDays: "7", featured: false, active: true,
});

function WebsiteTemplatesTab() {
  const qc = useQueryClient();
  const { data: templates, isLoading } = useListWebsiteTemplates({});
  const createMut = useCreateWebsiteTemplate();
  const updateMut = useUpdateWebsiteTemplate();
  const deleteMut = useDeleteWebsiteTemplate();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyTpl());

  function openNew() { setForm(emptyTpl()); setEditingId(null); setOpen(true); }
  function openEdit(t: any) {
    setForm({
      name: t.name, description: t.description, category: t.category,
      price: String(t.price), previewUrl: t.previewUrl ?? "",
      screenshotUrl: t.screenshotUrl ?? "", features: t.features,
      techStack: t.techStack ?? "", deliveryDays: String(t.deliveryDays),
      featured: t.featured, active: t.active,
    });
    setEditingId(t.id);
    setOpen(true);
  }

  async function handleSave() {
    const payload = {
      name: form.name, description: form.description, category: form.category,
      price: Number(form.price), previewUrl: form.previewUrl || null,
      screenshotUrl: form.screenshotUrl || null,
      features: form.features || "[]",
      techStack: form.techStack || null,
      deliveryDays: Number(form.deliveryDays) || 7,
      featured: form.featured, active: form.active,
    };
    if (editingId) {
      await updateMut.mutateAsync({ id: editingId, data: payload });
    } else {
      await createMut.mutateAsync({ data: payload });
    }
    qc.invalidateQueries({ queryKey: getListWebsiteTemplatesQueryKey() });
    setOpen(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this template?")) return;
    await deleteMut.mutateAsync({ id });
    qc.invalidateQueries({ queryKey: getListWebsiteTemplatesQueryKey() });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold">Website Templates</h2><p className="text-sm text-muted-foreground">Manage the templates for sale on your website</p></div>
        <Button onClick={openNew} className="gap-2"><Plus className="h-4 w-4" /> Add Template</Button>
      </div>
      {isLoading ? <p className="text-muted-foreground py-8 text-center">Loading...</p> : (
        <div className="grid md:grid-cols-2 gap-4">
          {(templates ?? []).map(t => (
            <Card key={t.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{t.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">{t.category}</Badge>
                      {t.featured && <Badge className="text-xs bg-amber-500 border-0">Featured</Badge>}
                      {!t.active && <Badge variant="outline" className="text-xs text-muted-foreground">Inactive</Badge>}
                    </div>
                  </div>
                  <span className="font-bold text-primary text-lg">KES {Number(t.price).toLocaleString()}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-2">{t.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  {(t.deliveryDays ?? 0) > 0 && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{t.deliveryDays}d</span>}
                  {t.techStack && <span className="flex items-center gap-1"><Layers className="h-3 w-3" />{t.techStack}</span>}
                  {t.previewUrl && <a href={t.previewUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1"><Monitor className="h-3 w-3" />Preview</a>}
                </div>
              </CardContent>
              <div className="p-4 pt-0 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => openEdit(t)}><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10 gap-1" onClick={() => handleDelete(t.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </Card>
          ))}
          {(templates ?? []).length === 0 && <div className="col-span-2 text-center py-12 text-muted-foreground">No templates yet. Add your first one!</div>}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingId ? "Edit Template" : "Add Template"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Template Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{TEMPLATE_CATS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Price (KES)</Label><Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></div>
            </div>
            <div><Label>Preview URL (live demo)</Label><Input value={form.previewUrl} onChange={e => setForm(f => ({ ...f, previewUrl: e.target.value }))} placeholder="https://..." /></div>
            <div><Label>Screenshot URL</Label><Input value={form.screenshotUrl} onChange={e => setForm(f => ({ ...f, screenshotUrl: e.target.value }))} placeholder="https://..." /></div>
            <div><Label>Features (JSON array, e.g. ["M-Pesa", "Mobile-Responsive"])</Label><Input value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} placeholder='["Feature 1","Feature 2"]' /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Tech Stack</Label><Input value={form.techStack} onChange={e => setForm(f => ({ ...f, techStack: e.target.value }))} placeholder="React, WordPress..." /></div>
              <div><Label>Delivery Days</Label><Input type="number" value={form.deliveryDays} onChange={e => setForm(f => ({ ...f, deliveryDays: e.target.value }))} /></div>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} /><span className="text-sm">Featured</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} /><span className="text-sm">Active</span></label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={createMut.isPending || updateMut.isPending}>
              {createMut.isPending || updateMut.isPending ? "Saving..." : "Save Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Members Tab (Users + Newsletter) ─────────────────────────────────────────

function MembersTab() {
  const { data: subscribers, isLoading: subLoading } = useListNewsletterSubscribers();
  const [activeSection, setActiveSection] = useState<"newsletter">("newsletter");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Members</h2>
        <p className="text-sm text-muted-foreground">Users with accounts and newsletter subscribers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Mail className="h-4 w-4 text-teal-600" /> Newsletter Subscribers</CardTitle>
          <CardDescription>{(subscribers ?? []).length} subscribers</CardDescription>
        </CardHeader>
        <CardContent>
          {subLoading ? (
            <p className="text-muted-foreground text-center py-6">Loading...</p>
          ) : (subscribers ?? []).length === 0 ? (
            <p className="text-muted-foreground text-center py-6">No subscribers yet. The newsletter signup is live on your website.</p>
          ) : (
            <div className="divide-y">
              {(subscribers ?? []).map(s => (
                <div key={s.id} className="py-3 flex items-center justify-between">
                  <div>
                    {s.name && <p className="text-sm font-medium">{s.name}</p>}
                    <p className="text-sm text-muted-foreground">{s.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(s.subscribedAt).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-indigo-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-sm">User Accounts</p>
              <p className="text-sm text-muted-foreground mt-1">
                Customers can create accounts via the Sign In button on your website. Their accounts let them track orders, manage newsletter preferences, and get personalized service.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                To create an <strong>admin account</strong>, register normally then update the <code className="bg-muted px-1 rounded text-xs">role</code> column in the <code className="bg-muted px-1 rounded text-xs">users</code> table to <code className="bg-muted px-1 rounded text-xs">admin</code>.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Team Photo Uploader ──────────────────────────────────────────────────────

function TeamPhotoUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading, progress } = useUpload({
    onSuccess: (response) => {
      onChange(`/api/storage${response.objectPath}`);
    },
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-2">
      <Label>Profile Photo (optional)</Label>
      <div className="flex items-center gap-3">
        {/* Preview */}
        <div className="h-16 w-16 rounded-full border-2 border-dashed border-border bg-muted flex items-center justify-center shrink-0 overflow-hidden">
          {value ? (
            <img src={value} alt="Preview" className="h-full w-full object-cover rounded-full" />
          ) : (
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          {/* Upload button */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="gap-1.5 text-xs"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Uploading {progress != null ? `${progress}%` : "..."}
                </>
              ) : (
                <>
                  <Upload className="h-3 w-3" />
                  Upload Photo
                </>
              )}
            </Button>
            {value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange("")}
                className="text-xs text-destructive hover:text-destructive gap-1"
              >
                <XIcon className="h-3 w-3" /> Remove
              </Button>
            )}
          </div>

          {/* Manual URL fallback */}
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Or paste image URL..."
            className="text-xs h-8"
          />
        </div>
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

// ─── About Tab ────────────────────────────────────────────────────────────────

const ABOUT_SECTION_DEFS = [
  { key: "vision",      label: "Vision",      hint: "What we aspire to become" },
  { key: "mission",     label: "Mission",     hint: "What we do every day to get there" },
  { key: "mandate",     label: "Mandate",     hint: "Our broader responsibility to society" },
  { key: "core_values", label: "Core Values", hint: "Use one line per value: 'Value — Description'" },
];

function AboutTab() {
  const qc = useQueryClient();
  const { data: sections = [], isLoading: sectionsLoading } = useListAboutSections();
  const { data: members = [], isLoading: membersLoading } = useListTeamMembers();
  const upsertSection = useUpsertAboutSection();
  const createMember = useCreateTeamMember();
  const updateMember = useUpdateTeamMember();
  const deleteMember = useDeleteTeamMember();

  const sectionMap = Object.fromEntries(sections.map((s) => [s.key, s]));
  const [sectionEdits, setSectionEdits] = useState<Record<string, { title: string; content: string }>>({});

  const [teamForm, setTeamForm] = useState({ name: "", role: "", bio: "", photoUrl: "", linkedIn: "" });
  const [editingMember, setEditingMember] = useState<number | null>(null);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);

  const getEdit = (key: string, field: "title" | "content") => {
    const def = ABOUT_SECTION_DEFS.find((d) => d.key === key);
    if (sectionEdits[key]?.[field] !== undefined) return sectionEdits[key][field];
    if (sectionMap[key]) return sectionMap[key][field];
    return field === "title" ? (def?.label ?? "") : "";
  };

  const setEdit = (key: string, field: "title" | "content", value: string) => {
    setSectionEdits((prev) => ({
      ...prev,
      [key]: { ...(prev[key] ?? { title: getEdit(key, "title"), content: getEdit(key, "content") }), [field]: value },
    }));
  };

  const saveSection = async (key: string) => {
    const title = getEdit(key, "title");
    const content = getEdit(key, "content");
    if (!title || !content) return;
    const def = ABOUT_SECTION_DEFS.find((d) => d.key === key);
    const order = (ABOUT_SECTION_DEFS.indexOf(def!) + 1);
    await upsertSection.mutateAsync({ key, data: { title, content, displayOrder: order } });
    qc.invalidateQueries({ queryKey: getListAboutSectionsQueryKey() });
    setSectionEdits((prev) => { const n = { ...prev }; delete n[key]; return n; });
  };

  const openAddMember = () => {
    setEditingMember(null);
    setTeamForm({ name: "", role: "", bio: "", photoUrl: "", linkedIn: "" });
    setMemberDialogOpen(true);
  };
  const openEditMember = (m: (typeof members)[number]) => {
    setEditingMember(m.id);
    setTeamForm({ name: m.name, role: m.role, bio: m.bio, photoUrl: m.photoUrl ?? "", linkedIn: m.linkedIn ?? "" });
    setMemberDialogOpen(true);
  };
  const saveMember = async () => {
    const payload = {
      name: teamForm.name,
      role: teamForm.role,
      bio: teamForm.bio,
      photoUrl: teamForm.photoUrl || null,
      linkedIn: teamForm.linkedIn || null,
    };
    if (editingMember) {
      await updateMember.mutateAsync({ id: editingMember, data: payload });
    } else {
      await createMember.mutateAsync({ data: { ...payload, displayOrder: members.length, active: 1 } });
    }
    qc.invalidateQueries({ queryKey: getListTeamMembersQueryKey() });
    setMemberDialogOpen(false);
  };
  const toggleActive = async (m: (typeof members)[number]) => {
    await updateMember.mutateAsync({ id: m.id, data: { name: m.name, role: m.role, active: m.active === 1 ? 0 : 1 } });
    qc.invalidateQueries({ queryKey: getListTeamMembersQueryKey() });
  };
  const removeMember = async (id: number) => {
    await deleteMember.mutateAsync({ id });
    qc.invalidateQueries({ queryKey: getListTeamMembersQueryKey() });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold">About Us Content</h2>
        <p className="text-sm text-muted-foreground">Manage the content shown on the About Us page</p>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ABOUT_SECTION_DEFS.map(({ key, label, hint }) => (
          <Card key={key}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" /> {label}
              </CardTitle>
              <CardDescription>{hint}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sectionsLoading ? (
                <div className="h-24 bg-muted rounded animate-pulse" />
              ) : (
                <>
                  <div>
                    <Label className="text-xs text-muted-foreground">Section Title</Label>
                    <Input
                      value={getEdit(key, "title")}
                      onChange={(e) => setEdit(key, "title", e.target.value)}
                      placeholder={label}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Content</Label>
                    <Textarea
                      value={getEdit(key, "content")}
                      onChange={(e) => setEdit(key, "content", e.target.value)}
                      rows={key === "core_values" ? 7 : 4}
                      placeholder={key === "core_values" ? "Integrity — We operate with honesty...\nExcellence — We deliver high quality..." : ""}
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={() => saveSection(key)}
                    disabled={upsertSection.isPending}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                    Save {label}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Members */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Team Members</h3>
            <p className="text-sm text-muted-foreground">Shown in the carousel on the About Us page</p>
          </div>
          <Button size="sm" onClick={openAddMember} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-1.5">
            <Plus className="h-4 w-4" /> Add Member
          </Button>
        </div>

        {membersLoading ? (
          <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />)}</div>
        ) : members.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No team members yet. Click "Add Member" to add your first.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((m) => (
              <Card key={m.id} className={m.active === 0 ? "opacity-50" : ""}>
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {m.photoUrl ? (
                        <img src={m.photoUrl} alt={m.name} className="h-12 w-12 rounded-full object-cover" />
                      ) : (
                        m.name.charAt(0)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{m.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{m.role}</p>
                      {m.bio && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{m.bio}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1 text-xs gap-1" onClick={() => openEditMember(m)}>
                      <Pencil className="h-3 w-3" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`flex-1 text-xs gap-1 ${m.active === 1 ? "text-muted-foreground" : "text-primary border-primary"}`}
                      onClick={() => toggleActive(m)}
                    >
                      {m.active === 1 ? "Hide" : "Show"}
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 text-xs" onClick={() => removeMember(m.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Team Member Dialog */}
      <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingMember ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label>Full Name *</Label><Input value={teamForm.name} onChange={e => setTeamForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Jane Mwangi" /></div>
            <div><Label>Role / Title *</Label><Input value={teamForm.role} onChange={e => setTeamForm(f => ({ ...f, role: e.target.value }))} placeholder="e.g. Lead Technician" /></div>
            <div><Label>Bio (optional)</Label><Textarea value={teamForm.bio} onChange={e => setTeamForm(f => ({ ...f, bio: e.target.value }))} rows={3} placeholder="Short bio shown on the About page..." /></div>
            <TeamPhotoUpload
              value={teamForm.photoUrl}
              onChange={(url) => setTeamForm(f => ({ ...f, photoUrl: url }))}
            />
            <div><Label>LinkedIn URL (optional)</Label><Input value={teamForm.linkedIn} onChange={e => setTeamForm(f => ({ ...f, linkedIn: e.target.value }))} placeholder="https://linkedin.com/in/..." /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMemberDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveMember} disabled={!teamForm.name || !teamForm.role || createMember.isPending || updateMember.isPending} className="bg-primary text-primary-foreground">
              {editingMember ? "Save Changes" : "Add Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export function AdminDashboard() {
  const { data: stats, isLoading } = useGetSummaryStats();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 animate-pulse">
        <div className="h-10 bg-muted rounded w-48 mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-muted rounded-xl" />)}
        </div>
        <div className="h-96 bg-muted rounded-xl" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">LubisiaTech Solutions management console.</p>
        </div>
        <Badge variant="outline" className="text-primary border-primary flex items-center gap-1 py-1.5">
          <Activity className="h-3.5 w-3.5" /> System Online
        </Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Orders" value={stats?.totalOrders ?? 0} icon={ShoppingCart} color="bg-primary/10 text-primary" />
        <StatCard label="Total Revenue" value={`KES ${(stats?.totalRevenue ?? 0).toLocaleString()}`} icon={DollarSign} color="bg-green-500/10 text-green-600" />
        <StatCard label="Products" value={stats?.totalProducts ?? 0} icon={Package} color="bg-blue-500/10 text-blue-600" />
        <StatCard label="Inquiries" value={stats?.totalInquiries ?? 0} icon={MessageSquare} color="bg-orange-500/10 text-orange-600" />
        <StatCard label="Blog Posts" value={stats?.totalBlogPosts ?? 0} icon={FileText} color="bg-violet-500/10 text-violet-600" />
        <StatCard label="Affiliate Clicks" value={stats?.totalAffiliateClicks ?? 0} icon={MousePointerClick} color="bg-cyan-500/10 text-cyan-600" />
        <StatCard label="Services" value={stats?.totalServices ?? 0} icon={Wrench} color="bg-rose-500/10 text-rose-600" />
        <StatCard label="Users" value={stats?.totalUsers ?? 0} icon={Users} color="bg-indigo-500/10 text-indigo-600" />
        <StatCard label="Newsletter" value={stats?.totalNewsletterSubscribers ?? 0} icon={Mail} color="bg-teal-500/10 text-teal-600" />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 h-12 bg-muted/50 p-1 flex-wrap gap-1">
          <TabsTrigger value="overview" className="h-10 px-4 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <LayoutDashboard className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="blog" className="h-10 px-4 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <BookOpen className="h-4 w-4" /> Blog
          </TabsTrigger>
          <TabsTrigger value="services" className="h-10 px-4 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Wrench className="h-4 w-4" /> Services
          </TabsTrigger>
          <TabsTrigger value="products" className="h-10 px-4 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Package className="h-4 w-4" /> Products
          </TabsTrigger>
          <TabsTrigger value="affiliate" className="h-10 px-4 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Link2 className="h-4 w-4" /> Affiliate
          </TabsTrigger>
          <TabsTrigger value="orders" className="h-10 px-4 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <ShoppingCart className="h-4 w-4" /> Orders
          </TabsTrigger>
          <TabsTrigger value="inquiries" className="h-10 px-4 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <MessageSquare className="h-4 w-4" /> Inquiries
          </TabsTrigger>
          <TabsTrigger value="settings" className="h-10 px-4 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Settings className="h-4 w-4" /> Settings
          </TabsTrigger>
          <TabsTrigger value="templates" className="h-10 px-4 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Globe className="h-4 w-4" /> Templates
          </TabsTrigger>
          <TabsTrigger value="members" className="h-10 px-4 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Users className="h-4 w-4" /> Members
          </TabsTrigger>
          <TabsTrigger value="about" className="h-10 px-4 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <BookOpen className="h-4 w-4" /> About Us
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {(stats?.recentOrders ?? []).length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No orders yet.</p>
                ) : (
                  <div className="divide-y">
                    {(stats?.recentOrders ?? []).map(o => (
                      <div key={o.id} className="py-3 flex justify-between items-start gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">Order #{o.id}</span>
                            <StatusBadge status={o.status} />
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">{o.customerName}</div>
                        </div>
                        <span className="text-sm font-medium">KES {Number(o.totalAmount).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Inquiries</CardTitle>
                <CardDescription>Latest customer messages</CardDescription>
              </CardHeader>
              <CardContent>
                {(stats?.recentInquiries ?? []).length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No inquiries yet.</p>
                ) : (
                  <div className="divide-y">
                    {(stats?.recentInquiries ?? []).map(i => (
                      <div key={i.id} className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{i.subject}</span>
                          <StatusBadge status={i.status} />
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">{i.name} · {i.email}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blog"><BlogTab /></TabsContent>
        <TabsContent value="services"><ServicesTab /></TabsContent>
        <TabsContent value="products"><ProductsTab /></TabsContent>
        <TabsContent value="affiliate"><AffiliateTab /></TabsContent>
        <TabsContent value="orders"><OrdersTab /></TabsContent>
        <TabsContent value="inquiries"><InquiriesTab /></TabsContent>
        <TabsContent value="settings"><SettingsTab /></TabsContent>
        <TabsContent value="templates"><WebsiteTemplatesTab /></TabsContent>
        <TabsContent value="members"><MembersTab /></TabsContent>
        <TabsContent value="about"><AboutTab /></TabsContent>
      </Tabs>
    </div>
  );
}

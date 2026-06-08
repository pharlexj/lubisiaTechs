import { useGetBlogPost, useListBlogPosts } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { getGetBlogPostQueryKey } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

export function BlogDetail() {
  const { slug } = useParams();
  
  const { data: post, isLoading } = useGetBlogPost(slug || "", {
    query: {
      enabled: !!slug,
      queryKey: getGetBlogPostQueryKey(slug || "")
    }
  });

  const { data: recentPosts } = useListBlogPosts({ published: true });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl animate-pulse">
        <div className="h-8 w-24 bg-muted rounded mb-8" />
        <div className="h-[400px] bg-muted rounded-2xl mb-8 w-full" />
        <div className="h-12 bg-muted rounded mb-4 w-3/4" />
        <div className="h-6 bg-muted rounded mb-12 w-1/4" />
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <Link href="/blog" className="text-primary hover:underline flex items-center justify-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>
      </div>
    );
  }

  const paragraphs = post.content.split('\n').filter(p => p.trim() !== '');

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
        <article>
          <div className="mb-8">
            <Badge className="mb-4">{post.category}</Badge>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">{post.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="font-medium text-foreground">{post.author}</span>
              <span>•</span>
              <time dateTime={post.createdAt}>{new Date(post.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</time>
            </div>
          </div>

          {post.coverImageUrl && (
            <div className="aspect-[21/9] rounded-2xl overflow-hidden mb-12 bg-muted">
              <img 
                src={post.coverImageUrl} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-bold">
            {paragraphs.map((p, i) => (
              <p key={i} className="mb-6">{p}</p>
            ))}
          </div>
        </article>

        <aside className="space-y-8">
          <div className="sticky top-24">
            <h3 className="font-bold text-lg mb-4 border-b pb-2">Recent Posts</h3>
            <div className="space-y-6">
              {recentPosts?.filter(p => p.slug !== post.slug).slice(0, 4).map(recent => (
                <Link key={recent.slug} href={`/blog/${recent.slug}`} className="block group">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded bg-muted shrink-0 overflow-hidden">
                      {recent.coverImageUrl && (
                        <img src={recent.coverImageUrl} alt={recent.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium line-clamp-2 group-hover:text-primary transition-colors text-sm mb-1">{recent.title}</h4>
                      <p className="text-xs text-muted-foreground">{new Date(recent.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

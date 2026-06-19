import { useListBlogPosts } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const { data: posts, isLoading } = useListBlogPosts({ 
    published: true, 
    ...(selectedCategory ? { category: selectedCategory } : {}) 
  });

  const categories = ["News", "Projects", "Tech Tips", "Announcements"];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Blog & Insights</h1>
        <p className="text-lg text-muted-foreground">Latest news, tech tips, and project updates from our team.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <Button 
          variant={selectedCategory === undefined ? "default" : "outline"}
          onClick={() => setSelectedCategory(undefined)}
          className="rounded-full"
        >
          All
        </Button>
        {categories.map(cat => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            onClick={() => setSelectedCategory(cat)}
            className="rounded-full"
          >
            {cat}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="flex flex-col gap-4 animate-pulse">
              <div className="bg-muted rounded-xl aspect-[16/9] w-full" />
              <div className="h-6 w-24 bg-muted rounded" />
              <div className="h-8 w-full bg-muted rounded" />
              <div className="h-20 w-full bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group" data-reveal="up" data-delay={String((i % 3) * 150)}>
              <Card className="hover-up h-full overflow-hidden border-border/50 hover:border-primary/30 transition-colors">
                <div className="aspect-[16/9] overflow-hidden bg-muted relative">
                  {post.coverImageUrl ? (
                    <img 
                      src={post.coverImageUrl} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-primary/5">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="shadow-sm">{post.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <span className="font-medium text-foreground">{post.author}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-muted/30 rounded-2xl border border-dashed">
          <h3 className="text-xl font-medium mb-2">No posts found</h3>
          <p className="text-muted-foreground">Check back later for updates.</p>
        </div>
      )}
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, BookOpen, Clock, User } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  author?: string;
  readTime?: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "How to Stay Healthy During Flu Season",
    excerpt:
      "Essential tips and products to keep you and your family protected during the flu season.",
    image: "/images/blog/flu-season.jpg",
    date: "December 27, 2025",
    category: "Health Tips",
    author: "Dr. Sarah",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "The Importance of First Aid Kits at Home",
    excerpt:
      "Every household should have a well-stocked first aid kit. Learn what essentials to include.",
    image: "/images/blog/first-aid.jpg",
    date: "December 20, 2025",
    category: "Safety",
    author: "Medical Team",
    readTime: "4 min read",
  },
  {
    id: 3,
    title: "Understanding Your Blood Pressure Monitor",
    excerpt:
      "A guide to using and understanding your home blood pressure monitoring device.",
    image: "/images/blog/blood-pressure.jpg",
    date: "December 15, 2025",
    category: "Medical Devices",
    author: "Health Expert",
    readTime: "6 min read",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Health Tips": "from-green-500 to-emerald-500",
  Safety: "from-amber-500 to-orange-500",
  "Medical Devices": "from-blue-500 to-cyan-500",
};

const getCategoryGradient = (category: string): string => {
  return CATEGORY_COLORS[category] || "from-primary to-primary/80";
};

export function BlogSection() {
  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-primary font-medium text-sm">
                Health Insights
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              From Our{" "}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Blog
              </span>
            </h2>

            <p className="text-muted-foreground max-w-md">
              Expert health tips, guides, and latest updates from our medical team
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            className="border-2 hover:border-primary/50 hover:bg-primary/5"
          >
            <Link href="/blog" className="flex items-center gap-2">
              View All Articles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {BLOG_POSTS.map((post, index) => (
            <article
              key={post.id}
              className={`group bg-card rounded-2xl overflow-hidden border-2 border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300 ${
                index === 0 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <Link href={`/blog/${post.id}`} className="block">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1.5 bg-gradient-to-r ${getCategoryGradient(
                        post.category
                      )} text-white text-xs font-semibold rounded-full shadow-lg`}
                    >
                      {post.category}
                    </span>
                  </div>

                  {post.readTime && (
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-5 md:p-6">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>

                  {post.author && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                      <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                    </>
                  )}
                </div>

                <Link href={`/blog/${post.id}`}>
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                </Link>

                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                  {post.excerpt}
                </p>

                <Link
                  href={`/blog/${post.id}`}
                  className="inline-flex items-center gap-2 text-primary font-semibold text-sm group/link"
                >
                  Read More
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-card rounded-2xl border-2 border-border">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              Want to contribute?{" "}
              <Link
                href="/contact"
                className="text-primary hover:underline font-semibold"
              >
                Write for us →
              </Link>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
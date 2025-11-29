import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'GamepadTest blog - Tips, guides, and news about gaming hardware testing.',
  alternates: {
    canonical: 'https://www.gamepadtest.tech/blog',
  },
};

const blogPosts = [
  {
    title: 'How to Detect Stick Drift on Your Controller',
    description: 'Learn the signs of stick drift and how to test your controller for this common issue using our gamepad tester.',
    date: 'January 15, 2025',
    category: 'Guides',
    slug: 'detect-stick-drift',
  },
  {
    title: 'Understanding GPU Benchmarks: What the Numbers Mean',
    description: 'A comprehensive guide to interpreting GPU benchmark results and what they mean for your gaming performance.',
    date: 'January 10, 2025',
    category: 'Education',
    slug: 'understanding-gpu-benchmarks',
  },
  {
    title: 'Setting Up Your Microphone for Streaming',
    description: 'Tips and tricks for optimizing your microphone settings for the best audio quality in streams and recordings.',
    date: 'January 5, 2025',
    category: 'Streaming',
    slug: 'mic-setup-streaming',
  },
  {
    title: 'MIDI Controllers: A Beginner\'s Guide',
    description: 'Everything you need to know about MIDI controllers, from choosing the right one to testing it properly.',
    date: 'December 28, 2024',
    category: 'Music',
    slug: 'midi-beginners-guide',
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-10 w-10 text-primary animate-bounce-in" />
            <h1 className="text-4xl font-bold animate-fade-in-right animate-stagger-1">Blog</h1>
          </div>
          <p className="text-xl text-muted-foreground animate-fade-in-up animate-stagger-2">
            Tips, guides, and news about gaming hardware testing
          </p>
        </div>

        <div className="grid gap-6">
          {blogPosts.map((post, index) => (
            <Card key={post.slug} className={`animate-fade-in-up animate-stagger-${index + 3} hover-lift`}>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded">{post.category}</span>
                  <span>{post.date}</span>
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription>{post.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="gap-2 p-0 h-auto text-primary hover:text-primary/80">
                  Read More
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            More articles coming soon! Check back regularly for the latest tips and guides.
          </p>
        </div>
      </div>
    </div>
  );
}

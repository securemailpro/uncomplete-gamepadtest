import type { Metadata } from 'next';
import { Mail, MessageSquare, Github, Twitter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the GamepadTest team. We\'d love to hear from you!',
  alternates: {
    canonical: 'https://www.gamepadtest.tech/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageSquare className="h-10 w-10 text-primary animate-bounce-in" />
            <h1 className="text-4xl font-bold animate-fade-in-right animate-stagger-1">Contact Us</h1>
          </div>
          <p className="text-xl text-muted-foreground animate-fade-in-up animate-stagger-2">
            We&apos;d love to hear from you
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="animate-fade-in-left animate-stagger-3 hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Email Us
              </CardTitle>
              <CardDescription>
                For general inquiries and support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Have a question, suggestion, or found a bug? Drop us an email and we&apos;ll get back to you as soon as possible.
              </p>
              <Button asChild variant="outline" className="w-full">
                <a href="mailto:hello@gamepadtest.tech">
                  hello@gamepadtest.tech
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-right animate-stagger-3 hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="h-5 w-5 text-primary" />
                Open Source
              </CardTitle>
              <CardDescription>
                Contribute to the project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Found a bug or have a feature request? Open an issue on our GitHub repository or submit a pull request.
              </p>
              <Button asChild variant="outline" className="w-full">
                <a href="https://github.com/gamepadtest" target="_blank" rel="noopener noreferrer">
                  View on GitHub
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 animate-fade-in-up animate-stagger-4">
          <CardHeader>
            <CardTitle>Connect With Us</CardTitle>
            <CardDescription>Follow us on social media for updates and tips</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="outline" className="gap-2">
                <a href="https://twitter.com/gamepadtest" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                  Twitter
                </a>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <a href="https://github.com/gamepadtest" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-12 p-8 bg-muted/50 rounded-lg animate-fade-in-up">
          <h2 className="text-2xl font-bold mb-4">FAQ</h2>
          <p className="text-muted-foreground mb-6">
            Before reaching out, you might find your answer in our frequently asked questions on each tester page.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="secondary">
              <a href="/gamepad-tester">Gamepad FAQ</a>
            </Button>
            <Button asChild variant="secondary">
              <a href="/gpu-tester">GPU FAQ</a>
            </Button>
            <Button asChild variant="secondary">
              <a href="/mic-tester">Mic FAQ</a>
            </Button>
            <Button asChild variant="secondary">
              <a href="/midi-tester">MIDI FAQ</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

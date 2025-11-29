import type { Metadata } from 'next';
import { Gamepad2, Users, Award, Zap, Shield, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

export const metadata: Metadata = {
  title: 'About GamepadTest',
  description: 'Learn about GamepadTest\'s mission to provide free, reliable hardware testing tools for gamers worldwide.',
  alternates: {
    canonical: 'https://www.gamepadtest.tech/about',
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gamepad2 className="h-10 w-10 text-primary animate-bounce-in" />
            <h1 className="text-4xl font-bold animate-fade-in-right animate-stagger-1">About GamepadTest</h1>
          </div>
          <p className="text-xl text-muted-foreground animate-fade-in-up animate-stagger-2">
            Empowering gamers worldwide with professional hardware testing tools
          </p>
        </div>

        <Card className="mb-12 animate-fade-in-up animate-stagger-3">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              Our Story
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              GamepadTest was born from a simple yet frustrating experience that every gamer knows all too well. Picture this: you&apos;re in the middle of an intense gaming session when suddenly your controller starts acting up. Is it broken? Is it the game? You spend hours troubleshooting, only to discover everything was working perfectly fine. That moment of frustration sparked the creation of GamepadTest.
            </p>
            
            <p className="text-lg leading-relaxed mb-6">
              We believe gaming should be about the thrill of victory, the joy of exploration, and the satisfaction of mastering new challenges – not wrestling with faulty equipment or wondering if your hardware is letting you down. That&apos;s why we created GamepadTest as a completely free, browser-based solution that gives you instant, reliable answers about your gaming hardware.
            </p>
            
            <p className="text-lg leading-relaxed">
              Today, millions of gamers worldwide trust GamepadTest to verify their equipment before important matches, troubleshoot issues quickly, and ensure their gear performs at peak capacity. From casual players checking their weekend setup to professional esports athletes validating tournament equipment, we&apos;re proud to serve the global gaming community with tools that are fast, accurate, and always free.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="animate-fade-in-left animate-stagger-4 hover-scale">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-gray-700" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                Instant results with no downloads, installations, or complicated setup. Just connect and test.
              </p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up animate-stagger-4 hover-scale">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-gray-700" />
              </div>
              <CardTitle>Privacy First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                Your data stays on your device. We never collect, store, or share your personal information.
              </p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-right animate-stagger-4 hover-scale">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-gray-700" />
              </div>
              <CardTitle>Community Driven</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                Built by gamers, for gamers. Every feature request and improvement comes from our community.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="animate-fade-in-up animate-stagger-4 hover-glow">
          <CardHeader>
            <CardTitle className="text-center text-2xl flex items-center justify-center gap-2">
              <Award className="h-6 w-6 text-yellow-500" />
              Trusted Worldwide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">2M+</div>
                <p className="text-muted-foreground">Monthly Tests</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">150+</div>
                <p className="text-muted-foreground">Countries Served</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                <p className="text-muted-foreground">Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

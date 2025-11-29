import type { Metadata } from 'next';
import { Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'GamepadTest privacy policy - Learn how we protect your data and respect your privacy.',
  alternates: {
    canonical: 'https://www.gamepadtest.tech/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-10 w-10 text-primary animate-bounce-in" />
            <h1 className="text-4xl font-bold animate-fade-in-right animate-stagger-1">Privacy Policy</h1>
          </div>
          <p className="text-xl text-muted-foreground animate-fade-in-up animate-stagger-2">
            Your privacy is our priority
          </p>
        </div>

        <Card className="mb-8 animate-fade-in-up animate-stagger-3">
          <CardHeader>
            <CardTitle>Our Commitment to Privacy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none space-y-6">
            <p>
              At GamepadTest, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.
            </p>

            <h3 className="text-xl font-semibold mt-6">Information We Collect</h3>
            <p>
              GamepadTest operates primarily as a client-side application. This means:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>No Personal Data Collection:</strong> We do not collect, store, or transmit any personal information about you.</li>
              <li><strong>Hardware Data Stays Local:</strong> All gamepad, GPU, microphone, and MIDI data is processed locally in your browser and never sent to our servers.</li>
              <li><strong>No Account Required:</strong> You can use all our testing tools without creating an account or providing any personal information.</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6">Cookies and Analytics</h3>
            <p>
              We may use cookies and similar technologies for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Remembering your preferences (such as theme settings)</li>
              <li>Anonymous usage analytics to improve our service</li>
              <li>Essential website functionality</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6">Third-Party Services</h3>
            <p>
              Our website may contain links to third-party websites or services. We are not responsible for the privacy practices of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
            </p>

            <h3 className="text-xl font-semibold mt-6">Data Security</h3>
            <p>
              Since we don&apos;t collect personal data, there&apos;s minimal risk of data breaches affecting your personal information. All testing happens locally in your browser using standard web APIs.
            </p>

            <h3 className="text-xl font-semibold mt-6">Children&apos;s Privacy</h3>
            <p>
              Our services are available to users of all ages. Since we don&apos;t collect personal information, there are no special considerations for children&apos;s data.
            </p>

            <h3 className="text-xl font-semibold mt-6">Changes to This Policy</h3>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
            </p>

            <h3 className="text-xl font-semibold mt-6">Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@gamepadtest.tech.
            </p>

            <p className="text-sm text-muted-foreground mt-8">
              Last updated: January 2025
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

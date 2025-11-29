"use client";

import Link from "next/link";
import {
  Gamepad2,
  Monitor,
  Mic,
  Music,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";

const faqs = [
  {
    question: "How does the gamepad tester work?",
    answer:
      "Our gamepad tester uses the Gamepad API to detect connected controllers and display real-time input data including button presses, joystick movements, and trigger values.",
  },
  {
    question: "Is my data safe when using these testers?",
    answer:
      "Yes! All testing happens locally in your browser. We never collect, store, or transmit any of your device data or personal information.",
  },
  {
    question: "Which browsers are supported?",
    answer:
      "Our testers work on all modern browsers including Chrome, Firefox, Safari, and Edge. Some features may require specific browser permissions.",
  },
];

export function HomeContent() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
              <span className="text-gray-700">GamepadTest</span> – Free Online Hardware Tester
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 text-muted-foreground">
              GamepadTest lets you test controllers, GPU, mic, and MIDI online.
              Find stick drift, verify inputs, run benchmarks, and fix issues —
              free, no download required.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto gap-2">
                <Link href="/gamepad-tester">
                  Start Testing
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-8 sm:mb-12">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl mb-3">
              Choose Your Testing Tool
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Professional hardware testing tools for all your gaming and audio equipment
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto">
            <Link
              href="/gamepad-tester"
              className="group relative bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-400 rounded-xl p-4 sm:p-6 transition-all duration-200 hover:shadow-lg"
            >
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className="p-2 sm:p-3 bg-gray-100 rounded-lg group-hover:scale-105 transition-transform">
                  <Gamepad2 className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700" />
                </div>
                <h3 className="font-semibold text-sm sm:text-lg text-gray-900">
                  Gamepad Tester
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed hidden sm:block">
                  Test controllers with real-time input detection and vibration feedback
                </p>
              </div>
            </Link>

            <Link
              href="/gpu-tester"
              className="group relative bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-400 rounded-xl p-4 sm:p-6 transition-all duration-200 hover:shadow-lg"
            >
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className="p-2 sm:p-3 bg-gray-100 rounded-lg group-hover:scale-105 transition-transform">
                  <Monitor className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
                </div>
                <h3 className="font-semibold text-sm sm:text-lg text-gray-900">
                  GPU Tester
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed hidden sm:block">
                  Analyze graphics card performance with WebGL rendering tests
                </p>
              </div>
            </Link>

            <Link
              href="/mic-tester"
              className="group relative bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-400 rounded-xl p-4 sm:p-6 transition-all duration-200 hover:shadow-lg"
            >
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className="p-2 sm:p-3 bg-gray-100 rounded-lg group-hover:scale-105 transition-transform">
                  <Mic className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
                </div>
                <h3 className="font-semibold text-sm sm:text-lg text-gray-900">
                  Mic Tester
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed hidden sm:block">
                  Test microphone input with real-time audio visualization
                </p>
              </div>
            </Link>

            <Link
              href="/midi-tester"
              className="group relative bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-400 rounded-xl p-4 sm:p-6 transition-all duration-200 hover:shadow-lg"
            >
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className="p-2 sm:p-3 bg-gray-100 rounded-lg group-hover:scale-105 transition-transform">
                  <Music className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
                </div>
                <h3 className="font-semibold text-sm sm:text-lg text-gray-900">
                  MIDI Tester
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed hidden sm:block">
                  Test MIDI devices with real-time signal detection
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                GamepadTest – Free Online Hardware Testing Tools
              </h2>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 text-muted-foreground">
                Technology is the core of how we play, work, and create. From
                gaming sessions to professional streaming, music production, or graphic-heavy projects.
              </p>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div className="bg-white rounded-lg p-4 sm:p-8 shadow-sm">
                <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                  Controllers develop stick drift, graphics cards overheat, microphones cut out, and
                  MIDI keyboards lose sensitivity. That&apos;s why we created GamepadTest — an all-in-one
                  hub for free online testing tools. No downloads or installations needed.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="rounded-lg border bg-white p-4 sm:p-6 shadow-sm">
                  <h3 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-foreground">
                    <Shield className="h-5 w-5 text-primary" />
                    Why Online Testing Matters
                  </h3>
                  <p className="mt-3 text-sm sm:text-base text-muted-foreground">
                    Our lightweight, browser-based testers work instantly. Run a gamepad tester in
                    seconds to spot unresponsive buttons or drifting joysticks.
                  </p>
                </div>

                <div className="rounded-lg border bg-white p-4 sm:p-6 shadow-sm">
                  <h3 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-foreground">
                    <Zap className="h-5 w-5 text-primary" />
                    Free and Accessible
                  </h3>
                  <p className="mt-3 text-sm sm:text-base text-muted-foreground">
                    Completely free for casual gamers, professional musicians, or competitive players.
                    Everything runs in your browser with no software installed.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 sm:p-8">
                <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-center text-foreground">
                  Our Testing Tools
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                  <div className="text-center p-3 sm:p-6 bg-white rounded-lg">
                    <Gamepad2 className="h-8 w-8 sm:h-12 sm:w-12 text-blue-500 mx-auto mb-2 sm:mb-4" />
                    <h4 className="font-semibold text-foreground text-sm sm:text-base mb-1 sm:mb-2">
                      Gamepad Tester
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                      Check controllers for stick drift, button response, and connection issues.
                    </p>
                  </div>
                  <div className="text-center p-3 sm:p-6 bg-white rounded-lg">
                    <Monitor className="h-8 w-8 sm:h-12 sm:w-12 text-green-500 mx-auto mb-2 sm:mb-4" />
                    <h4 className="font-semibold text-foreground text-sm sm:text-base mb-1 sm:mb-2">
                      GPU Tester
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                      Measure graphics card performance and detect stability issues.
                    </p>
                  </div>
                  <div className="text-center p-3 sm:p-6 bg-white rounded-lg">
                    <Mic className="h-8 w-8 sm:h-12 sm:w-12 text-purple-500 mx-auto mb-2 sm:mb-4" />
                    <h4 className="font-semibold text-foreground text-sm sm:text-base mb-1 sm:mb-2">
                      Mic Tester
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                      Test microphone quality and detect static or distortion.
                    </p>
                  </div>
                  <div className="text-center p-3 sm:p-6 bg-white rounded-lg">
                    <Music className="h-8 w-8 sm:h-12 sm:w-12 text-orange-500 mx-auto mb-2 sm:mb-4" />
                    <h4 className="font-semibold text-foreground text-sm sm:text-base mb-1 sm:mb-2">
                      MIDI Tester
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                      Verify keyboards, pads, and controllers for note data.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 sm:p-8">
                <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-center text-foreground">
                  Gamepad Tester – Check Controllers Instantly
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 text-sm sm:text-base">
                      What You Can Test:
                    </h4>
                    <div className="space-y-2">
                      {[
                        "Joystick drift and dead zones",
                        "Button response times",
                        "Trigger sensitivity",
                        "D-pad accuracy",
                        "Vibration motors",
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm sm:text-base">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 text-sm sm:text-base">
                      Supported Controllers:
                    </h4>
                    <div className="space-y-2">
                      {[
                        "PlayStation DualShock/DualSense",
                        "Xbox One, Series X|S",
                        "Nintendo Switch Pro",
                        "PC gamepads & third-party",
                        "Bluetooth and USB",
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm sm:text-base">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-8 sm:mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 sm:space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-lg border p-4 sm:p-6">
                <h3 className="font-semibold text-sm sm:text-lg mb-2">{faq.question}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

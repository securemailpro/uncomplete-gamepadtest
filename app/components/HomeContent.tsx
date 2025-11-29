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
  Globe,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  useScrollAnimation,
  useStaggeredScrollAnimation,
} from "@/app/hooks/useScrollAnimation";

const testers = [
  {
    name: "Gamepad Tester",
    description:
      "Test your gaming controllers with real-time input detection, button mapping, and vibration feedback.",
    icon: Gamepad2,
    href: "/gamepad-tester",
    features: ["Real-time input", "Vibration test", "Button mapping"],
    color: "bg-blue-500",
  },
  {
    name: "GPU Tester",
    description:
      "Analyze your graphics card performance with WebGL rendering tests and hardware information.",
    icon: Monitor,
    href: "/gpu-tester",
    features: ["WebGL benchmarks", "Hardware info", "Performance metrics"],
    color: "bg-green-500",
  },
  {
    name: "Microphone Tester",
    description:
      "Test your microphone input with real-time audio visualization and quality analysis.",
    icon: Mic,
    href: "/mic-tester",
    features: ["Audio visualization", "Input levels", "Quality analysis"],
    color: "bg-red-500",
  },
  {
    name: "MIDI Tester",
    description:
      "Test MIDI devices and keyboards with real-time signal detection and note visualization.",
    icon: Music,
    href: "/midi-tester",
    features: ["Device detection", "Note visualization", "Signal monitoring"],
    color: "bg-purple-500",
  },
];

const features = [
  {
    name: "Lightning Fast",
    description:
      "Optimized for speed with instant loading and real-time feedback.",
    icon: Zap,
  },
  {
    name: "Privacy First",
    description:
      "All testing happens locally in your browser. No data is sent to our servers.",
    icon: Shield,
  },
  {
    name: "Cross-Platform",
    description:
      "Works on all modern browsers and devices - desktop, mobile, and tablet.",
    icon: Globe,
  },
];

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
  const toolsAnimation = useScrollAnimation({ threshold: 0.2 });
  const { containerRef: toolsContainerRef, visibleItems: toolsVisible } =
    useStaggeredScrollAnimation(4, { threshold: 0.2 });
  const featuresAnimation = useScrollAnimation({ threshold: 0.2 });
  const faqAnimation = useScrollAnimation({ threshold: 0.2 });

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 sm:py-32">
        <div className="absolute inset-0 overflow-hidden hidden sm:block">
          <div className="animate-pulse-glow absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div
            className="animate-pulse-glow absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl animate-fade-in-down">
              <span className="text-gray-700 animate-scale-in">
                GamepadTest
              </span>{" "}
              – Free Online Hardware Tester
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground animate-fade-in-up animate-stagger-1">
              GamepadTest lets you test controllers, GPU, mic, and MIDI online.
              Find stick drift, verify inputs, run benchmarks, and fix issues —
              free, no download. required.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 animate-fade-in-up animate-stagger-2">
              <Button asChild size="lg" className="gap-2 hover-lift hover-glow">
                <Link href="/gamepad-tester">
                  Start Testing
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="hover-scale"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24" ref={toolsAnimation.ref}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div
            className={`mx-auto max-w-2xl text-center mb-12 transition-all duration-700 ${
              toolsAnimation.isVisible
                ? "animate-fade-in-up"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-4">
              Choose Your Testing Tool
            </h2>
            <p className="text-lg text-muted-foreground">
              Professional hardware testing tools for all your gaming and audio
              equipment
            </p>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto"
            ref={toolsContainerRef}
          >
            <Link
              href="/gamepad-tester"
              className={`group relative bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-400 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover-lift hover-glow ${
                toolsVisible[0]
                  ? "animate-fade-in-up"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-gray-100 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Gamepad2 className="h-8 w-8 text-gray-700" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                  Gamepad Tester
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Test controllers with real-time input detection and vibration
                  feedback
                </p>
              </div>
            </Link>

            <Link
              href="/gpu-tester"
              className={`group relative bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-400 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover-lift hover-glow ${
                toolsVisible[1]
                  ? "animate-fade-in-up animate-stagger-1"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-gray-100 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Monitor className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                  GPU Tester
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Analyze graphics card performance with WebGL rendering tests
                </p>
              </div>
            </Link>

            <Link
              href="/mic-tester"
              className={`group relative bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-400 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover-lift hover-glow ${
                toolsVisible[2]
                  ? "animate-fade-in-up animate-stagger-2"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-gray-100 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Mic className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                  Mic Tester
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Test microphone input with real-time audio visualization
                </p>
              </div>
            </Link>

            <Link
              href="/midi-tester"
              className={`group relative bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-400 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover-lift hover-glow ${
                toolsVisible[3]
                  ? "animate-fade-in-up animate-stagger-3"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-gray-100 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Music className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                  MIDI Tester
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Test MIDI devices with real-time signal detection and
                  visualization
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section
        className="py-20 sm:py-32 bg-muted/50"
        ref={featuresAnimation.ref}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl animate-fade-in-up">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
                GamepadTest – Free Online Hardware Testing Tools
              </h2>
              <p className="mt-6 text-xl leading-8 text-muted-foreground">
                Technology is the core of how we play, work, and create. From
                gaming sessions with friends to professional streaming, music
                production, or graphic-heavy projects, the performance of your
                hardware can make or break your experience.
              </p>
            </div>

            <div className="prose prose-lg max-w-none text-muted-foreground space-y-8">
              <div className="bg-white rounded-lg p-8 shadow-sm hover-lift transition-all duration-300 animate-fade-in-up animate-stagger-1">
                <p className="text-lg leading-relaxed">
                  But like anything else, devices wear out. Controllers develop
                  stick drift, graphics cards overheat, microphones cut out, and
                  MIDI keyboards lose sensitivity. That&apos;s why we created
                  GamepadTest — an all-in-one hub for free online testing tools.
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  With no downloads or installations, you can check your game
                  controllers, GPUs, microphones, and MIDI devices instantly
                  inside your web browser. We&apos;ve built each tester to be fast,
                  simple, and accurate so you can catch problems before they
                  ruin your gaming session, work presentation, or recording.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up animate-stagger-2">
                <section className="hover-lift rounded-lg border bg-white p-6 shadow-sm">
                  <h3 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                    <Shield className="h-6 w-6 text-primary" />
                    Why Online Testing Matters
                  </h3>
                  <div className="mt-4 space-y-4 text-muted-foreground">
                    <p>
                      Most diagnostic software is heavy, complicated, or tied to
                      a single brand. Our tools take a different approach:
                      lightweight, browser-based testers that anyone can use. No
                      technical knowledge required.
                    </p>
                    <p>
                      Using our testers means you can run a gamepad tester in
                      seconds to spot unresponsive buttons or drifting
                      joysticks, perform a GPU tester benchmark to confirm
                      stability, use a mic tester to ensure your audio is crisp,
                      and verify your MIDI controllers respond correctly.
                    </p>
                  </div>
                </section>

                <section className="hover-lift rounded-lg border bg-white p-6 shadow-sm">
                  <h3 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                    <Zap className="h-6 w-6 text-primary" />
                    Free and Accessible
                  </h3>
                  <div className="mt-4 space-y-4 text-muted-foreground">
                    <p>
                      Best of all, it&apos;s completely free. Whether you&apos;re a casual
                      gamer, professional musician, or competitive player, our
                      tools are available anytime, anywhere.
                    </p>
                    <p>
                      The tool is also safe to use. It does not collect personal
                      information or install extra software. Everything runs
                      inside your browser and disappears once you close the
                      page.
                    </p>
                  </div>
                </section>
              </div>

              <div className="bg-gray-50 rounded-lg p-8 animate-fade-in-up animate-stagger-3">
                <h3 className="text-2xl font-bold mb-6 text-center text-foreground">
                  Our Testing Tools
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-6 bg-white rounded-lg hover-scale transition-all duration-300">
                    <Gamepad2 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h4 className="font-semibold text-foreground mb-2">
                      Gamepad Tester
                    </h4>
                    <p className="text-sm">
                      Check controllers for stick drift, button response, and
                      connection issues. Supports PlayStation, Xbox, and PC
                      gamepads.
                    </p>
                  </div>
                  <div className="text-center p-6 bg-white rounded-lg hover-scale transition-all duration-300">
                    <Monitor className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h4 className="font-semibold text-foreground mb-2">
                      GPU Tester
                    </h4>
                    <p className="text-sm">
                      Measure graphics card performance, check temperatures, and
                      detect stability issues with real-time monitoring.
                    </p>
                  </div>
                  <div className="text-center p-6 bg-white rounded-lg hover-scale transition-all duration-300">
                    <Mic className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                    <h4 className="font-semibold text-foreground mb-2">
                      Mic Tester
                    </h4>
                    <p className="text-sm">
                      Test microphone quality, detect static or distortion, and
                      ensure your audio is clear for calls and recordings.
                    </p>
                  </div>
                  <div className="text-center p-6 bg-white rounded-lg hover-scale transition-all duration-300">
                    <Music className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                    <h4 className="font-semibold text-foreground mb-2">
                      MIDI Tester
                    </h4>
                    <p className="text-sm">
                      Verify keyboard, pads, and controllers for correct note
                      data, velocity sensitivity, and connection issues.
                    </p>
                  </div>
                </div>
              </div>

              <div className="animate-fade-in-up animate-stagger-4">
                <h3 className="text-2xl font-bold mb-8 text-center text-foreground">
                  Comprehensive Testing Solutions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      title: "Gamepad Testing",
                      desc: "Detect stick drift, verify button response, test trigger sensitivity, and check for connection lag.",
                      icon: Gamepad2,
                    },
                    {
                      title: "GPU Performance",
                      desc: "Real-time FPS monitoring, temperature tracking, stress testing, and performance dip detection.",
                      icon: Monitor,
                    },
                    {
                      title: "Audio Quality",
                      desc: "Live microphone input testing, static detection, volume level confirmation, and clarity assessment.",
                      icon: Mic,
                    },
                    {
                      title: "MIDI Verification",
                      desc: "Key and pad testing, velocity sensitivity checks, knob and fader validation, DAW connectivity.",
                      icon: Music,
                    },
                  ].map((feature) => (
                    <div
                      key={feature.title}
                      className="hover-lift rounded-lg border bg-white p-6"
                    >
                      <feature.icon className="h-8 w-8 text-primary mb-4" />
                      <h4 className="font-semibold text-foreground mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-sm">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-6 text-center text-foreground">
                  Gamepad Tester – Check Controllers Instantly
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-foreground mb-4">
                      What You Can Test:
                    </h4>
                    <div className="space-y-3">
                      {[
                        "Joystick drift and dead zones",
                        "Button response times",
                        "Trigger sensitivity",
                        "D-pad accuracy",
                        "Vibration motors",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-4">
                      Supported Controllers:
                    </h4>
                    <div className="space-y-3">
                      {[
                        "PlayStation 4 & 5 DualShock/DualSense",
                        "Xbox One, Series X|S controllers",
                        "Nintendo Switch Pro Controller",
                        "PC gamepads & third-party controllers",
                        "Bluetooth and USB connections",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <span>{item}</span>
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

      <section className="py-16 sm:py-24" ref={faqAnimation.ref}>
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-lg border p-6 hover-lift">
                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

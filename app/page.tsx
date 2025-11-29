import type { Metadata } from 'next';
import { HomeContent } from './components/HomeContent';

export const metadata: Metadata = {
  title: 'GamepadTest | Free Online Hardware Tester',
  description: 'GamepadTest lets you instantly test game controllers, GPU, microphones, and MIDI devices online. Free, browser-based diagnostics to ensure optimal hardware.',
  keywords: 'GamepadTest, Gamepad Tester, Mic Tester, GPU Tester, MIDI Tester',
  alternates: {
    canonical: 'https://www.gamepadtest.tech/',
  },
  openGraph: {
    title: 'GamepadTest | Free Online Hardware Tester',
    description: 'GamepadTest lets you instantly test game controllers, GPU, microphones, and MIDI devices online. Free, browser-based diagnostics to ensure optimal hardware.',
    url: 'https://www.gamepadtest.tech/',
  },
};

export default function HomePage() {
  return <HomeContent />;
}

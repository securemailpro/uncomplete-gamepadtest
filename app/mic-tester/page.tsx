import type { Metadata } from 'next';
import { MicTesterClient } from './MicTesterClient';

export const metadata: Metadata = {
  title: 'Mic Tester | Free Online Microphone Test',
  description: 'Test your microphone online with our free mic tester. Check audio input levels, visualize sound waves, and verify your mic is working properly. No software installation needed.',
  keywords: 'mic tester, microphone test, audio test, sound test, mic check, microphone online test, audio input test',
  alternates: {
    canonical: 'https://www.gamepadtest.tech/mic-tester',
  },
  openGraph: {
    title: 'Mic Tester | Free Online Microphone Test',
    description: 'Test your microphone online with our free mic tester. Check audio input levels, visualize sound waves, and verify your mic is working properly.',
    url: 'https://www.gamepadtest.tech/mic-tester',
  },
};

export default function MicTesterPage() {
  return <MicTesterClient />;
}

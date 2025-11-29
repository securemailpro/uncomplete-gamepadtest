import type { Metadata } from 'next';
import { MIDITesterClient } from './MIDITesterClient';

export const metadata: Metadata = {
  title: 'MIDI Tester | Free Online MIDI Device Test',
  description: 'Test your MIDI devices online with our free MIDI tester. Check keyboard inputs, pad sensitivity, and control signals. Works with all standard MIDI controllers.',
  keywords: 'MIDI tester, MIDI keyboard test, MIDI controller test, MIDI input test, music equipment test, MIDI device checker',
  alternates: {
    canonical: 'https://www.gamepadtest.tech/midi-tester',
  },
  openGraph: {
    title: 'MIDI Tester | Free Online MIDI Device Test',
    description: 'Test your MIDI devices online with our free MIDI tester. Check keyboard inputs, pad sensitivity, and control signals.',
    url: 'https://www.gamepadtest.tech/midi-tester',
  },
};

export default function MIDITesterPage() {
  return <MIDITesterClient />;
}

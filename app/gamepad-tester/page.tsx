import type { Metadata } from 'next';
import { GamepadTesterClient } from './GamepadTesterClient';

export const metadata: Metadata = {
  title: 'Gamepad Tester | Free Online Controller Test',
  description: 'Test your gaming controllers with our free online gamepad tester. Check for stick drift, button response, trigger sensitivity, and vibration. Works with PlayStation, Xbox, Nintendo, and PC controllers.',
  keywords: 'gamepad tester, controller test, stick drift test, gamepad online, PS5 controller test, Xbox controller test, button test, trigger test',
  alternates: {
    canonical: 'https://www.gamepadtest.tech/gamepad-tester',
  },
  openGraph: {
    title: 'Gamepad Tester | Free Online Controller Test',
    description: 'Test your gaming controllers with our free online gamepad tester. Check for stick drift, button response, trigger sensitivity, and vibration.',
    url: 'https://www.gamepadtest.tech/gamepad-tester',
  },
};

export default function GamepadTesterPage() {
  return <GamepadTesterClient />;
}

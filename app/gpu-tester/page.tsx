import type { Metadata } from 'next';
import { GPUTesterClient } from './GPUTesterClient';

export const metadata: Metadata = {
  title: 'GPU Tester | Free Online Graphics Card Test',
  description: 'Test your graphics card performance with our free online GPU tester. Check WebGL capabilities, rendering performance, and hardware information. Works on any device with a browser.',
  keywords: 'GPU tester, graphics card test, WebGL benchmark, GPU performance, video card test, GPU info, graphics benchmark',
  alternates: {
    canonical: 'https://www.gamepadtest.tech/gpu-tester',
  },
  openGraph: {
    title: 'GPU Tester | Free Online Graphics Card Test',
    description: 'Test your graphics card performance with our free online GPU tester. Check WebGL capabilities, rendering performance, and hardware information.',
    url: 'https://www.gamepadtest.tech/gpu-tester',
  },
};

export default function GPUTesterPage() {
  return <GPUTesterClient />;
}

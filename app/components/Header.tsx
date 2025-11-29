import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';
import { MobileMenuButton } from './MobileMenu';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Gamepad Tester', href: '/gamepad-tester' },
  { name: 'GPU Tester', href: '/gpu-tester' },
  { name: 'Mic Tester', href: '/mic-tester' },
  { name: 'MIDI Tester', href: '/midi-tester' },
  { name: 'About', href: '/about' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Blog', href: '/blog' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-[60] w-full border-b bg-background">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2 group" prefetch={true}>
            <Gamepad2 className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
            <span className="text-xl font-bold text-gradient transition-all duration-300 group-hover:tracking-wide">GamepadTest</span>
          </Link>
        </div>
        
        <MobileMenuButton />
        
        <ul className="hidden lg:flex lg:items-center lg:gap-x-4">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                prefetch={true}
                className="text-sm font-medium transition-all duration-300 hover:text-primary relative px-3 py-2 rounded-md hover-scale group text-muted-foreground hover:text-foreground"
              >
                <span className="relative z-10">{item.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-md scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
        </div>
      </nav>
    </header>
  );
}

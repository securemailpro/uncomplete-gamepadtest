"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Gamepad2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/lib/utils';

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

export function MobileMenuButton() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (mobileMenuOpen) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
    }
    return () => { document.documentElement.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <>
      <div className="flex lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(true)}
          className="-m-2.5 p-2.5"
          aria-label="Open main menu"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 z-30 bg-black/40" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
                <Gamepad2 className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-gradient">GamepadTest</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 p-2.5"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </Button>
            </div>
            <div className="mt-6 flow-root">
              <nav className="-my-6 divide-y divide-border">
                <ul className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-accent",
                          pathname === item.href
                            ? "text-primary bg-primary/10"
                            : "text-foreground"
                        )}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

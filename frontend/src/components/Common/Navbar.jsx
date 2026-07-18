import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Button from './Button';
import { useContent } from '../../context/ContentContext';

const BASE_NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll, { passive: true });
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const { company } = useContent();
  const pricingVisible = company.pricingVisible !== false;
  const navLinks = BASE_NAV_LINKS.filter((link) => pricingVisible || link.to !== '/pricing');

  const linkClass = ({ isActive }) =>
    `relative inline-flex items-center justify-center rounded-full px-4 py-2.5 text-center text-base font-semibold tracking-wide transition-all duration-300 ${
      isActive ? 'text-white' : 'text-white/75 hover:text-white'
    }`;

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-2 md:gap-0">
        <div className="flex items-center justify-between rounded-full border border-white/10 bg-slate-950/70 px-3 py-2.5 shadow-[0_12px_30px_rgba(2,6,23,0.18)] backdrop-blur-2xl md:hidden">
          <Link to="/" className="group shrink-0" aria-label="iFeX International home">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 shadow-[0_18px_35px_rgba(6,182,212,0.14)] backdrop-blur-2xl transition-transform duration-200 group-hover:scale-105">
              <img
                src="/logo.png"
                alt="iFeX International logo"
                className="h-7 w-7 object-contain"
              />
            </span>
          </Link>

          <span className="flex-1 text-center text-sm font-semibold uppercase tracking-[0.35em] text-white/90">
            IFEX INTERNATIONAL
          </span>

          <button
            className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 shadow-[0_18px_35px_rgba(6,182,212,0.14)] backdrop-blur-2xl transition-transform duration-200 hover:scale-105"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
          </button>
        </div>

        <div className="mx-auto hidden h-14 max-w-4xl items-center justify-between gap-3 sm:h-16 md:flex">
          <Link to="/" className="group shrink-0" aria-label="iFeX International home">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 shadow-[0_18px_35px_rgba(6,182,212,0.14)] backdrop-blur-2xl transition-transform duration-200 group-hover:scale-105 sm:h-16 sm:w-16">
              <img
                src="/logo.png"
                alt="iFeX International logo"
                className="h-8 w-8 object-contain sm:h-10 sm:w-10"
              />
            </span>
          </Link>

          <nav
            className={`liquid-glass-navbar flex h-14 flex-1 items-center justify-between rounded-full px-3 transition-all duration-200 sm:h-16 sm:px-6 ${
              scrolled ? 'shadow-[0_18px_45px_rgba(2,6,23,0.35)]' : 'shadow-[0_14px_35px_rgba(2,6,23,0.25)]'
            }`}
          >
            <div className="hidden flex-1 items-center justify-center md:flex">
              <ul className="flex items-center justify-center gap-2">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink to={link.to} className={linkClass}>
                      {({ isActive }) => (
                        <span className="relative pb-1">
                          {link.label}
                          {isActive && (
                            <motion.span
                              layoutId="nav-underline"
                              className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-electric to-cyan"
                              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                            />
                          )}
                        </span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <div className="hidden md:block">
                <Button Component={Link} to="/contact" className="px-4 py-2 text-sm sm:px-5 sm:py-2.5">
                  Get in Touch
                </Button>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.97 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="fixed inset-x-3 top-[5.6rem] z-50 mx-auto max-w-[calc(100%-1.5rem)] rounded-[2rem] border border-white/15 bg-gray-900 px-3 py-3 shadow-[0_24px_60px_rgba(2,6,23,0.35)] md:hidden"
        >
          <ul className="section-container flex flex-col gap-1 py-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-full px-4 py-3 text-base font-medium transition-all duration-200 ${
                      isActive ? 'bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]' : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li className="pt-2">
              <Button Component={Link} to="/contact" onClick={() => setMobileOpen(false)} className="w-full rounded-full">
                Get in Touch
              </Button>
            </li>
          </ul>
        </motion.div>
      )}
    </header>
  );
}

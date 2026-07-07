/**
 * The canonical destination set — the single source of truth for every nav
 * surface (global Header, the film Menu sheet, the film end-card footer), so
 * the three surfaces can never desync again (copy deck §4.1/§4.2).
 * Order and casing are law: Marketplace sits before Stories.
 */
export type NavItem = { label: string; href: string };

export const NAV: NavItem[] = [
  { label: 'The Drives', href: '/drives' },
  { label: 'The Tour', href: '/tour' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Stories', href: '/blog' },
  { label: 'Sponsor', href: '/sponsor' },
];

import type { ImageMetadata } from 'astro';

import cellaSvg from '@/assets/brands/cella.svg?raw';
import fastapiSvg from '@/assets/brands/fastapi.svg?raw';
import kindeSvg from '@/assets/brands/kinde.svg?raw';
import opencodeSvg from '@/assets/brands/opencode.svg?raw';
import openstatusSvg from '@/assets/brands/openstatus.svg?raw';
import photonSvg from '@/assets/brands/photon.svg?raw';
import scalarSvg from '@/assets/brands/scalar.svg?raw';
import stainlessPng from '@/assets/brands/stainless.png';
import stainlessSvg from '@/assets/brands/stainless.svg?raw';
import unblockedSvg from '@/assets/brands/unblocked.svg?raw';
import vercelSvg from '@/assets/brands/vercel.svg?raw';

export type SponsorTier = 'gold' | 'silver' | 'bronze' | 'friends' | 'platinum';

export type SponsorLogo =
  | { dark?: string; src: string; type: 'svg' }
  | { alt: string; dark?: string; img: ImageMetadata; src: string; type: 'svg+img' }
  | { alt: string; dark?: ImageMetadata; src: ImageMetadata; type: 'img' };

export interface Sponsor {
  class?: string;
  displayUrl: string;
  logo: SponsorLogo;
  name: string;
  past?: boolean;
  tagline?: string;
  tier: SponsorTier;
  url: string;
}

export const sponsors: Array<Sponsor> = [
  {
    displayUrl: 'stainless.com',
    logo: {
      alt: 'Stainless logo',
      img: stainlessPng,
      src: stainlessSvg,
      type: 'svg+img',
    },
    name: 'Stainless',
    past: true,
    tagline: 'Best-in-class interfaces for developers and agents.',
    tier: 'gold',
    url: 'https://kutt.to/pkEZyc',
  },
  {
    displayUrl: 'opencode.ai',
    logo: {
      src: opencodeSvg,
      type: 'svg',
    },
    name: 'opencode',
    tagline: 'The open source AI coding agent.',
    tier: 'gold',
    url: 'https://kutt.to/QM9Q2N',
  },
  {
    class: 'scalar',
    displayUrl: 'scalar.com',
    logo: {
      src: scalarSvg,
      type: 'svg',
    },
    name: 'Scalar',
    past: true,
    tier: 'silver',
    url: 'https://kutt.to/skQUVd',
  },
  {
    class: 'fastapi',
    displayUrl: 'fastapi.tiangolo.com',
    logo: {
      src: fastapiSvg,
      type: 'svg',
    },
    name: 'FastAPI',
    tier: 'silver',
    url: 'https://kutt.to/Dr9GuW',
  },
  {
    class: 'unblocked',
    displayUrl: 'getunblocked.com',
    logo: {
      src: unblockedSvg,
      type: 'svg',
    },
    name: 'Unblocked',
    tier: 'silver',
    url: 'https://kutt.to/yZVkdV',
  },
  {
    displayUrl: 'kinde.com',
    logo: {
      src: kindeSvg,
      type: 'svg',
    },
    name: 'Kinde',
    tier: 'bronze',
    url: 'https://kutt.to/YpaKsX',
  },
  {
    class: 'cella',
    displayUrl: 'cella.so',
    logo: {
      src: cellaSvg,
      type: 'svg',
    },
    name: 'Cella',
    past: true,
    tier: 'bronze',
    url: 'https://kutt.to/KkqSaw',
  },
  {
    class: 'photon',
    displayUrl: 'photon.codes',
    logo: {
      src: photonSvg,
      type: 'svg',
    },
    name: 'Photon',
    tier: 'bronze',
    url: 'https://kutt.to/HW4GYR',
  },
  {
    class: 'openstatus',
    displayUrl: 'openstatus.dev',
    logo: {
      src: openstatusSvg,
      type: 'svg',
    },
    name: 'OpenStatus',
    tier: 'friends',
    url: 'https://kutt.to/R6UuKW',
  },
  {
    displayUrl: 'vercel.com',
    logo: {
      src: vercelSvg,
      type: 'svg',
    },
    name: 'Vercel',
    tier: 'friends',
    url: 'https://kutt.to/bcUF8q',
  },
];

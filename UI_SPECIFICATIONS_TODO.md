# Top Modern UI Design Specifications - Complete Rebuild Guide

## Overview
This document contains the exact UI specifications for rebuilding the Top Modern luxury marble and granite website. All details including colors, typography, animations, hover effects, backgrounds, and responsive behavior are documented for pixel-perfect recreation.

## Color Palette (HSL Variables)

### Light Mode
- **Background:** 45 29% 94% (warm off-white)
- **Foreground:** 0 0% 15% (dark charcoal)
- **Card:** 0 0% 100% (pure white)
- **Card Foreground:** 0 0% 15%
- **Popover:** 0 0% 100%
- **Popover Foreground:** 0 0% 15%
- **Primary:** 0 0% 10% (near-black)
- **Primary Foreground:** 45 29% 94%
- **Secondary:** 0 0% 40% (medium gray)
- **Secondary Foreground:** 45 29% 94%
- **Muted:** 0 0% 40%
- **Muted Foreground:** 0 0% 40%
- **Accent:** 45 75% 55% (golden yellow)
- **Accent Foreground:** 0 0% 10%
- **Destructive:** 0 84% 60% (red)
- **Destructive Foreground:** 45 29% 94%
- **Success:** 160 84% 39% (green)
- **Success Foreground:** 45 29% 94%
- **Warning:** 38 92% 50% (orange)
- **Warning Foreground:** 0 0% 10%
- **Border:** 45 18% 85% (light gray)
- **Input:** 45 18% 85%
- **Ring:** 45 65% 58% (gold focus ring)
- **Radius:** 0.25rem (4px)

### Dark Mode
- **Background:** 0 0% 10% (pure black)
- **Foreground:** 0 0% 98% (near-white)
- **Card:** 0 0% 10%
- **Card Foreground:** 0 0% 98%
- **Popover:** 0 0% 10%
- **Popover Foreground:** 0 0% 98%
- **Primary:** 45 29% 94% (warm off-white)
- **Primary Foreground:** 0 0% 10%
- **Secondary:** 0 0% 10%
- **Secondary Foreground:** 0 0% 98%
- **Muted:** 0 0% 10%
- **Muted Foreground:** 0 0% 40%
- **Accent:** 45 75% 55% (golden yellow)
- **Accent Foreground:** 0 0% 10%
- **Destructive:** 0 62% 30% (dark red)
- **Destructive Foreground:** 0 0% 98%
- **Success:** 160 84% 39%
- **Success Foreground:** 0 0% 10%
- **Warning:** 38 92% 50%
- **Warning Foreground:** 0 0% 10%
- **Border:** 0 0% 23% (dark gray)
- **Input:** 0 0% 23%
- **Ring:** 45 65% 58%
- **Sidebar:** 0 0% 10%
- **Sidebar Foreground:** 0 0% 98%
- **Sidebar Primary:** 45 65% 58%
- **Sidebar Primary Foreground:** 0 0% 10%
- **Sidebar Accent:** 0 0% 10%
- **Sidebar Accent Foreground:** 0 0% 98%
- **Sidebar Border:** 0 0% 23%
- **Sidebar Ring:** 45 65% 58%

## Typography

### Fonts
- **Serif:** Lora (Google Font, variable: --font-serif)
- **Sans:** Inter (Google Font, variable: --font-sans)
- **Display:** swap

### Font Sizes (Responsive Scale)
- **h1:** 3rem (48px) - font-bold leading-tight font-serif
- **h2:** 2.25rem (36px) - font-bold leading-tight font-serif
- **h3:** 1.875rem (30px) - font-semibold leading-tight font-serif
- **h4:** 1.5rem (24px) - font-semibold leading-tight font-serif
- **h5:** 1.25rem (20px) - font-medium leading-tight font-serif
- **h6:** 1.125rem (18px) - font-medium leading-tight font-serif
- **Body Large:** 1.125rem (18px) - font-normal leading-1.5
- **Body:** 1rem (16px) - font-normal leading-1.5
- **Body Small:** 0.875rem (14px) - font-normal leading-1.5
- **Caption:** 0.75rem (12px) - font-light leading-1.5

## Layout & Spacing

### Container
- **Max Width:** 7xl (1280px)
- **Padding:** px-4 sm:px-6 lg:px-8
- **Margin:** mx-auto

### Header
- **Height:** h-20 (80px)
- **Sticky:** top-0 z-50
- **Background:** primary (black) with 95% opacity and backdrop-blur
- **Border:** border-b border-border/20
- **Logo Height:** h-16 w-auto
- **Navigation Gap:** gap-8
- **Mobile Menu:** Animated height transition 0.3s

### Hero Section
- **Min Height:** min-h-screen
- **Padding Top:** pt-24
- **Background:** Multiple layers:
  - OGL Prism animation (rotate, timeScale: 0.5, height: 3.5, baseWidth: 5.5, scale: 3.6, hueShift: 0, colorFrequency: 1, noise: 0.5, glow: 1)
  - Background image: /background-kitchen.png (bg-cover bg-center)
  - Gradient overlays: from-black/30 via-black/20 to-black/50 (vertical) + from-black/30 via-transparent to-black/30 (horizontal)

### Footer
- **Background:** bg-black
- **Padding:** py-12
- **Grid:** gap-8 md:grid-cols-2 lg:grid-cols-4
- **Logo Height:** h-16 w-auto
- **Social Icons:** h-5 w-5
- **Border Top:** border-t border-white/10
- **Copyright:** text-white/70

## Animations & Transitions

### Page Load Animations
- **Header:** initial y: -100, animate y: 0, duration: 0.5s
- **Logo:** opacity: 0 to 1, delay: 0.2s
- **Navigation:** staggerChildren: 0.1, delayChildren: 0.2s
- **Hero Content:** opacity: 0 y: 30 to opacity: 1 y: 0, duration: 0.8s, ease: easeInOut, staggered delays (0, 0.2, 0.4, 0.6, 0.8s)

### Hover Effects
- **Navigation Links:** after pseudo-element width: 0 to 100%, duration: 0.5s
- **Buttons:** transform: translateX(4px), duration: 0.3s
- **Cards:** box-shadow increase, duration: 0.3s
- **Stats Icons:** background color change, duration: 0.3s
- **Social Icons:** color change to accent, duration: 0.3s

### Utility Classes
- **Fade In:** opacity: 0 to 1, duration: 0.3s
- **Slide In:** transform: translateY(-10px), opacity: 0 to 0, 1, duration: 0.3s
- **Scale In:** transform: scale(0.95), opacity: 0 to 1, 1, duration: 0.3s
- **Theme Transition:** all 0.4s cubic-bezier(0.4, 0, 0.2, 1)
- **Hover Transition:** all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- **Modal Transition:** all 0.3s cubic-bezier(0.4, 0, 0.2, 1)

### Special Effects
- **Gold Glare:** Linear gradient animation on card headers (left: -150% to 150%, duration: 0.8s)
- **Marble Texture:** background-image: /marble-texture.png, opacity: 0.03, mix-blend-mode: overlay
- **Backdrop Blur:** blur(12px) for luxury cards, blur(20px) for modals

## Component-Specific Details

### Header Navigation
- **Desktop:** Hidden on md:hidden, flex with gap-8
- **Mobile:** Animated menu with height: 0 to auto, opacity transitions
- **Links:** text-white/90, hover:text-accent, relative with underline animation
- **Menu Button:** ghost variant, text-white, hover:bg-white/10 hover:text-accent

### Hero Section Stats
- **Layout:** grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto
- **Icons:** h-10 w-10 text-primary, in bg-primary/10 circles (p-6)
- **Numbers:** text-h3 text-white font-serif
- **Labels:** text-body-sm text-gray-400 font-inter
- **Hover:** group-hover:bg-primary/20 transition-colors duration-300

### Hero CTA Buttons
- **Primary:** bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-md border border-primary/40 text-primary-foreground shadow-xl hover:shadow-primary/50 hover:bg-primary/25 hover:border-primary/60
- **Secondary:** border border-primary/30 bg-background/50 backdrop-blur-md shadow-xs hover:bg-primary/10 hover:text-primary-foreground hover:border-primary/50

### Footer Links
- **Quick Links:** text-white/70 hover:text-accent transition-colors
- **Contact Links:** flex items-center gap-2, hover:text-accent
- **Social Links:** text-white/70 hover:text-accent, h-5 w-5

## Responsive Design

### Breakpoints
- **Mobile:** Default (up to 640px)
- **Tablet:** sm: (640px+)
- **Desktop:** md: (768px+)
- **Large:** lg: (1024px+)
- **Extra Large:** xl: (1280px+)

### Mobile Navigation
- **Menu Button:** Visible on md:hidden
- **Menu Container:** overflow-hidden with animated height
- **Links:** flex-col gap-4 py-4, animated x: -20 to 0 with stagger

### Hero Layout
- **Stats Grid:** 1 column on mobile, 3 columns on md+
- **CTA Buttons:** flex-col on mobile, flex-row on sm+
- **Contact Bridge:** inline-flex with space-x-6 px-8 py-4 rounded-full

## Admin Panel Styling (Bonus)

### Luxury Effects
- **Cards:** backdrop-filter: blur(12px), border with transparent colors, enhanced box-shadow
- **Forms:** Full-width, padding 0.75rem 1rem, height: 3rem, border-radius: 0.25rem
- **Focus States:** border-color: ring, box-shadow: 0 0 0 2px with 20% ring opacity
- **Modal Backdrop:** backdrop-filter: blur(20px), background with 50% background opacity
- **Modal Container:** background: card, border-radius: 0.5rem, padding: 2rem, max-width: 600px

### Animations
- **Slide Down:** transform: translateY(-20px), opacity: 0 to 1, duration: 0.4s ease-out
- **Button Hover:** transform: translateX(4px), duration: 0.3s
- **Card Hover:** Enhanced shadow, duration: 0.3s

## Implementation Checklist

### Core Setup
- [ ] Install Next.js with TypeScript
- [ ] Configure Tailwind CSS with custom color variables
- [ ] Set up Google Fonts (Lora, Inter)
- [ ] Create globals.css with all CSS variables and utilities
- [ ] Implement theme provider for light/dark mode

### Layout Components
- [ ] Build Header component with navigation and mobile menu
- [ ] Create Hero Section with Prism background and animations
- [ ] Implement Footer with contact info and social links
- [ ] Add responsive container and spacing utilities

### Animations & Effects
- [ ] Implement Framer Motion for page transitions
- [ ] Add hover effects and micro-interactions
- [ ] Create gold glare effect for premium elements
- [ ] Set up marble texture overlays

### Responsive Design
- [ ] Test mobile navigation animations
- [ ] Ensure hero section adapts to all screen sizes
- [ ] Verify footer layout on different devices
- [ ] Check typography scaling

### Theme System
- [ ] Implement light/dark mode toggle
- [ ] Test color variable switching
- [ ] Verify accessibility contrast ratios
- [ ] Add smooth theme transitions

### Content & Assets
- [ ] Add all background images and textures
- [ ] Implement logo variations
- [ ] Set up contact tracking system
- [ ] Configure social media links

### Testing & Polish
- [ ] Cross-browser compatibility check
- [ ] Performance optimization (lazy loading, etc.)
- [ ] Accessibility audit (WCAG compliance)
- [ ] Final design review against specifications

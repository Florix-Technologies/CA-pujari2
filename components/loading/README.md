# Loading Components

This folder contains all loading-related components for the application.

## Components

### EnhancedLoadingScreen
Located: `enhanced-loading-screen.tsx`

A two-stage loading experience:
1. **Video Stage**: Plays intro video (`/public/loading/intro.mp4`)
2. **Percentage Stage**: Shows animated percentage counter (0-100%)

**Features:**
- Automatic video playback with fallback to percentage stage
- Skip button for users who want to skip the video
- Smooth transitions between stages
- Animated particles and pulsing effects
- Theme-aware colors (light/dark mode)
- Optimized performance with RAF

**Props:**
- `isLight: boolean` - Current theme state
- `onComplete: () => void` - Callback when loading is complete

## Assets

Video files should be placed in `/public/loading/`:
- `intro.mp4` - Main intro video (current: 1.3MB)

## Performance Optimizations

1. Video preloading via `<link rel="preload">` in layout.tsx
2. Auto-skip if video fails to load (2s timeout)
3. Reduced loading time (1.5s for percentage stage)
4. Smooth exit animations (600ms)
5. Hardware-accelerated CSS animations

## Usage

```tsx
import { EnhancedLoadingScreen } from '@/components/loading/enhanced-loading-screen'

<EnhancedLoadingScreen
  isLight={isLight}
  onComplete={() => setShowContent(true)}
/>
```

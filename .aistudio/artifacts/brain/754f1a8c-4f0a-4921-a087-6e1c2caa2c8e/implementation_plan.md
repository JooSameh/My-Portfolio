# Anti-Screen Capture & Recording Protection System

A client-side security defense mechanism designed for the cybersecurity portfolio to proactively prevent screen capture, snipping tool grabs, and screen recording across all operating systems (Windows, Mac, iOS, Android).

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were confirmed via interactive consultation:
> - **Behavior**: Full blur shield on window focus loss and screen capture shortcut detection. Whenever a screenshot tool, snipping tool, or recording utility pulls OS focus away from the browser, the entire page blurs (`backdrop-blur-3xl`) and displays a cyber defense shield overlay.
> - **Scope**: Global enforcement across the entire portfolio website.
> - **Seamless Recovery**: As soon as the user refocuses on the webpage or clicks anywhere, the shield immediately dismisses so regular browsing remains completely fluid.

---

### 1. Overview & Core Concept

While web browsers operate inside a sandboxed environment without kernel-level DRM hardware display locks (FLAG_SECURE), high-assurance web applications (banking, certification platforms, and enterprise portals) deploy multi-layer anti-capture tripwires:
1. **Focus Departure Tripwire (`blur` & `visibilitychange`)**: Capturing software (Windows Snipping Tool, Snagit, OBS studio selection, macOS Screenshot utility, or iOS/Android multitasking preview) inherently removes active browser window focus. We immediately drop an impenetrable blur curtain and cybersecurity shield.
2. **Keystroke Tripwire (`keydown` & `keyup`)**: Captures shortcut attempts (`PrintScreen`, `Win+Shift+S`, `Cmd+Shift+3/4/5`, `Ctrl+P`, `Ctrl+S`), immediately blanks the screen, clears the OS clipboard (`navigator.clipboard.writeText('')`), and presents an active warning banner.
3. **Continuous Background Video Protection**: Detects `getDisplayMedia` or browser recording hooks and conceals private data.

---

### 2. User Experience & Visual Design

#### Visual Appearance
- **Normal Browsing**: The portfolio functions at full fidelity with its cyberpunk dark aesthetic, neon glowing borders, and crisp typography.
- **Triggered State (Focus Lost or Shortcut Pressed)**:
  - The viewport is instantly obscured by an animated frosted cyber shield (`backdrop-blur-3xl bg-[#0A0F1C]/90`).
  - An animated cyber shield icon with a glowing scanner ring displays in the center:
    - Title: `"SECURITY SCREEN SHIELD ACTIVATED"`
    - Subtitle: `"Screen capture and recording are disabled for protected credentials."`
    - Action prompt: `"Click anywhere or return to window to restore display"`
  - Status chip: `"SYSTEM PROTECTED • CONFIDENTIAL"`

#### Motion & Micro-Interactions
- Instant zero-delay blur activation upon blur to ensure no snipping frames capture plaintext.
- Smooth ease-out fade transition when window focus returns.

---

### 3. Key Technical Decisions & Trade-Offs

#### Decision 1: Focus-Loss Shield vs. Continuous Static Watermarking
- **Chosen Approach**: Full blur shield on focus loss combined with keystroke interception.
- **Why**: Capturing tools require focus transfer. This technique obscures 100% of the content while leaving the legitimate viewing experience untouched and high-quality when the user is actively focused on the site.

#### Decision 2: Clipboard Cleansing on Capture Events
- **Chosen Approach**: On `PrintScreen` or capture shortcut detection, write an empty or notice string to the clipboard (`navigator.clipboard.writeText('Security Policy: Screenshot disabled.')`).
- **Why**: Prevents images cached in the operating system paste buffer from being pasted into image editors.

---

### 4. Technical Architecture & Component Hierarchy

```
┌────────────────────────────────────────────────────────┐
│                        App.tsx                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │             useScreenProtection Hook             │  │
│  │   - window.addEventListener('blur')              │  │
│  │   - document.addEventListener('visibilitychange')│  │
│  │   - window.addEventListener('keydown') (PrtScn)  │  │
│  │   - window.addEventListener('focus') (Restore)   │  │
│  └────────────────────────┬─────────────────────────┘  │
│                           │ triggers                   │
│  ┌────────────────────────▼─────────────────────────┐  │
│  │             ScreenShieldOverlay.tsx              │  │
│  │   - High-Z-Index Fullscreen Shield (z-[9999])    │  │
│  │   - Backdrop Blur & Holographic Warning UI       │  │
│  │   - Dismiss On Refocus / Click                   │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │                 Main Application                 │  │
│  │  (Header, Hero, About, Projects, Certs, etc.)    │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

#### Modules to Implement:
1. `src/app/components/ScreenShieldOverlay.tsx`: The animated cyber shield modal with warning graphics, pulse scanner, and click-to-resume trigger.
2. `src/app/hooks/useScreenProtection.ts`: Centralized listener handling focus loss, keyboard shortcuts, clipboard clearing, and visibility changes.
3. Integration in `App.tsx`: Mounted at the root level to guard all components and sub-modals uniformly.

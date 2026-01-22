"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { CodeTyper } from "./CodeTyper";
import "../styles/loader.css";

// C++ Competitive Programming Template
const CPP_SNIPPET = `#include <bits/stdc++.h>
using namespace std;
#define ll long long
#define pb push_back
#define mp make_pair
#define endl "\\n"
#define F first
#define S second
#define umap unordered_map<int, int>
#define mset multiset<pair<int, int>>
#define mst multiset<int>
#define vct vector<int>
#define pii pair<int, int>
#define ld long double
#define vpii vector<pair<int, int>>
#define lli long long int
#define F(i, n) for(int i = 0; i < (n); ++i)
#define R(i, n) for(int i = (n) - 1; i >= 0; --i)
#define IOS ios_base::sync_with_stdio(false); cin.tie(NULL); cout.tie(NULL)

void solve() {
    // SCPC 2026 - Code. Compete. Conquer.
}`;

type LoaderState = "logo-intro" | "typing" | "holding" | "animating" | "done";

interface LoaderProps {
  appReadyPromise?: Promise<void> | null;
  timeout?: number;
  minDurationMs?: number;
  onFinish?: () => void;
  headerLogoSelector?: string;
}

const FALLBACK_RECT = { top: 20, left: 20, width: 44, height: 44 };

declare global {
  interface Window {
    APP_READY_PROMISE?: Promise<void>;
  }
}

export function Loader({
  appReadyPromise,
  timeout = 15000,
  minDurationMs = 4000,
  onFinish,
  headerLogoSelector = "#site-header-logo",
}: LoaderProps) {
  const [state, setState] = useState<LoaderState>("typing");
  const [showSkip, setShowSkip] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const [fadeOverlay, setFadeOverlay] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [codeVisible, setCodeVisible] = useState(true);

  // Speed settings - slower for better splash experience
  const [typingDuration, setTypingDuration] = useState(3500);
  const [effectiveMinDuration, setEffectiveMinDuration] = useState(minDurationMs);
  const [logoIntroComplete, setLogoIntroComplete] = useState(false);

  const logoRef = useRef<HTMLDivElement>(null);
  const logoImgRef = useRef<HTMLImageElement>(null);
  const mountTimeRef = useRef(Date.now());
  const logoShownTimeRef = useRef(0);
  const appReadyRef = useRef(false);
  const typingDoneRef = useRef(false);
  const exitTriggeredRef = useRef(false);
  const prefersReducedMotion = useRef(false);
  const isReturningUser = useRef(false);

  // Check reduced motion AND returning user on mount
  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Check if user has seen this before ("PageCast" fast mode)
    const hasSeen = localStorage.getItem("scpc-intro-seen");
    if (hasSeen) {
      isReturningUser.current = true;
      setTypingDuration(1500); // Faster for returning users but still visible
      setEffectiveMinDuration(2000); // Reduced hold time
    }
  }, [minDurationMs]);

  // Logo intro phase - show logo slowly first
  useEffect(() => {
    if (state !== "logo-intro") return;

    // Show logo with slow fade in
    const showLogoTimer = setTimeout(() => {
      setLogoVisible(true);
    }, 300);

    // After logo is visible for a bit, start code typing
    const logoIntroDuration = isReturningUser.current ? 1000 : 1800;
    const startTypingTimer = setTimeout(() => {
      setLogoIntroComplete(true);
      setCodeVisible(true);
      setState("typing");
    }, logoIntroDuration);

    return () => {
      clearTimeout(showLogoTimer);
      clearTimeout(startTypingTimer);
    };
  }, [state]);

  // Handle app ready promise
  useEffect(() => {
    const promise = appReadyPromise || window.APP_READY_PROMISE;
    if (promise) {
      promise
        .then(() => {
          appReadyRef.current = true;
          checkAndExit();
        })
        .catch(() => {
          appReadyRef.current = true;
          checkAndExit();
        });
    } else {
      // No promise = immediately ready
      appReadyRef.current = true;
    }
  }, [appReadyPromise]);

  // Timeout handler
  useEffect(() => {
    const timer = setTimeout(() => {
      appReadyRef.current = true;
      checkAndExit();
    }, timeout);
    return () => clearTimeout(timer);
  }, [timeout]);

  // Check if we can exit and do it
  const checkAndExit = useCallback(() => {
    if (exitTriggeredRef.current) return;

    const now = Date.now();
    const elapsed = now - mountTimeRef.current;
    const minPassed = elapsed >= effectiveMinDuration;

    // Ensure logo has been visible for at least 300ms (to prevent flicker)
    const logoTime = logoShownTimeRef.current ? now - logoShownTimeRef.current : 0;
    const logoMinPassed = logoTime >= 400; // 400ms minimum logo presence

    const ready = appReadyRef.current;
    const typed = typingDoneRef.current;

    // Must satisfy: App Ready + Typed + Min Total Time + Min Logo Time
    if (ready && typed && minPassed && logoMinPassed) {
      triggerExit();
    }
  }, [effectiveMinDuration]);

  // Trigger exit animation
  const triggerExit = useCallback(() => {
    if (exitTriggeredRef.current) return;
    exitTriggeredRef.current = true;
    setState("animating");
    runFLIPAnimation();
  }, []);

  // When typing completes - now show logo with slow animation
  const handleTypingComplete = useCallback(() => {
    if (typingDoneRef.current) return;

    typingDoneRef.current = true;

    // First fade out the code
    setCodeVisible(false);

    // After a brief pause, show logo with slow smooth animation
    setTimeout(() => {
      setLogoVisible(true);
      logoShownTimeRef.current = Date.now();
      setState("holding");

      // Show skip button after logo has been visible a bit
      const skipDelay = isReturningUser.current ? 500 : 1200;
      setTimeout(() => setShowSkip(true), skipDelay);

      // Check exit with delay to allow logo animation to complete
      setTimeout(() => checkAndExit(), 800);
    }, 600); // 600ms pause before logo appears
  }, [checkAndExit]);

  // Poll for exit during holding
  useEffect(() => {
    if (state !== "holding") return;
    const interval = setInterval(checkAndExit, 100);
    return () => clearInterval(interval);
  }, [state, checkAndExit]);

  // Robust FLIP Animation
  const runFLIPAnimation = useCallback(() => {
    const logoContainer = logoRef.current;
    const logoImg = logoImgRef.current;

    if (!logoContainer || !logoImg) {
      finishAnimation();
      return;
    }

    if (prefersReducedMotion.current) {
      finishAnimation();
      return;
    }

    // Stop all CSS animations immediately
    logoContainer.classList.add("is-flipping");
    logoImg.style.animation = "none";

    // FIRST: Capture current position
    const first = logoImg.getBoundingClientRect();

    // LAST: Find header logo or use fallback
    const findHeaderLogo = (): DOMRect | typeof FALLBACK_RECT => {
      const headerLogo = document.querySelector(headerLogoSelector);
      if (headerLogo) {
        return headerLogo.getBoundingClientRect();
      }
      return FALLBACK_RECT;
    };

    const last = findHeaderLogo();

    // Calculate deltas (INVERT)
    const deltaX = first.left - last.left;
    const deltaY = first.top - last.top;
    const scaleX = first.width / last.width;
    const scaleY = first.height / last.height;

    // Set up for animation - DON'T change position/size, only use transform
    logoContainer.style.willChange = "transform, opacity";
    logoContainer.style.transformOrigin = "center center";

    // Apply INVERTED state (logo stays in visual same place)
    // Logo is already at center, we need it to END at header position
    // So we animate FROM current center TO header

    // Start: logo at center (no transform needed - it's already there)
    // End: logo at header position

    // Actually, FLIP means:
    // 1. Record FIRST (center position)
    // 2. Move element to LAST position instantly
    // 3. Apply inverse transform to make it LOOK like it's still at FIRST
    // 4. Animate transform to identity

    // But since our logo container is absolutely centered, 
    // we'll animate directly from center to target using transform only

    // Calculate target position relative to viewport center
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;
    const logoHalfWidth = first.width / 2;
    const logoHalfHeight = first.height / 2;

    // Current center of logo
    const currentCenterX = first.left + logoHalfWidth;
    const currentCenterY = first.top + logoHalfHeight;

    // Target center of header logo
    const targetCenterX = last.left + last.width / 2;
    const targetCenterY = last.top + last.height / 2;

    // Translation needed
    const translateX = targetCenterX - currentCenterX;
    const translateY = targetCenterY - currentCenterY;

    // Scale needed
    const scale = last.width / first.width;

    // Start fading overlay immediately
    setFadeOverlay(true);

    // Apply animation via CSS transition
    logoContainer.style.transition = "transform 450ms cubic-bezier(0.2, 0.9, 0.2, 1)";

    // Force reflow
    void logoContainer.offsetHeight;

    // PLAY: Animate to target
    logoContainer.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;

    // Listen for transition end
    const handleTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName === "transform") {
        logoContainer.removeEventListener("transitionend", handleTransitionEnd);
        finishAnimation();
      }
    };
    logoContainer.addEventListener("transitionend", handleTransitionEnd);

    // Fallback timeout
    setTimeout(finishAnimation, 500);
  }, [headerLogoSelector]);

  // Cleanup
  const finishAnimation = useCallback(() => {
    if (state === "done") return;
    setState("done");

    // Small delay to ensure fade completes
    setTimeout(() => {
      setIsRemoved(true);
      // Mark as seen for next time ("PageCast" mode)
      localStorage.setItem("scpc-intro-seen", "true");
      onFinish?.();
    }, 100);
  }, [onFinish, state]);

  if (isRemoved) {
    return null;
  }

  return (
    <div
      className={`loader-overlay ${fadeOverlay ? "fade-out" : ""}`}
      role="dialog"
      aria-label="Loading application"
      aria-busy={state !== "done"}
    >
      {/* Code typing animation - runs first */}
      <div className={`loader-code-wrapper ${!codeVisible ? "fade-out" : ""}`}>
        {state === "typing" && codeVisible ? (
          <CodeTyper
            snippet={CPP_SNIPPET}
            onComplete={handleTypingComplete}
            typingDuration={typingDuration}
          />
        ) : codeVisible ? (
          <div className="loader-code-container" aria-hidden="true">
            <pre className="loader-code">
              <code>{CPP_SNIPPET}</code>
            </pre>
          </div>
        ) : null}
      </div>

      {/* Centered logo */}
      <div
        ref={logoRef}
        className={`loader-logo-container ${logoVisible ? "visible" : ""} ${state === "animating" ? "is-flipping" : ""
          } ${state === "logo-intro" ? "intro-phase" : ""}`}
      >
        <img
          ref={logoImgRef}
          src="/scpc.png"
          alt="SCPC Logo"
          className="loader-logo"
          draggable={false}
        />
        {state === "holding" && (
          <div className="loader-logo-sheen" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}

export default Loader;

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { CodeTyper } from "./CodeTyper";
import "../styles/loader.css";
import { SCPC_LOGO_URL } from "@/lib/constants";

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

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const hasSeen = localStorage.getItem("scpc-intro-seen");
    if (hasSeen) {
      isReturningUser.current = true;
      setTypingDuration(800);
      setEffectiveMinDuration(1500);
    }

    // Remove the critical CSS loader from layout.tsx once this component mounts
    const initialLoader = document.getElementById('initial-loader');
    if (initialLoader) {
      initialLoader.style.opacity = '0';
      setTimeout(() => initialLoader.remove(), 500);
    }
  }, [minDurationMs]);

  useEffect(() => {
    if (state !== "logo-intro") return;

    const showLogoTimer = setTimeout(() => {
      setLogoVisible(true);
    }, 300);

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
      appReadyRef.current = true;
    }
  }, [appReadyPromise]);

  useEffect(() => {
    const timer = setTimeout(() => {
      appReadyRef.current = true;
      checkAndExit();
    }, timeout);
    return () => clearTimeout(timer);
  }, [timeout]);

  const checkAndExit = useCallback(() => {
    if (exitTriggeredRef.current) return;

    const now = Date.now();
    const elapsed = now - mountTimeRef.current;
    const minPassed = elapsed >= effectiveMinDuration;

    const logoTime = logoShownTimeRef.current ? now - logoShownTimeRef.current : 0;
    const logoMinPassed = logoTime >= 200;

    const ready = appReadyRef.current;
    const typed = typingDoneRef.current;

    if (ready && typed && minPassed && logoMinPassed) {
      triggerExit();
    }
  }, [effectiveMinDuration]);

  const triggerExit = useCallback(() => {
    if (exitTriggeredRef.current) return;
    exitTriggeredRef.current = true;
    setState("animating");
    runFLIPAnimation();
  }, []);

  const handleTypingComplete = useCallback(() => {
    if (typingDoneRef.current) return;

    typingDoneRef.current = true;

    setCodeVisible(false);

    setTimeout(() => {
      setLogoVisible(true);
      logoShownTimeRef.current = Date.now();
      setState("holding");

      const skipDelay = isReturningUser.current ? 500 : 1200;
      setTimeout(() => setShowSkip(true), skipDelay);

      setTimeout(() => checkAndExit(), 800);
    }, 600);
  }, [checkAndExit]);

  useEffect(() => {
    if (state !== "holding") return;
    const interval = setInterval(checkAndExit, 100);
    return () => clearInterval(interval);
  }, [state, checkAndExit]);

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

    logoContainer.classList.add("is-flipping");
    logoImg.style.animation = "none";

    const first = logoImg.getBoundingClientRect();

    const findHeaderLogo = (): DOMRect | typeof FALLBACK_RECT => {
      const headerLogo = document.querySelector(headerLogoSelector);
      if (headerLogo) {
        return headerLogo.getBoundingClientRect();
      }
      return FALLBACK_RECT;
    };

    const last = findHeaderLogo();

    const deltaX = first.left - last.left;
    const deltaY = first.top - last.top;
    const scaleX = first.width / last.width;
    const scaleY = first.height / last.height;

    logoContainer.style.willChange = "transform, opacity";
    logoContainer.style.transformOrigin = "center center";

    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;
    const logoHalfWidth = first.width / 2;
    const logoHalfHeight = first.height / 2;

    const currentCenterX = first.left + logoHalfWidth;
    const currentCenterY = first.top + logoHalfHeight;

    const targetCenterX = last.left + last.width / 2;
    const targetCenterY = last.top + last.height / 2;

    const translateX = targetCenterX - currentCenterX;
    const translateY = targetCenterY - currentCenterY;

    const scale = last.width / first.width;

    setFadeOverlay(true);

    logoContainer.style.transition = "transform 450ms cubic-bezier(0.2, 0.9, 0.2, 1)";

    void logoContainer.offsetHeight;

    logoContainer.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;

    const handleTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName === "transform") {
        logoContainer.removeEventListener("transitionend", handleTransitionEnd);
        finishAnimation();
      }
    };
    logoContainer.addEventListener("transitionend", handleTransitionEnd);

    setTimeout(finishAnimation, 500);
  }, [headerLogoSelector]);

  const finishAnimation = useCallback(() => {
    if (state === "done") return;
    setState("done");

    setTimeout(() => {
      setIsRemoved(true);
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

      <div
        ref={logoRef}
        className={`loader-logo-container ${logoVisible ? "visible" : ""} ${state === "animating" ? "is-flipping" : ""
          } ${state === "logo-intro" ? "intro-phase" : ""}`}
      >
        <img
          ref={logoImgRef}
          src={SCPC_LOGO_URL}
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

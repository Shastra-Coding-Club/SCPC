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
}

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


    const preLoader = document.getElementById('pre-loader');
    if (preLoader) {
      preLoader.remove();
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
    setFadeOverlay(true);
    setTimeout(() => finishAnimation(), 300);
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
    }, 150);
  }, [checkAndExit]);

  useEffect(() => {
    if (state !== "holding") return;
    const interval = setInterval(checkAndExit, 100);
    return () => clearInterval(interval);
  }, [state, checkAndExit]);


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
            initialLength={24}
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
        className={`loader-logo-container ${logoVisible ? "visible" : ""}`}
      >
        <img
          src={SCPC_LOGO_URL}
          alt="SCPC Logo"
          className="loader-logo"
          draggable={false}
        />
      </div>
    </div>
  );
}

export default Loader;

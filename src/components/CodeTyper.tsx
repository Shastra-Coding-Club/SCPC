"use client";

import { useState, useEffect, useRef, useMemo } from "react";

interface CodeTyperProps {
  snippet: string;
  onComplete: () => void;
  typingDuration?: number; // Target duration in ms (default: 1500)
  initialLength?: number;
}

// Syntax highlighting for C++
function highlightCPP(text: string): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  const patterns: { regex: RegExp; className: string }[] = [
    // Preprocessor directives
    { regex: /^(#include|#define|#pragma|#ifndef|#ifdef|#endif|#if|#else)\b/, className: "preprocessor" },
    // Comments
    { regex: /^(\/\/[^\n]*)/, className: "comment" },
    { regex: /^(\/\*[\s\S]*?\*\/)/, className: "comment" },
    // Strings
    { regex: /^("(?:\\.|[^"\\])*")/, className: "string" },
    // Keywords
    { regex: /^(using|namespace|void|int|long|double|float|char|bool|return|if|else|for|while|do|switch|case|break|continue|const|auto|typedef|struct|class|public|private|protected|virtual|static|template|typename|nullptr|true|false)\b/, className: "keyword" },
    // Types and macros (common CP patterns)
    { regex: /^(ll|lli|ld|pii|vct|vpii|umap|mset|mst|string|vector|pair|map|set|queue|stack|priority_queue|deque|list|unordered_map|unordered_set|multiset|multimap)\b/, className: "type" },
    // Macro functions
    { regex: /^(pb|mp|endl|F|S|IOS)\b/, className: "macro" },
    // Numbers
    { regex: /^(\b\d+\.?\d*\b)/, className: "number" },
    // Operators and punctuation
    { regex: /^([+\-*/%=<>!&|^~?:;,.()\[\]{}])/, className: "operator" },
  ];

  while (remaining.length > 0) {
    let matched = false;

    for (const { regex, className } of patterns) {
      const match = remaining.match(regex);
      if (match) {
        result.push(
          <span key={key++} className={className}>
            {match[0]}
          </span>
        );
        remaining = remaining.slice(match[0].length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Push single character as plain text
      result.push(remaining[0]);
      remaining = remaining.slice(1);
    }
  }

  return result;
}

export function CodeTyper({
  snippet,
  onComplete,
  typingDuration = 1500,
  initialLength = 0,
}: CodeTyperProps) {
  const [displayedLength, setDisplayedLength] = useState(initialLength);
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useRef(false);

  // Check reduced motion preference
  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion.current) {
      // Instant display for reduced motion
      setDisplayedLength(snippet.length);
      setIsComplete(true);
      onComplete();
    }
  }, [snippet.length, onComplete]);

  // Typing animation with acceleration
  useEffect(() => {
    if (prefersReducedMotion.current || isComplete) return;

    const totalChars = snippet.length;
    const remainingChars = totalChars - initialLength;
    const startTime = Date.now();
    let animationFrameId: number;

    const update = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      let progress = Math.min(elapsed / typingDuration, 1);

      // Acceleration: Quadratic easing (y = x^2)
      const easedProgress = Math.pow(progress, 2);

      // Start from initialLength and animate remaining characters
      const currentCount = initialLength + Math.floor(easedProgress * remainingChars);
      setDisplayedLength(currentCount);

      // Auto-scroll to keep current line visible
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(update);
      } else {
        setIsComplete(true);
        // Brief pause before signaling complete
        setTimeout(onComplete, 100);
      }
    };

    animationFrameId = requestAnimationFrame(update);

    return () => cancelAnimationFrame(animationFrameId);
  }, [snippet, typingDuration, onComplete, isComplete, initialLength]);

  const displayedText = snippet.slice(0, displayedLength);
  const highlightedContent = useMemo(
    () => highlightCPP(displayedText),
    [displayedText]
  );

  return (
    <div ref={containerRef} className="loader-code-container">
      <pre className="loader-code">
        <code>
          {highlightedContent}
          {!isComplete && <span className="loader-cursor" />}
        </code>
      </pre>
    </div>
  );
}

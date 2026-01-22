"use client";

import { useState, useEffect, useRef, useMemo } from "react";

interface CodeTyperProps {
  snippet: string;
  onComplete: () => void;
  typingDuration?: number; // Target duration in ms (default: 1500)
}

// Syntax highlighting for HTML
function highlightHTML(text: string): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  const patterns: { regex: RegExp; className: string }[] = [
    { regex: /^(<!DOCTYPE[^>]*>)/i, className: "doctype" },
    { regex: /^(<!--[\s\S]*?-->)/, className: "comment" },
    { regex: /^(<\/?[a-zA-Z][a-zA-Z0-9-]*)/, className: "tag" },
    { regex: /^(\s+[a-zA-Z-]+)(?==)/, className: "attr" },
    { regex: /^(="[^"]*")/, className: "string" },
    { regex: /^(>)/, className: "tag" },
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
}: CodeTyperProps) {
  const [displayedLength, setDisplayedLength] = useState(0);
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
    const startTime = Date.now();
    let animationFrameId: number;

    const update = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      let progress = Math.min(elapsed / typingDuration, 1);

      // Acceleration: Quadratic easing (starts slow, speeds up properly)
      // curve: y = x^2
      // We want characters to appear slowly at first, then faster.
      const easedProgress = Math.pow(progress, 2); 
      
      const currentCount = Math.floor(easedProgress * totalChars);
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
  }, [snippet, typingDuration, onComplete, isComplete]);

  const displayedText = snippet.slice(0, displayedLength);
  const highlightedContent = useMemo(
    () => highlightHTML(displayedText),
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

"use client";

import { useEffect, useMemo, useState } from "react";

type HeroHeadlineWord = {
  readonly text: string;
  readonly emphasis: "soft" | "focus";
};

type HeroHeadlinePhrase = readonly HeroHeadlineWord[];

type BuildHeroTypingHeadlineProps = {
  readonly phrases: readonly HeroHeadlinePhrase[];
};

const typingDelay = 82;
const deletingDelay = 46;
const phrasePause = 1450;
const betweenPhrasesPause = 440;

const getPhraseText = (phrase: HeroHeadlinePhrase) =>
  phrase.map((word) => word.text).join(" ");

function getVisibleWords(phrase: HeroHeadlinePhrase, characterCount: number) {
  let offset = 0;

  return phrase.flatMap((word, index) => {
    const visibleCharacters = Math.min(
      Math.max(characterCount - offset, 0),
      word.text.length,
    );
    const visibleText = word.text.slice(0, visibleCharacters);

    offset += word.text.length + 1;

    return visibleText ? [{ ...word, index, visibleText }] : [];
  });
}

export function BuildHeroTypingHeadline({ phrases }: BuildHeroTypingHeadlineProps) {
  const phraseTexts = useMemo(() => phrases.map(getPhraseText), [phrases]);
  const longestPhrase = useMemo(
    () => phrases.reduce((longest, phrase) => (
      getPhraseText(phrase).length > getPhraseText(longest).length ? phrase : longest
    )),
    [phrases],
  );
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const activePhrase = phrases[phraseIndex];
  const activePhraseText = phraseTexts[phraseIndex];
  const visibleWords = getVisibleWords(activePhrase, characterCount);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateMotionPreference = () => {
      const reducedMotion = mediaQuery.matches;

      setPrefersReducedMotion(reducedMotion);
      setPhraseIndex(0);
      setCharacterCount(reducedMotion ? phraseTexts[0].length : 0);
      setIsTyping(!reducedMotion);
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, [phraseTexts]);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const activePhraseLength = activePhraseText.length;
    const delay = isTyping
      ? characterCount < activePhraseLength
        ? typingDelay
        : phrasePause
      : characterCount > 0
        ? deletingDelay
        : betweenPhrasesPause;

    const timeout = window.setTimeout(() => {
      if (isTyping && characterCount < activePhraseLength) {
        setCharacterCount((current) => current + 1);
        return;
      }

      if (isTyping) {
        setIsTyping(false);
        return;
      }

      if (characterCount > 0) {
        setCharacterCount((current) => current - 1);
        return;
      }

      setPhraseIndex((current) => (current + 1) % phrases.length);
      setIsTyping(true);
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [
    activePhraseText.length,
    characterCount,
    isTyping,
    phrases.length,
    prefersReducedMotion,
  ]);

  return (
    <h1 className="build-hero__typing-headline" id="build-hero-title">
      <span className="build-hero__typing-sizer" aria-hidden="true">
        {longestPhrase.map((word) => (
          <span
            className={"build-hero__typing-word build-hero__typing-word--" + word.emphasis}
            key={word.text}
          >
            {word.text}
          </span>
        ))}
      </span>

      <span className="build-hero__typing-live" aria-hidden="true">
        {visibleWords.map((word, index) => (
          <span
            className={
              "build-hero__typing-word build-hero__typing-word--" + word.emphasis +
              (index === visibleWords.length - 1 ? " is-cursor-active" : "")
            }
            key={word.index}
          >
            {word.visibleText}
          </span>
        ))}
        {visibleWords.length === 0 ? <span className="build-hero__typing-cursor" /> : null}
      </span>

      <span className="sr-only">Built for generations.</span>
    </h1>
  );
}

"use client";

import { useEffect, useCallback } from "react";
import confetti from "canvas-confetti";

interface ConfettiProps {
  trigger?: boolean;
}

export function useConfetti() {
  const fire = useCallback(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e'],
      });
    }, 250);
  }, []);

  const fireEmoji = useCallback(() => {
    const emojis = ['🎉', '✨', '🎊', '💜', '⭐'];
    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0.5,
      decay: 0.94,
      startVelocity: 30,
      zIndex: 9999,
    };

    function shoot() {
      confetti({
        ...defaults,
        particleCount: 30,
        scalar: 1.2,
        shapes: ['circle', 'square'],
        colors: ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899'],
      });

      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 2,
        shapes: ['text'],
        shapeOptions: {
          text: {
            value: emojis,
          },
        },
      } as confetti.Options);
    }

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  }, []);

  const fireSuccess = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#6ee7b7'],
      zIndex: 9999,
    });
  }, []);

  return { fire, fireEmoji, fireSuccess };
}

export function Confetti({ trigger }: ConfettiProps) {
  const { fire } = useConfetti();

  useEffect(() => {
    if (trigger) {
      fire();
    }
  }, [trigger, fire]);

  return null;
}

export function SuccessAnimation() {
  return (
    <div className="flex justify-center">
      <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
        <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
      </svg>
    </div>
  );
}


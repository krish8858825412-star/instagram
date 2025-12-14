
"use client";

import { useState, useEffect } from 'react';

export const useTypewriter = (text: string, speed: number = 50, start: boolean = true) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i = 0;
    if (start) {
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(prevText => prevText + text.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, speed);

      return () => {
        clearInterval(typingInterval);
        setDisplayText('');
      };
    } else {
        setDisplayText('');
    }
  }, [text, speed, start]);

  return displayText;
};

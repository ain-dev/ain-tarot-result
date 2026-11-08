'use client';

import { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import createCache, { type EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

// Collect Emotion (Chakra) styles during SSR and emit them into <head> via
// useServerInsertedHTML instead of Emotion's default inline <style> siblings in
// <body>. With React 19 the inline tags get moved out of <body> by Emotion while
// hydration is in progress, which intermittently aborts hydration (#418).
export default function EmotionRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ cache, flush }] = useState(() => {
    const emotionCache: EmotionCache = createCache({ key: 'css' });
    emotionCache.compat = true;
    const prevInsert = emotionCache.insert;
    let inserted: string[] = [];
    emotionCache.insert = (...args) => {
      const serialized = args[1];
      if (emotionCache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flushInserted = () => {
      const prev = inserted;
      inserted = [];
      return prev;
    };
    return { cache: emotionCache, flush: flushInserted };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;
    let styles = '';
    for (const name of names) {
      const style = cache.inserted[name];
      if (typeof style === 'string') styles += style;
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}

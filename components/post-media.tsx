'use client';
import { useEffect, useState } from 'react';
import { createClient } from '../lib/supabase/client';

export default function PostMedia({ path }: { path: string }) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    if (!supabase || !path) return;

    void supabase.storage.from('nexus-media').createSignedUrl(path, 3600).then(({ data, error }) => {
      if (active && !error) setUrl(data.signedUrl);
    });

    return () => { active = false; };
  }, [path]);

  if (!url) return null;
  if (path.toLowerCase().endsWith('.mp4')) {
    return <video className="post-media" src={url} controls preload="metadata" aria-label="Gönderi videosu" />;
  }
  return <img className="post-media" src={url} alt="Gönderi görseli" loading="lazy" />;
}

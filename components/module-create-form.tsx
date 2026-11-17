'use client';

import { useState } from 'react';
import { createClient } from '../lib/supabase/client';

export default function ModuleCreateForm({ table, noun, fields }: { table: string; noun: string; fields: string[] }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [values, setValues] = useState<string[]>(fields.map(() => ''));
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function save() {
    const supabase = createClient();
    if (!supabase) {
      setMessage('Supabase yapılandırılmamış. Giriş servisi ayarlarını kontrol edin.');
      return;
    }
    if (!title.trim() || !description.trim()) {
      setMessage('Başlık ve açıklama alanlarını doldurun.');
      return;
    }

    setBusy(true);
    setMessage('');
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setMessage('İçerik oluşturmak için önce giriş yapın.');
        return;
      }

      const extra: Record<string, unknown> = {};
      if (table === 'projects') extra.technologies = values[0].split(',').map((x) => x.trim()).filter(Boolean);
      if (table === 'debates') extra.category = values[0] || 'Genel';
      if (table === 'ideas') {
        extra.stage = values[0] || 'early';
        extra.category = values[1] || 'Genel';
      }
      if (table === 'courses') extra.level = values[0] || 'Başlangıç';
      if (table === 'projects') {
        extra.github_url = values[1] || null;
        extra.demo_url = values[2] || null;
      }
      if (table === 'courses') extra.resource_url = values[1] || null;
      if (table === 'debates') extra.source_url = values[1] || null;

      const { error } = await supabase.from(table).insert({
        author_id: user.id,
        title: title.trim(),
        description: description.trim(),
        ...extra,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage(`${noun} yayınlandı.`);
      setTitle('');
      setDescription('');
      setValues(fields.map(() => ''));
      window.location.reload();
    } catch {
      setMessage('Yayınlama tamamlanamadı. Bağlantını kontrol edip yeniden dene.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: 'grid', gap: 9 }}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Başlık" style={input} />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Biraz daha anlat..." rows={3} style={{ ...input, resize: 'vertical' }} />
      {fields.map((field, index) => (
        <input key={field} value={values[index]} onChange={(e) => setValues(values.map((value, i) => i === index ? e.target.value : value))} placeholder={field} style={input} />
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="primary" onClick={save} disabled={busy}>{busy ? 'Kaydediliyor…' : 'Yayınla'}</button>
        {message && <span role="status" style={{ fontSize: 10, color: '#7657f6' }}>{message}</span>}
      </div>
    </div>
  );
}

const input: React.CSSProperties = {
  border: '1px solid #ececf2',
  borderRadius: 9,
  padding: '10px 12px',
  fontSize: 12,
  outlineColor: '#7657f6',
  background: 'transparent',
  color: 'inherit',
};

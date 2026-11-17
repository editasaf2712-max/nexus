'use client';

import { useState } from 'react';
import { createClient } from '../lib/supabase/client';

const AUTH_ALIAS_DOMAIN = 'users.nexus.invalid';

function normalizeUsername(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '')
    .slice(0, 24)
    .replace(/[-_]+$/g, '');
}

function authAlias(username: string) {
  // Supabase password auth requires an email or phone. This reserved, non-deliverable
  // alias keeps the email out of the UI; email confirmation must stay disabled.
  return `${username}@${AUTH_ALIAS_DOMAIN}`;
}

export default function AuthPanel() {
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    const supabase = createClient();
    if (!supabase) {
      setMsg('Giriş servisi şu anda yapılandırılmamış.');
      return;
    }

    const username = normalizeUsername(name);
    if (!username || !password) {
      setMsg('Kullanıcı adı ve şifre gerekli.');
      return;
    }
    if (username.length < 3) {
      setMsg('Kullanıcı adı en az 3 karakter olmalı.');
      return;
    }
    if (mode === 'up' && password.length < 8) {
      setMsg('Şifre en az 8 karakter olmalı.');
      return;
    }

    setBusy(true);
    setMsg('');
    try {
      const result = mode === 'in'
        ? await supabase.auth.signInWithPassword({ email: authAlias(username), password })
        : await supabase.auth.signUp({
            email: authAlias(username),
            password,
            options: { data: { username, display_name: name.trim() } },
          });

      if (result.error) {
        const error = result.error.message.toLowerCase();
        if (mode === 'in') {
          setMsg('Kullanıcı adı veya şifre hatalı.');
        } else if (/already registered|already been registered|user already exists|duplicate|unique/.test(error)) {
          setMsg('Bu kullanıcı adı alınmış. Başka bir ad seç.');
        } else if (error.includes('email') && (error.includes('confirm') || error.includes('verification'))) {
          setMsg('Kayıt ayarı tamamlanmamış. Supabase Authentication → Providers → Email bölümünde Confirm email kapalı olmalı.');
        } else if (/password.*(weak|short)|weak password/.test(error)) {
          setMsg('Daha uzun ve tahmin edilmesi zor bir şifre seç.');
        } else {
          setMsg('Kayıt tamamlanamadı. Bilgilerini kontrol edip tekrar dene.');
        }
        return;
      }

      if (mode === 'in') {
        setMsg('Giriş başarılı.');
        window.location.reload();
      } else if (result.data.session) {
        setMsg('Hesap oluşturuldu.');
        window.location.reload();
      } else {
        setMsg('Oturum açılamadı. Supabase’te e-posta doğrulamasının kapalı olduğunu kontrol et.');
      }
    } catch {
      setMsg('İşlem tamamlanamadı. Bağlantını kontrol edip tekrar dene.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ marginTop: 16, display: 'grid', gap: 9, maxWidth: 360 }}>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        onKeyDown={(event) => { if (event.key === 'Enter') void submit(); }}
        placeholder="Kullanıcı adı"
        aria-label="Kullanıcı adı"
        autoComplete="username"
        maxLength={48}
        style={field}
      />
      <input
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        onKeyDown={(event) => { if (event.key === 'Enter') void submit(); }}
        placeholder="Şifre"
        aria-label="Şifre"
        type="password"
        autoComplete={mode === 'in' ? 'current-password' : 'new-password'}
        style={field}
      />
      {mode === 'up' && <small style={{ color: '#8c91a0' }}>Benzersiz kullanıcı adı kullan. Şifre sıfırlama şu an e-posta olmadan desteklenmiyor.</small>}
      <button className="primary" onClick={() => void submit()} disabled={busy}>
        {busy ? 'İşleniyor…' : mode === 'in' ? 'Giriş yap' : 'Hesap oluştur'}
      </button>
      <button className="text-tool" onClick={() => { setMode(mode === 'in' ? 'up' : 'in'); setMsg(''); }}>
        {mode === 'in' ? 'Hesabın yok mu? Kayıt ol' : 'Zaten hesabın var mı? Giriş yap'}
      </button>
      {msg && <small role="status" style={{ color: '#7657f6' }}>{msg}</small>}
    </div>
  );
}

const field: React.CSSProperties = {
  border: '1px solid #ececf2',
  borderRadius: 9,
  padding: '11px 12px',
  fontSize: 12,
  background: 'transparent',
  color: 'inherit',
};

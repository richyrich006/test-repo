'use client';

import { useState } from 'react';

const ISSUE_BASE = 'https://github.com/richyrich006/test-repo/issues/new';

export default function SubmitForm() {
  const [brand, setBrand] = useState('');
  const [firm, setFirm] = useState('');
  const [category, setCategory] = useState('');
  const [source, setSource] = useState('');
  const [alternatives, setAlternatives] = useState('');
  const [notes, setNotes] = useState('');

  const body = [
    `**Brand:** ${brand || '(required)'}`,
    `**Private equity owner:** ${firm || '(required)'}`,
    `**Category:** ${category || '(unspecified)'}`,
    `**Source / link to reporting:** ${source || '(please add one — submissions without a source can’t be published)'}`,
    `**Suggested non-PE alternatives:** ${alternatives || '(none suggested)'}`,
    '',
    '**Notes:**',
    notes || '(none)',
  ].join('\n');

  const href = `${ISSUE_BASE}?title=${encodeURIComponent(
    `Brand submission: ${brand || 'untitled'}`
  )}&body=${encodeURIComponent(body)}`;

  const ready = brand.trim().length > 0 && firm.trim().length > 0;

  return (
    <div>
      <div style={{ display: 'grid', gap: '0.9rem', maxWidth: '620px' }}>
        <Field label="Brand name *" value={brand} onChange={setBrand} placeholder="e.g. Jersey Mike’s" />
        <Field label="Private equity owner *" value={firm} onChange={setFirm} placeholder="e.g. Blackstone" />
        <Field label="Category" value={category} onChange={setCategory} placeholder="e.g. Restaurants" />
        <Field
          label="Source (news article, SEC filing, press release)"
          value={source}
          onChange={setSource}
          placeholder="https://…"
        />
        <Field
          label="Non-PE alternatives to suggest"
          value={alternatives}
          onChange={setAlternatives}
          placeholder="e.g. local independent sub shops"
        />
        <label className="sans" style={{ fontSize: '0.9rem', fontWeight: 700 }}>
          Notes
          <textarea
            className="search-bar"
            style={{ marginTop: '0.3rem', marginBottom: 0, fontFamily: 'inherit', minHeight: '110px' }}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything else — acquisition year, what changed after the buyout, corrections to an existing entry…"
          />
        </label>
      </div>

      <p style={{ marginTop: '1.4rem' }}>
        <a
          className="btn btn-primary"
          href={ready ? href : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!ready}
          style={ready ? undefined : { opacity: 0.45, pointerEvents: 'none' }}
        >
          Open a pre-filled GitHub issue →
        </a>
      </p>
      <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
        This opens GitHub with your submission filled in. Nothing is sent until you
        click submit there, and you&apos;ll need a free GitHub account. Prefer email?
        Send the same details to the address below.
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="sans" style={{ fontSize: '0.9rem', fontWeight: 700 }}>
      {label}
      <input
        className="search-bar"
        style={{ marginTop: '0.3rem', marginBottom: 0, fontFamily: 'inherit' }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

import React from 'react';

export default function AuthorMeta({ author }) {
  if (!author) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <img
        src={author.image_url}
        alt={author.name}
        style={{ width: 40, height: 40, borderRadius: '50%' }}
      />
      <div>
        <strong>
          <a href={author.url} target="_blank" rel="noopener noreferrer">
            {author.name}
          </a>
        </strong>
        {author.title && (
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--ifm-color-content-secondary)' }}>
            {author.title}
          </p>
        )}
      </div>
    </div>
  );
}
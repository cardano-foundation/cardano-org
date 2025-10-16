import InsightsAuthorMeta from '@site/src/components/Layout/InsightsAuthorMeta';

export default function InsightsHeader({ title, date, author }) {
  return (
    <header className="margin-bottom--sm">
      <h1 className="margin-bottom--xs" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
        {title}
      </h1>
      <br />
    </header>
  );
}
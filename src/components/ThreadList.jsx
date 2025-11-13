import React from 'react';
import ThreadItem from './ThreadItem';

export default function ThreadList({ threads }) {
  if (!threads || threads.length === 0) {
    return <div className="card">Belum ada thread.</div>;
  }
  return (
    <div>
      {threads.map((t) => (
        <ThreadItem key={t.id} thread={t} />
      ))}
    </div>
  );
}

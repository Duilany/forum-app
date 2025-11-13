import React from 'react';
import VoteButtons from './VoteButtons';

export default function CommentItem({ comment, threadId }) {
  return (
    <div
      style={{
        borderLeft: '2px solid #e5e7eb',
        paddingLeft: 12,
        marginBottom: 12,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <strong>{comment.owner?.name ?? comment.owner ?? 'Unknown'}</strong>
          <div className="small-muted">
            {new Date(comment.createdAt || Date.now()).toLocaleString()}
          </div>
        </div>
        <div>
          <span className="small-muted">
            👍
            {comment.upVotesCount ?? 0}
          </span>
        </div>
      </div>
      <p style={{ marginTop: 8 }}>{comment.content}</p>
      <div style={{ marginTop: 6 }}>
        <VoteButtons commentId={comment.id} threadId={threadId} />
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaRegThumbsUp,
  FaRegThumbsDown,
  FaRegCommentDots,
  FaRegShareSquare,
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
  voteThread,
  optimisticVoteThread,
} from '../features/threads/threadsSlice';
import { postedAt } from '../utils';

export default function ThreadItem({ thread }) {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  if (!thread) return null;

  const {
    id,
    title = 'Untitled',
    body = '',
    category,
    createdAt,
    upVotesBy = [],
    downVotesBy = [],
    totalComments = 0,
    owner,
    user,
  } = thread;
  const userId = auth.user?.id;
  const isUpVoted = upVotesBy.includes(userId);
  const isDownVoted = downVotesBy.includes(userId);

  const handleVote = (type) => {
    dispatch(optimisticVoteThread({ threadId: id, userId, type }));
    dispatch(voteThread({ threadId: id, type }));
  };

  const ownerName = owner?.name || user?.name || 'unknown';
  const ownerAvatar = owner?.avatar || user?.avatar || null;
  const commentCount = totalComments || thread.comments?.length || 0;
  const timeAgo = createdAt ? postedAt(createdAt) : 'Waktu tidak diketahui';

  return (
    <div className="card mb-3 p-3 border rounded-lg shadow-sm">
      {category && (
        <div className="text-sm text-blue-600 font-medium mb-1">
          #
          {category}
        </div>
      )}

      <Link
        to={`/threads/${id}`}
        className="block text-lg font-semibold text-blue-700 hover:underline"
      >
        {title}
      </Link>

      <p className="text-gray-700 text-sm mt-1">
        {body.length > 180 ? `${body.slice(0, 180)}...` : body}
      </p>

      <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
        <div className="flex gap-4 items-center">
          <button
            type="button"
            onClick={() => handleVote(isUpVoted ? 'neutral' : 'up')}
            className={`flex items-center gap-1 ${
              isUpVoted ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <FaRegThumbsUp />
            {' '}
            {upVotesBy.length}
          </button>

          <button
            type="button"
            onClick={() => handleVote(isDownVoted ? 'neutral' : 'down')}
            className={`flex items-center gap-1 ${
              isDownVoted ? 'text-red-600' : 'text-gray-600'
            }`}
          >
            <FaRegThumbsDown />
            {' '}
            {downVotesBy.length}
          </button>

          <span className="flex items-center gap-1">
            <FaRegCommentDots />
            {' '}
            {commentCount}
          </span>
          <span className="flex items-center gap-1">
            <FaRegShareSquare />
            {' '}
            1
          </span>
        </div>

        <div className="flex items-center gap-2">
          {ownerAvatar && (
            <img
              src={ownerAvatar}
              alt={ownerName}
              className="w-6 h-6 rounded-full object-cover"
            />
          )}
          <div className="text-right">
            <span className="block text-gray-800 font-medium">{ownerName}</span>
            <span className="text-xs text-gray-500">{timeAgo}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

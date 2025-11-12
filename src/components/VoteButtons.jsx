import React from "react";
import { useDispatch } from "react-redux";
import { voteThread, voteComment } from "../features/threads/threadsSlice";

export default function VoteButtons({
  threadId,
  commentId,
  upVotesBy = [],
  downVotesBy = [],
  authUser,
}) {
  const dispatch = useDispatch();
  const isComment = !!commentId;

  const handleVote = (type) => {
    if (isComment) {
      dispatch(voteComment({ commentId, threadId, type }));
    } else {
      dispatch(voteThread({ threadId, type }));
    }
  };

  // Cek apakah user saat ini sudah vote
  const isUpVoted = upVotesBy.includes(authUser);
  const isDownVoted = downVotesBy.includes(authUser);

  return (
    <div className="flex items-center space-x-4 text-lg">
      {/* UPVOTE */}
      <button
        onClick={() => handleVote("up")}
        className={`flex items-center space-x-1 ${
          isUpVoted ? "text-blue-600 font-semibold" : "text-gray-700"
        } hover:text-blue-600 transition`}
      >
        <span role="img" aria-label="like">
          👍
        </span>
        <span>{upVotesBy.length}</span>
      </button>

      {/* DOWNVOTE */}
      <button
        onClick={() => handleVote("down")}
        className={`flex items-center space-x-1 ${
          isDownVoted ? "text-red-600 font-semibold" : "text-gray-700"
        } hover:text-red-600 transition`}
      >
        <span role="img" aria-label="dislike">
          👎
        </span>
        <span>{downVotesBy.length}</span>
      </button>
    </div>
  );
}

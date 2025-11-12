import api from '../../api/dicodingForumApi';

// Users
export const fetchUsersRequest = () => api.get('/users');

// Threads
export const fetchThreadsRequest = () => api.get('/threads');
export const fetchThreadDetailRequest = (id) => api.get(`/threads/${id}`);
export const createThreadRequest = (payload) => api.post('/threads', payload);

// Comments
export const addCommentRequest = (threadId, payload) => api.post(`/threads/${threadId}/comments`, payload);

// Votes (thread)
export const upVoteThreadRequest = (threadId) => api.post(`/threads/${threadId}/up-vote`);
export const downVoteThreadRequest = (threadId) => api.post(`/threads/${threadId}/down-vote`);
export const neutralVoteThreadRequest = (threadId) => api.post(`/threads/${threadId}/neutral-vote`);

// Votes (comment)
export const upVoteCommentRequest = (threadId, commentId) => api.post(`/threads/${threadId}/comments/${commentId}/up-vote`);
export const downVoteCommentRequest = (threadId, commentId) => api.post(`/threads/${threadId}/comments/${commentId}/down-vote`);
export const neutralVoteCommentRequest = (threadId, commentId) => api.post(`/threads/${threadId}/comments/${commentId}/neutral-vote`);

// Leaderboard
export const fetchLeaderboardRequest = async () => {
  const res = await api.get('/leaderboards');
  console.log('🔥 Leaderboard API response:', res.data);
  return res;
};

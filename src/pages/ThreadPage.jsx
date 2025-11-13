// src/pages/ThreadPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchThreadDetail } from '../features/threads/threadsSlice';
import ThreadDetail from '../components/ThreadDetail';
import LoadingIndicator from '../components/LoadingIndicator';

export default function ThreadPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current, loading, error } = useSelector((s) => s.threads);

  useEffect(() => {
    if (id) dispatch(fetchThreadDetail(id));
  }, [dispatch, id]);

  if (loading) return <LoadingIndicator />;
  if (error) {
    return (
      <p style={{ color: 'red' }}>
        Error:
        {error}
      </p>
    );
  }
  if (!current) return <p>Thread tidak ditemukan.</p>;

  return <ThreadDetail thread={current} />;
}

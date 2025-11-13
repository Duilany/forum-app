import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchThreads } from '../features/threads/threadsSlice';
import ThreadList from '../components/ThreadList';
import LoadingIndicator from '../components/LoadingIndicator';

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading, error } = useSelector((s) => s.threads);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchThreads());
  }, [dispatch]);

  const safeList = useMemo(() => (Array.isArray(list) ? list : []), [list]);
  const categories = useMemo(() => {
    const cats = new Set();
    safeList.forEach((t) => {
      if (t.category) cats.add(t.category);
    });
    return Array.from(cats);
  }, [safeList]);

  const filtered = filter === 'all' ? safeList : safeList.filter((t) => t.category === filter);

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Diskusi</h2>
        <button
          type="button"
          onClick={() => navigate('/threads/create')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Buat Thread
        </button>
      </div>

      <div className="card mb-4">
        <h2 className="text-lg font-semibold mb-3">Kategori populer</h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`tag ${filter === 'all' ? 'tag-active' : ''}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={`tag ${filter === c ? 'tag-active' : ''}`}
            >
              #
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        {loading && (
          <div className="flex justify-center py-6">
            <LoadingIndicator />
          </div>
        )}
        {!loading && error && (
          <div className="card text-red-600 text-center py-8">
            Gagal memuat thread:
            {' '}
            {error}
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="card text-center py-8 text-gray-500">
            Belum ada thread.
          </div>
        )}
        {!loading && !error && filtered.length > 0 && (
          <ThreadList threads={filtered} />
        )}
      </div>
    </div>
  );
}

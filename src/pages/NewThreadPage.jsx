import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createThread } from '../features/threads/threadsSlice';

export default function NewThreadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setErrorMessage('Harap login untuk membuat thread.');
      return;
    }

    try {
      const payload = { title, body, category };
      const res = await dispatch(createThread(payload));
      if (res.type === 'threads/createThread/fulfilled') {
        navigate('/');
      } else {
        setErrorMessage(
          res.payload || res.error?.message || 'Gagal membuat thread',
        );
      }
    } catch (err) {
      setErrorMessage('Terjadi kesalahan, silakan coba lagi.');
    }
  };

  return (
    <div className="card mx-auto p-6 max-w-lg rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Buat Thread Baru
      </h2>

      {errorMessage && (
        <div className="text-red-500 mb-4 text-center">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="title" className="block font-medium mb-1">
            Judul Thread
          </label>
          <input
            type="text"
            id="title"
            className="input w-full border rounded px-3 py-2"
            placeholder="Judul"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block font-medium mb-1">
            Kategori
          </label>
          <input
            type="text"
            id="category"
            className="input w-full border rounded px-3 py-2"
            placeholder="Kategori (mis. react)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="body" className="block font-medium mb-1">
            Isi Thread
          </label>
          <textarea
            id="body"
            className="input w-full border rounded px-3 py-2"
            placeholder="Tulis isi thread..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition"
        >
          Buat Thread
        </button>
      </form>
    </div>
  );
}

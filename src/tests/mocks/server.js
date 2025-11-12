/**
 * Skenario Pengujian: Mock Server (msw)
 * File ini menggunakan Mock Service Worker (MSW) untuk mensimulasikan API server.
 * Endpoint yang dimock:
 * 1. POST /login → Mengembalikan token dan data user fiktif.
 * 2. POST /logout → Mengembalikan status sukses (200).
 * 3. GET /threads → Mengembalikan daftar thread contoh.
 * 4. POST /threads → Menambahkan thread baru dengan data dari request body.
 * Tujuan: Mendukung pengujian asynchronous (thunk) tanpa memanggil server asli.
 */
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const baseURL = 'https://api.forum-app.test'; // contoh endpoint fiktif

export const handlers = [
  // Mock login endpoint
  rest.post(`${baseURL}/login`, (req, res, ctx) => res(
    ctx.status(200),
    ctx.json({
      token: 'mockToken123',
      user: { id: 'u1', name: 'Samuel' },
    }),
  )),

  // Mock logout endpoint
  rest.post(`${baseURL}/logout`, (req, res, ctx) => res(ctx.status(200))),

  // Mock get threads
  rest.get(`${baseURL}/threads`, (req, res, ctx) => res(
    ctx.status(200),
    ctx.json([{ id: '1', title: 'Thread Testing' }]),
  )),

  // Mock create thread
  rest.post(`${baseURL}/threads`, async (req, res, ctx) => {
    const data = await req.json();
    return res(ctx.status(201), ctx.json({ id: '2', ...data }));
  }),
];

export const server = setupServer(...handlers);

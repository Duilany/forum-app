import { setupServer } from "msw/node";
import { rest } from "msw";

const baseURL = "https://api.forum-app.test"; // contoh endpoint fiktif

export const handlers = [
  // Mock login endpoint
  rest.post(`${baseURL}/login`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        token: "mockToken123",
        user: { id: "u1", name: "Samuel" },
      })
    );
  }),

  // Mock logout endpoint
  rest.post(`${baseURL}/logout`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),

  // Mock get threads
  rest.get(`${baseURL}/threads`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([{ id: "1", title: "Thread Testing" }])
    );
  }),

  // Mock create thread
  rest.post(`${baseURL}/threads`, async (req, res, ctx) => {
    const data = await req.json();
    return res(ctx.status(201), ctx.json({ id: "2", ...data }));
  }),
];

export const server = setupServer(...handlers);

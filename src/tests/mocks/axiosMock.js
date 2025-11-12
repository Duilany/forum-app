import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios, { delayResponse: 100 });

// LOGIN
mock.onPost("/api/login").reply(200, {
  data: {
    token: "mockToken123",
  },
});

// GET OWN PROFILE
mock.onGet("/api/users/me").reply(200, {
  data: {
    user: { id: "u1", name: "Samuel" },
  },
});

// LOGOUT
mock.onPost("/api/logout").reply(200);

// GET THREADS
mock.onGet("/api/threads").reply(200, {
  data: {
    threads: [
      {
        id: "1",
        title: "Thread Testing",
        body: "Thread for unit testing",
        ownerId: "u1",
      },
    ],
  },
});

// ✅ TAMBAHKAN MOCK UNTUK /api/users
mock.onGet("/api/users").reply(200, {
  data: {
    users: [
      { id: "u1", name: "Samuel", email: "samuel@test.com" },
      { id: "u2", name: "Jane Doe", email: "jane@test.com" },
    ],
  },
});

// CREATE THREAD
mock.onPost("/api/threads").reply((config) => {
  const data = JSON.parse(config.data);
  return [
    201,
    {
      data: { id: "2", ...data },
    },
  ];
});

export default mock;

import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios, { delayResponse: 100 });

// LOGIN
mock.onPost("/login").reply(200, {
  data: {
    user: { id: "u1", name: "Samuel" },
    token: "mockToken123",
  },
});

// LOGOUT
mock.onPost("/logout").reply(200);

// GET PROFILE
mock.onGet("/users/me").reply(200, {
  data: {
    user: { id: "u1", name: "Samuel" },
  },
});

// GET THREADS
mock.onGet("/threads").reply(200, {
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

// CREATE THREAD
mock.onPost("/threads").reply((config) => {
  const data = JSON.parse(config.data);
  return [
    201,
    {
      data: { id: "2", ...data },
    },
  ];
});

// USERS LIST (opsional)
mock.onGet("/users").reply(200, {
  data: {
    users: [
      { id: "u1", name: "Samuel", email: "samuel@test.com" },
      { id: "u2", name: "Jane Doe", email: "jane@test.com" },
    ],
  },
});

export default mock;

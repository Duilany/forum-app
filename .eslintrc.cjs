module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true, // ✅ Tambahkan agar ESLint tahu kamu pakai Jest
  },
  extends: ["airbnb", "plugin:react/recommended"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "react-hooks", "jsx-a11y", "import"],
  rules: {
    // 🔧 Biarkan variabel / argumen dengan prefix "_" tidak dianggap unused
    "no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],

    // 🔧 Nonaktifkan kebutuhan import React (karena Vite + JSX modern)
    "react/react-in-jsx-scope": "off",

    // 🔧 Izinkan JSX di file .js dan .jsx
    "react/jsx-filename-extension": ["warn", { extensions: [".js", ".jsx"] }],

    // 🔧 Matikan aturan prop-types (karena kamu pakai fungsi modern & hooks)
    "react/prop-types": "off",

    // 🔧 Izinkan spread props (misalnya {...props})
    "react/jsx-props-no-spreading": "off",

    // ✅ Hooks wajib sesuai aturan
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // ⚙️ Tambahan: perbaikan error Redux Toolkit dan Axios
    "no-param-reassign": [
      "error",
      {
        props: true,
        ignorePropertyModificationsFor: ["state", "s", "config"],
      },
    ],

    // ⚙️ Matikan error prefer-default-export (boleh pakai named export)
    "import/prefer-default-export": "off",

    // ⚙️ Izinkan console.log (bisa kamu ubah ke "warn" kalau mau)
    "no-console": "off",
    // ✅ Nonaktifkan sementara label-has-associated-control
    "jsx-a11y/label-has-associated-control": "off",
  },

  // ✅ Tambahkan ini agar ESLint tahu setupTests.js boleh pakai devDependencies
  overrides: [
    {
      files: [
        "**/*.test.js",
        "**/*.test.jsx",
        "src/setupTests.js",
        "src/tests/mocks/**",
      ],
      rules: {
        "import/no-extraneous-dependencies": "off",
        "react/display-name": "off",
        "func-names": "off",
        "max-len": "off",
      },
    },
  ],

  settings: {
    react: {
      version: "detect",
    },
  },
};

const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyBt_xlI9y-DcATQ7wJt5VE8S3SEYVWAiWc",
  authDomain: "mern-blog-app-b5e49.firebaseapp.com",
  projectId: "mern-blog-app-b5e49",
  storageBucket: "mern-blog-app-b5e49.appspot.com",
  messagingSenderId: "933494149016",
  appId: "1:933494149016:web:a750d1e4e284d92b89e5ed",
  measurementId: "G-3XBGXNLXCC",
};

const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

module.exports = { storage };

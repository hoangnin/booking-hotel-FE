import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "@mantine/carousel/styles.css";
import store from "./store/store.js"; // Import Redux store
import { Provider } from "react-redux";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// Import i18n configuration
import "./i18n";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    {/* Ensure the entire app is wrapped in the Provider */}
    <App />
  </Provider>
);

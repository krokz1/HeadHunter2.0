import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { store } from "./store/store";
import "@mantine/core/styles.css";
import App from "./App.tsx";
import { VacancyPage } from "./pages/VacancyPage/VacancyPage.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider>
        <Router>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/vacancies" element={<App />} />
            <Route path="/vacancies/:id" element={<VacancyPage />} />
          </Routes>
        </Router>
      </MantineProvider>
    </Provider>
  </React.StrictMode>
);

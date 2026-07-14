import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { PrimeReactProvider } from "primereact/api";
import Tailwind from "primereact/passthrough/tailwind";
import { loader } from '@monaco-editor/react';

import "./Asset/css/index.css";
import "./Asset/css/fonts.css";

import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";
import "primeicons/primeicons.css";

loader.config({ paths: { vs: '/monaco-editor/min/vs' } });


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrimeReactProvider
      value={{
        unstyled: true,
        pt: Tailwind,
      }}
    >
      <App />
    </PrimeReactProvider>
  </StrictMode>
);

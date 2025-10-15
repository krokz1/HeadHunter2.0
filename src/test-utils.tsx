import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import vacanciesReducer from "./store/slices/vacanciesSlice";

class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

class IntersectionObserverMock {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: readonly number[] = [];
  callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

global.ResizeObserver = ResizeObserverMock;
global.IntersectionObserver = IntersectionObserverMock;

vi.mock("../services/api", () => ({
  fetchVacanciesAPI: vi.fn(() =>
    Promise.resolve({
      items: [],
      found: 0,
      pages: 0,
    })
  ),
}));

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  store?: any;
}

const createMockStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      vacancies: vacanciesReducer,
    },
    preloadedState: {
      vacancies: {
        items: [],
        loading: false,
        error: null,
        total: 0,
        page: 1,
        searchParams: {},
        ...preloadedState,
      },
    },
  });
};

function AllTheProviders({
  children,
  store,
}: {
  children: React.ReactNode;
  store?: any;
}) {
  const testStore = store || createMockStore();

  return (
    <Provider store={testStore}>
      <MantineProvider>{children}</MantineProvider>
    </Provider>
  );
}

const customRender = (ui: ReactElement, options?: ExtendedRenderOptions) => {
  const { store, ...renderOptions } = options || {};

  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders store={store}>{children}</AllTheProviders>
    ),
    ...renderOptions,
  });
};

export * from "@testing-library/react";
export { customRender as render, createMockStore };

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

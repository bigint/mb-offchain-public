import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Button } from "@/components/ui/button";
import {
  createConfig,
  fallback,
  http,
  injected,
  unstable_connector,
  WagmiProvider,
} from "wagmi";
import { base, mainnet } from "viem/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const wagmiConfig = createConfig({
  chains: [mainnet, base],
  connectors: [injected({ shimDisconnect: true })],
  transports: {
    [mainnet.id]: fallback([
      unstable_connector(injected, { key: "injected", name: "Injected" }),
      http("https://eth.drpc.org"),
      http(undefined, { retryCount: 5, retryDelay: 500 }),
    ]),
    [base.id]: fallback([
      unstable_connector(injected, { key: "injected", name: "Injected" }),
      http("https://base.drpc.org"),
      http(undefined, { retryCount: 5, retryDelay: 500 }),
    ]),
  },
});

const queryClient = new QueryClient();

function App() {
  const [count, setCount] = useState(0);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <Button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </Button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}

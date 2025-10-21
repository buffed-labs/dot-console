import acalaChainSpec from "./chain-specs/acala.json" with { type: "json" };
import hydrationChainSpec from "./chain-specs/hydration.json" with { type: "json" };
import type {
  Polkadot,
  Acala,
  Hydration,
  Kusama,
  Kusama_asset_hub,
  Kusama_people,
  Paseo,
  Paseo_asset_hub,
  Paseo_people,
  Polkadot_asset_hub,
  Polkadot_collectives,
  Polkadot_coretime,
  Polkadot_people,
  Westend,
  Westend_asset_hub,
  Westend_collectives,
  Westend_people,
} from "@polkadot-api/descriptors";
import { defineConfig, unsafeDescriptor } from "@reactive-dot/core";
import { createLightClientProvider } from "@reactive-dot/core/providers/light-client.js";
import { InjectedWalletProvider } from "@reactive-dot/core/wallets.js";
import { LedgerWallet } from "@reactive-dot/wallet-ledger";
import { MimirWalletProvider } from "@reactive-dot/wallet-mimir";
import { WalletConnect } from "@reactive-dot/wallet-walletconnect";

const lightClientProvider = createLightClientProvider();

const polkadotProvider = lightClientProvider.addRelayChain({ id: "polkadot" });

const kusamaProvider = lightClientProvider.addRelayChain({ id: "kusama" });

const paseoProvider = lightClientProvider.addRelayChain({ id: "paseo" });

const westendProvider = lightClientProvider.addRelayChain({ id: "westend" });

export const config = defineConfig({
  chains: {
    polkadot: {
      descriptor: unsafeDescriptor<Polkadot>(),
      provider: polkadotProvider,
    },
    polkadot_asset_hub: {
      descriptor: unsafeDescriptor<Polkadot_asset_hub>(),
      provider: polkadotProvider.addParachain({ id: "polkadot_asset_hub" }),
    },
    polkadot_collectives: {
      descriptor: unsafeDescriptor<Polkadot_collectives>(),
      provider: polkadotProvider.addParachain({ id: "polkadot_collectives" }),
    },
    polkadot_coretime: {
      descriptor: unsafeDescriptor<Polkadot_coretime>(),
      provider: polkadotProvider.addParachain({ id: "polkadot_coretime" }),
    },
    polkadot_people: {
      descriptor: unsafeDescriptor<Polkadot_people>(),
      provider: polkadotProvider.addParachain({ id: "polkadot_people" }),
    },
    acala: {
      descriptor: unsafeDescriptor<Acala>(),
      provider: polkadotProvider.addParachain({
        chainSpec: JSON.stringify(acalaChainSpec),
      }),
    },
    hydration: {
      descriptor: unsafeDescriptor<Hydration>(),
      provider: polkadotProvider.addParachain({
        chainSpec: JSON.stringify(hydrationChainSpec),
      }),
    },
    kusama: {
      descriptor: unsafeDescriptor<Kusama>(),
      provider: kusamaProvider,
    },
    kusama_asset_hub: {
      descriptor: unsafeDescriptor<Kusama_asset_hub>(),
      provider: kusamaProvider.addParachain({ id: "kusama_asset_hub" }),
    },
    kusama_people: {
      descriptor: unsafeDescriptor<Kusama_people>(),
      provider: kusamaProvider.addParachain({ id: "kusama_people" }),
    },
    paseo: {
      descriptor: unsafeDescriptor<Paseo>(),
      provider: paseoProvider,
    },
    paseo_asset_hub: {
      descriptor: unsafeDescriptor<Paseo_asset_hub>(),
      provider: paseoProvider.addParachain({ id: "paseo_asset_hub" }),
    },
    paseo_people: {
      descriptor: unsafeDescriptor<Paseo_people>(),
      provider: paseoProvider.addParachain({ id: "paseo_people" }),
    },
    westend: {
      descriptor: unsafeDescriptor<Westend>(),
      provider: westendProvider,
    },
    westend_asset_hub: {
      descriptor: unsafeDescriptor<Westend_asset_hub>(),
      provider: westendProvider.addParachain({ id: "westend_asset_hub" }),
    },
    westend_people: {
      descriptor: unsafeDescriptor<Westend_people>(),
      provider: westendProvider.addParachain({ id: "westend_people" }),
    },
    westend_collectives: {
      descriptor: unsafeDescriptor<Westend_collectives>(),
      provider: westendProvider.addParachain({ id: "westend_collectives" }),
    },
  },
  targetChains: ["polkadot"],
  wallets: [
    new InjectedWalletProvider(),
    new MimirWalletProvider(),
    new LedgerWallet(),
    new WalletConnect({
      projectId: import.meta.env.VITE_APP_WALLET_CONNECT_PROJECT_ID,
      providerOptions: {
        metadata: {
          name: "ĐÓTConsole",
          description: "Substrate development console.",
          url: globalThis.origin,
          icons: ["/logo.png"],
        },
      },
      chainIds: [
        "polkadot:91b171bb158e2d3848fa23a9f1c25182", // Polkadot
      ],
      optionalChainIds: [
        "polkadot:91b171bb158e2d3848fa23a9f1c25182", // Polkadot
        "polkadot:b0a8d493285c2df73290dfb7e61f870f", // Kusama
        "polkadot:77afd6190f1554ad45fd0d31aee62aac", // Paseo
        "polkadot:e143f23803ac50e8f6f8e62695d1ce9e", // Westend
      ],
    }),
  ],
});

declare module "@reactive-dot/core" {
  export interface Register {
    config: typeof config;
  }
}

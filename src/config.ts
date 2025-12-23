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
import { PolkadotVaultWallet } from "@reactive-dot/wallet-polkadot-vault";
import { ReadonlyWallet } from "@reactive-dot/wallet-readonly";
import { WalletConnect } from "@reactive-dot/wallet-walletconnect";
import { registerDotConnect } from "dot-connect";
import type { ChainDefinition } from "polkadot-api";
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat";
import { getWsProvider } from "polkadot-api/ws-provider";

const lightClientProvider = createLightClientProvider();

const polkadotProvider = lightClientProvider.addRelayChain({ id: "polkadot" });

const kusamaProvider = lightClientProvider.addRelayChain({ id: "kusama" });

const paseoProvider = lightClientProvider.addRelayChain({ id: "paseo" });

const westendProvider = lightClientProvider.addRelayChain({ id: "westend" });

export const initCustomRpcEndpoint =
  globalThis.sessionStorage.getItem("customRpcEndpoint");

const useLightClient =
  globalThis.localStorage.getItem("dot-console/use-light-client") === "true";

export const config = defineConfig({
  chains: {
    polkadot: {
      descriptor: unsafeDescriptor<Polkadot>(),
      provider: useLightClient
        ? polkadotProvider
        : getWsProvider([
            "wss://polkadot-rpc.publicnode.com",
            "wss://polkadot-public-rpc.blockops.network/ws",
            "wss://polkadot-rpc.dwellir.com",
            "wss://polkadot.dotters.network",
            "wss://rpc-polkadot.luckyfriday.io",
            "wss://polkadot.api.onfinality.io/public-ws",
            "wss://polkadot-rpc.polkadot.io",
            "wss://rockx-dot.w3node.com/polka-public-dot/ws",
            "wss://dot-rpc.stakeworld.io",
            "wss://polkadot.rpc.subquery.network/public/ws",
          ]),
    },
    polkadot_asset_hub: {
      descriptor: unsafeDescriptor<Polkadot_asset_hub>(),
      provider: useLightClient
        ? polkadotProvider.addParachain({ id: "polkadot_asset_hub" })
        : withPolkadotSdkCompat(
            getWsProvider([
              "wss://asset-hub-polkadot-rpc.dwellir.com",
              "wss://sys.ibp.network/asset-hub-polkadot",
              "wss://asset-hub-polkadot.dotters.network",
              "wss://rpc-asset-hub-polkadot.luckyfriday.io",
              "wss://statemint.api.onfinality.io/public-ws",
              "wss://polkadot-asset-hub-rpc.polkadot.io",
              "wss://statemint.public.curie.radiumblock.co/ws",
              "wss://dot-rpc.stakeworld.io/assethub",
            ]),
          ),
    },
    polkadot_collectives: {
      descriptor: unsafeDescriptor<Polkadot_collectives>(),
      provider: useLightClient
        ? polkadotProvider.addParachain({ id: "polkadot_collectives" })
        : withPolkadotSdkCompat(
            getWsProvider([
              "wss://collectives-polkadot-rpc.dwellir.com",
              "wss://sys.ibp.network/collectives-polkadot",
              "wss://collectives-polkadot.dotters.network",
              "wss://rpc-collectives-polkadot.luckyfriday.io",
              "wss://collectives.api.onfinality.io/public-ws",
              "wss://polkadot-collectives-rpc.polkadot.io",
              "wss://collectives.public.curie.radiumblock.co/ws",
              "wss://dot-rpc.stakeworld.io/collectives",
            ]),
          ),
    },
    polkadot_coretime: {
      descriptor: unsafeDescriptor<Polkadot_coretime>(),
      provider: useLightClient
        ? polkadotProvider.addParachain({ id: "polkadot_coretime" })
        : withPolkadotSdkCompat(
            getWsProvider([
              "wss://coretime-polkadot.dotters.network",
              "wss://polkadot-coretime-rpc.polkadot.io",
            ]),
          ),
    },
    polkadot_people: {
      descriptor: unsafeDescriptor<Polkadot_people>(),
      provider: useLightClient
        ? polkadotProvider.addParachain({ id: "polkadot_people" })
        : withPolkadotSdkCompat(
            getWsProvider([
              "wss://sys.ibp.network/people-polkadot",
              "wss://people-polkadot.dotters.network",
              "wss://rpc-people-polkadot.luckyfriday.io",
              "wss://polkadot-people-rpc.polkadot.io",
              "wss://people-polkadot.public.curie.radiumblock.co/ws",
            ]),
          ),
    },
    acala: {
      descriptor: unsafeDescriptor<Acala>(),
      provider: useLightClient
        ? polkadotProvider.addParachain({
            chainSpec: JSON.stringify(acalaChainSpec),
          })
        : withPolkadotSdkCompat(
            getWsProvider([
              "wss://acala-rpc.dwellir.com",
              "wss://acala-polkadot.api.onfinality.io/public-ws",
            ]),
          ),
    },
    hydration: {
      descriptor: unsafeDescriptor<Hydration>(),
      provider: useLightClient
        ? polkadotProvider.addParachain({
            chainSpec: JSON.stringify(hydrationChainSpec),
          })
        : withPolkadotSdkCompat(
            getWsProvider([
              "wss://hydradx-rpc.dwellir.com",
              "wss://rpc.hydradx.cloud",
              "wss://rpc.helikon.io/hydradx",
              "wss://hydradx.paras.ibp.network",
              "wss://hydration.dotters.network",
            ]),
          ),
    },
    kusama: {
      descriptor: unsafeDescriptor<Kusama>(),
      provider: useLightClient
        ? kusamaProvider
        : getWsProvider([
            "wss://kusama-rpc.publicnode.com",
            "wss://kusama-rpc.dwellir.com",
            "wss://kusama-rpc-tn.dwellir.com",
            "wss://rpc.ibp.network/kusama",
            "wss://kusama.dotters.network",
            "wss://rpc-kusama.luckyfriday.io",
            "wss://kusama.api.onfinality.io/public-ws",
            "wss://rockx-ksm.w3node.com/polka-public-ksm/ws",
            "wss://ksm-rpc.stakeworld.io",
            "wss://kusama.rpc.subquery.network/public/ws",
          ]),
    },
    kusama_asset_hub: {
      descriptor: unsafeDescriptor<Kusama_asset_hub>(),
      provider: useLightClient
        ? kusamaProvider.addParachain({ id: "kusama_asset_hub" })
        : withPolkadotSdkCompat(
            getWsProvider([
              "wss://asset-hub-kusama-rpc.dwellir.com",
              "wss://sys.ibp.network/statemine",
              "wss://asset-hub-kusama.dotters.network",
              "wss://rpc-asset-hub-kusama.luckyfriday.io",
              "wss://kusama-asset-hub-rpc.polkadot.io",
              "wss://statemine.public.curie.radiumblock.co/ws",
              "wss://ksm-rpc.stakeworld.io/assethub",
            ]),
          ),
    },
    kusama_people: {
      descriptor: unsafeDescriptor<Kusama_people>(),
      provider: useLightClient
        ? kusamaProvider.addParachain({ id: "kusama_people" })
        : withPolkadotSdkCompat(
            getWsProvider([
              "wss://people-kusama-rpc.dwellir.com",
              "wss://sys.ibp.network/people-kusama",
              "wss://people-kusama.dotters.network",
              "wss://rpc-people-kusama.luckyfriday.io",
              "wss://kusama-people-rpc.polkadot.io",
              "wss://ksm-rpc.stakeworld.io/people",
            ]),
          ),
    },
    paseo: {
      descriptor: unsafeDescriptor<Paseo>(),
      provider: useLightClient
        ? paseoProvider
        : getWsProvider([
            "wss://paseo.rpc.amforc.com",
            "wss://paseo-rpc.dwellir.com",
            "wss://rpc.ibp.network/paseo",
            "wss://paseo.dotters.network",
            "wss://pas-rpc.stakeworld.io",
          ]),
    },
    paseo_asset_hub: {
      descriptor: unsafeDescriptor<Paseo_asset_hub>(),
      provider: useLightClient
        ? paseoProvider.addParachain({ id: "paseo_asset_hub" })
        : withPolkadotSdkCompat(
            getWsProvider([
              "wss://asset-hub-paseo-rpc.dwellir.com",
              "wss://sys.ibp.network/asset-hub-paseo",
              "wss://asset-hub-paseo.dotters.network",
              "wss://pas-rpc.stakeworld.io/assethub",
              "wss://sys.turboflakes.io/asset-hub-paseo",
            ]),
          ),
    },
    paseo_people: {
      descriptor: unsafeDescriptor<Paseo_people>(),
      provider: useLightClient
        ? paseoProvider.addParachain({ id: "paseo_people" })
        : withPolkadotSdkCompat(
            getWsProvider([
              "wss://asset-hub-paseo-rpc.dwellir.com",
              "wss://sys.ibp.network/asset-hub-paseo",
              "wss://asset-hub-paseo.dotters.network",
              "wss://pas-rpc.stakeworld.io/assethub",
              "wss://sys.turboflakes.io/asset-hub-paseo",
            ]),
          ),
    },
    westend: {
      descriptor: unsafeDescriptor<Westend>(),
      provider: useLightClient
        ? westendProvider
        : getWsProvider([
            "wss://westend-rpc.dwellir.com",
            "wss://westend-rpc-tn.dwellir.com",
            "wss://rpc.ibp.network/westend",
            "wss://westend.dotters.network",
            "wss://westend.api.onfinality.io/public-ws",
            "wss://westend-rpc.polkadot.io",
            "wss://westend.public.curie.radiumblock.co/ws",
          ]),
    },
    westend_asset_hub: {
      descriptor: unsafeDescriptor<Westend_asset_hub>(),
      provider: useLightClient
        ? westendProvider.addParachain({ id: "westend_asset_hub" })
        : withPolkadotSdkCompat(
            getWsProvider([
              "wss://asset-hub-westend-rpc.dwellir.com",
              "wss://sys.ibp.network/westmint",
              "wss://asset-hub-westend.dotters.network",
              "wss://westend-asset-hub-rpc.polkadot.io",
            ]),
          ),
    },
    westend_people: {
      descriptor: unsafeDescriptor<Westend_people>(),
      provider: useLightClient
        ? westendProvider.addParachain({ id: "westend_people" })
        : withPolkadotSdkCompat(
            getWsProvider([
              "wss://westend-rpc.dwellir.com",
              "wss://westend-rpc-tn.dwellir.com",
              "wss://rpc.ibp.network/westend",
              "wss://westend.dotters.network",
              "wss://westend.api.onfinality.io/public-ws",
              "wss://westend-rpc.polkadot.io",
              "wss://westend.public.curie.radiumblock.co/ws",
            ]),
          ),
    },
    westend_collectives: {
      descriptor: unsafeDescriptor<Westend_collectives>(),
      provider: useLightClient
        ? westendProvider.addParachain({ id: "westend_collectives" })
        : withPolkadotSdkCompat(
            getWsProvider([
              "wss://westend-rpc.dwellir.com",
              "wss://westend-rpc-tn.dwellir.com",
              "wss://rpc.ibp.network/westend",
              "wss://westend.dotters.network",
              "wss://westend.api.onfinality.io/public-ws",
              "wss://westend-rpc.polkadot.io",
              "wss://westend.public.curie.radiumblock.co/ws",
            ]),
          ),
    },
    custom: {
      descriptor: unsafeDescriptor<ChainDefinition>(),
      provider: () =>
        withPolkadotSdkCompat(getWsProvider(initCustomRpcEndpoint!)),
    },
  },
  targetChains: ["polkadot_asset_hub"],
  wallets: [
    new InjectedWalletProvider(),
    new MimirWalletProvider(),
    new LedgerWallet(),
    new PolkadotVaultWallet(),
    new ReadonlyWallet(),
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

registerDotConnect(config);

import { defineConfig } from "@pandacss/dev";
import { animationStyles } from "./src/theme/animation-styles";
import { amber } from "./src/theme/colors/amber";
import { blue } from "./src/theme/colors/blue";
import { crimson } from "./src/theme/colors/crimson";
import { green } from "./src/theme/colors/green";
import { neutral } from "./src/theme/colors/neutral";
import { red } from "./src/theme/colors/red";
import { violet } from "./src/theme/colors/violet";
import { yellow } from "./src/theme/colors/yellow";
import { conditions } from "./src/theme/conditions";
import { globalCss } from "./src/theme/global-css";
import { keyframes } from "./src/theme/keyframes";
import { layerStyles } from "./src/theme/layer-styles";
import { recipes, slotRecipes } from "./src/theme/recipes";
import { textStyles } from "./src/theme/text-styles";
import { colors } from "./src/theme/tokens/colors";
import { durations } from "./src/theme/tokens/durations";
import { shadows } from "./src/theme/tokens/shadows";
import { zIndex } from "./src/theme/tokens/z-index";

export default defineConfig({
  preflight: true,
  presets: ["@pandacss/preset-base", "@pandacss/preset-panda"],
  globalCss,
  conditions,
  theme: {
    extend: {
      animationStyles,
      recipes: {
        ...recipes,
        spinner: {
          ...recipes.spinner,
          variants: {
            ...recipes.spinner?.variants,
            size: {
              ...recipes.spinner?.variants?.size,
              text: { "--size": "min(1lh, 1em)" },
            },
          },
        },
      },
      slotRecipes,
      keyframes,
      layerStyles,
      textStyles,
      tokens: {
        colors,
        durations,
        zIndex,
      },
      semanticTokens: {
        colors: {
          crimson,
          neutral,
          gray: neutral,
          amber,
          blue,
          green,
          red,
          violet,
          yellow,
          success: green,
          info: blue,
          warning: amber,
          error: red,
          fg: {
            default: {
              value: { _light: "{colors.gray.12}", _dark: "{colors.gray.12}" },
            },
            muted: {
              value: { _light: "{colors.gray.11}", _dark: "{colors.gray.11}" },
            },
            subtle: {
              value: { _light: "{colors.gray.10}", _dark: "{colors.gray.10}" },
            },
          },
          canvas: {
            value: { _light: "{colors.gray.1}", _dark: "{colors.gray.1}" },
          },
          border: {
            value: { _light: "{colors.gray.4}", _dark: "{colors.gray.4}" },
          },
          bg: {
            subtle: {
              value: { _light: "{colors.gray.2}", _dark: "{colors.gray.3}" },
            },
          },
        },
        shadows,
        radii: {
          l1: { value: "{radii.xl}" },
          l2: { value: "{radii.2xl}" },
          l3: { value: "{radii.2xl}" },
        },
      },
    },
  },
  staticCss: {
    css: [
      {
        properties: {
          colorPalette: [
            "success",
            "info",
            "warning",
            "error",
            "violet",
            "red",
            "green",
            "blue",
            "yellow",
            "amber",
            "crimson",
            "neutral",
          ],
        },
      },
    ],
    recipes: {
      spinner: [{ size: ["text"] }],
    },
  },
  include: ["./src/**/*.{js,jsx,ts,tsx}"],
  jsxFramework: "react",
  outdir: "styled-system",
});

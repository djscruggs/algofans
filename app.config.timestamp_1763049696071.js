// app.config.ts
import { defineConfig } from "@tanstack/start/config";
import viteTsConfigPaths from "vite-tsconfig-paths";
var app_config_default = defineConfig({
  vite: {
    plugins: [
      viteTsConfigPaths({
        projects: ["./tsconfig.json"]
      })
    ]
  },
  server: {
    preset: "node-server"
  },
  routers: {
    ssr: {
      entry: "./app/router.tsx"
    }
  }
});
export {
  app_config_default as default
};

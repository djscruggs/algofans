import { defineConfig } from '@tanstack/start/config'
import { createFileRoute as createTsrFileRoute, createRoute as createTsrRoute } from '@tanstack/react-router'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  vite: {
    plugins: [
      viteTsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
    ],
  },
  server: {
    preset: 'node-server',
  },
  routers: {
    ssr: {
      entry: './app/router.tsx',
    },
  },
})

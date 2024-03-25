import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "shadcn/components": path.resolve(__dirname, "./shadcn/components/ui"),
      "shadcn/lib": path.resolve(__dirname, "./shadcn/lib.ts"),
    },
  },
})

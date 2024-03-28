import { defineConfig, loadEnv } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default () => {
  return defineConfig({
    server: {
      https: {},
    },
    plugins: [
      basicSsl({
        /** name of certification */
        name: "test",
        /** custom trust domains */
        domains: ["*.custom.com"],
        /** custom certification directory */
        certDir: "~/.devServer/cert",
      }),
    ],
  });
};

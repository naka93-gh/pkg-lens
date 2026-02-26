import type { ElectronApi } from "./index";

declare global {
  interface Window {
    electronApi: ElectronApi;
  }
}

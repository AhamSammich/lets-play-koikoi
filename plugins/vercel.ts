import { inject } from "@vercel/analytics";

export default defineNuxtPlugin((NuxtApp) => {
  inject();
});

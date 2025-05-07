import { createApp, defineAsyncComponent } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import { GraffitiLocal } from "@graffiti-garden/implementation-local";
import { GraffitiRemote } from "@graffiti-garden/implementation-remote";
import { GraffitiPlugin } from "@graffiti-garden/wrapper-vue";
import { Login } from "./pages/login.js";
import { Home } from "./pages/home.js";
import { Profile } from "./pages/profile.js";
import { Topbar } from "./components/topbar.js";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", component: Login },
    { path: "/home", component: Home },
    { path: "/profile/:user", component: Profile },
    { path: "/:pathMatch(.*)*", redirect: "/home" },
  ],
});

createApp({
  components: {
    Topbar: defineAsyncComponent(Topbar),
    Login: defineAsyncComponent(Login),
  },
})
  .use(GraffitiPlugin, {
    // graffiti: new GraffitiLocal(),
    graffiti: new GraffitiRemote(),
  })
  .use(router)
  .mount("#app");

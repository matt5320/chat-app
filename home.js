import { defineAsyncComponent } from "vue";
import { Topbar } from "./topbar.js";
import { ChatList } from "./chat-list.js";
import { Messenger } from "./messenger.js";

export async function Home() {
  return {
    components: {
      Topbar: defineAsyncComponent(Topbar),
      ChatList: defineAsyncComponent(ChatList),
      Messenger: defineAsyncComponent(Messenger),
    },
    template: await fetch("./home.html").then((r) => r.text()),
    mounted() {
      if (!this.$graffitiSession.value) {
        this.$router.push("/");
      }
    },
  };
}

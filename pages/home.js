import { defineAsyncComponent } from "vue";
import { ChatList } from "../components/chat-list.js";
import { Messenger } from "../components/messenger.js";

export async function Home() {
  return {
    components: {
      ChatList: defineAsyncComponent(ChatList),
      Messenger: defineAsyncComponent(Messenger),
    },
    template: await fetch("./pages/home.html").then((r) => r.text()),
    mounted() {
      if (!this.$graffitiSession.value) {
        this.$router.push("/");
      }
    },
  };
}

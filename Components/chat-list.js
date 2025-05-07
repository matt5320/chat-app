import { defineAsyncComponent } from "vue";
import { Chat } from "./chat.js";

export async function ChatList() {
  return {
    data() {
      return {
        channels: ["designftw"],
      };
    },
    components: { Chat: defineAsyncComponent(Chat) },
    methods: {
      async createGroupChat(session) {
        await this.$graffiti.put(
          {
            value: {
              activity: "Create",
              object: {
                type: "Group Chat",
                name: "My Group Chat", // Make this editable
                channel: crypto.randomUUID(), // This creates a random string
              },
            },
            channels: ["designftw"],
          },
          session
        );
      },
    },
    template: await fetch("./components/chat-list.html").then((r) => r.text()),
  };
}

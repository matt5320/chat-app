import { defineAsyncComponent } from "vue";
import { Chat } from "./chat.js";

export async function ChatList() {
  return {
    components: { Chat: defineAsyncComponent(Chat) },
    methods: {
      async createConversation() {
        const actor = prompt("Actor URI:");
        if (actor === null) return;
        await this.$graffiti.put(
          {
            value: {
              activity: "Create",
              object: {
                type: "Conversation",
                actors: [this.$graffitiSession.value.actor, actor],
              },
            },
            channels: [this.$graffitiSession.value.actor, actor],
            allowed: [this.$graffitiSession.value.actor, actor],
          },
          this.$graffitiSession.value
        );
      },
    },
    template: await fetch("./chat-list.html").then((r) => r.text()),
  };
}

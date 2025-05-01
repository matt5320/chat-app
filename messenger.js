import { gc } from "./group-chat.js";

export async function Messenger() {
  return {
    data() {
      return {
        sending: false,
        message: "",
      };
    },
    template: await fetch("./messenger.html").then((r) => r.text()),
    methods: {
      self(object, session) {
        return object.actor === session.value.actor ? " self" : "";
      },
      async sendMessage(session) {
        if (!this.message) return;

        this.sending = true;

        await this.$graffiti.put(
          {
            value: {
              content: this.message,
              published: Date.now(),
            },
            channels: [gc.channel],
          },
          session
        );

        this.sending = false;
        this.message = "";

        // Refocus the input field after sending the message
        await this.$nextTick();
        this.$refs.messageInput.focus();
        document.querySelector(".messages-container").scroll(0, 0);
      },
      async changeGCName(session) {
        const name = prompt("New name:");

        if (name === "") return;

        await this.$graffiti.patch(
          {
            value: [
              {
                op: "replace",
                path: "/object/name",
                value: name,
              },
            ],
          },
          gc.url,
          session
        );
      },
    },
    computed: {
      getGC() {
        return gc;
      },
    },
  };
}

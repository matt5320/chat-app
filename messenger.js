import { convo } from "./conversation.js";

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
              conversation: convo.url,
            },
            channels: [...convo.otherActors, this.$graffitiSession.value.actor],
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
      getProfileNames(profiles) {
        if (!convo.otherActors) return [];
        return convo.otherActors.map((actor) => {
          for (const profile of profiles) {
            if (profile.value.describes === actor) return profile.value.name;
          }
          return actor;
        });
      },
    },
    computed: {
      getConvo() {
        return convo;
      },
    },
  };
}

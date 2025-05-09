import { convo } from "./conversation.js";

export async function Chat() {
  return {
    data() {
      return {
        otherActors: this.chat.value.object.actors.filter(
          (actor) => actor !== this.$graffitiSession.value.actor
        ),
      };
    },
    props: ["chat"],
    methods: {
      selectConversation() {
        convo.otherActors = this.otherActors;
        convo.url = this.chat.url;
      },
      getLastMessage(objects) {
        return objects
          .toSorted((a, b) => a.value.published - b.value.published)
          .pop()?.value.content;
      },
      getProfileNames(profiles) {
        return this.otherActors.map((actor) => {
          for (const profile of profiles) {
            if (profile.value.describes === actor) return profile.value.name;
          }
          return actor;
        });
      },
    },
    computed: {
      selected() {
        if (!convo.otherActors) return false;

        return (
          convo.otherActors.filter((actor) => !this.otherActors.includes(actor))
            .length === 0
        );
      },
    },
    template: await fetch("./chat.html").then((r) => r.text()),
  };
}

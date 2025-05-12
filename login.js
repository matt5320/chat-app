import { convo } from "./conversation.js";

export async function Login() {
  return {
    methods: {
      async login() {
        this.$graffiti.login();
      },
      async createProfile() {
        const profileIterator = await this.$graffiti.discover(
          ["designftw-2025-studio2", "designftw"],
          {
            properties: {
              value: {
                required: ["generator", "describes", "name", "pronouns", "bio"],
                properties: {
                  generator: { type: "string" },
                  describes: {
                    type: "string",
                    const: this.$graffitiSession.value.actor,
                  },
                  name: { type: "string" },
                  pronouns: { type: "string" },
                  bio: { type: "string" },
                },
              },
            },
          }
        );

        let profileObj = {};
        for await (const profile of profileIterator) {
          profileObj = { ...profile.object };
        }
        if (Object.keys(profileObj).length > 0) {
          return;
        }

        await this.$graffiti.put(
          {
            value: {
              generator: "https://matt5320.github.io/chat-app/",
              describes: this.$graffitiSession.value.actor,
              name: this.$graffitiSession.value.actor,
              pronouns: "",
              bio: "",
            },
            channels: ["designftw-2025-studio2", "designftw"],
          },
          this.$graffitiSession.value
        );
      },
    },
    watch: {
      "$graffitiSession.value"(newSession, oldSession) {
        if (Object.hasOwn(newSession, "actor")) {
          this.createProfile().then(() => {
            this.$router.push("/home");
          });
        }
      },
    },
    mounted() {
      for (const key in convo) {
        delete convo[key];
      }
    },
    template: await fetch("./login.html").then((r) => r.text()),
  };
}

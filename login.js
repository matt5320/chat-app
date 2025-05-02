export async function Login() {
  return {
    methods: {
      async login(session) {
        this.$graffiti.login();
        this.createProfile(session);
        this.$router.push("/home");
      },
      async createProfile(session) {
        const profileIterator = await this.$graffiti.discover(
          ["designftw-2025-studio1", "designftw"],
          {
            properties: {
              value: {
                required: ["generator", "describes", "name", "pronouns", "bio"],
                properties: {
                  generator: { type: "string" },
                  describes: { type: "string", const: session.value.actor },
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
        if (Object.keys(profileObj).length > 0) return;

        await this.$graffiti.put(
          {
            value: {
              generator: "https://matt5320.github.io/chat-app/",
              describes: session.value.actor,
              name: session.value.actor,
              pronouns: "she/her",
              bio: "bio here...",
            },
            channels: ["designftw-2025-studio1", "designftw"],
          },
          session
        );
      },
    },
    template: await fetch("./login.html").then((r) => r.text()),
    mounted() {
      if (this.$graffitiSession.value) {
        this.$graffiti.logout(this.$graffitiSession.value);
      }
    },
  };
}

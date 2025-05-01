import { defineAsyncComponent } from "vue";
import { Topbar } from "./topbar.js";
export async function Profile() {
  return {
    data() {
      return {
        name: "user",
        pronouns: "she/her",
        friends: [],
        schedule: "busy at work :/",
        bio: "",
      };
    },
    components: {
      Topbar: defineAsyncComponent(Topbar),
    },
    methods: {
      async editProfile(url, session) {
        const name = prompt("Name:");
        const pronouns = prompt("Pronouns:");
        const bio = prompt("Bio:");

        await this.$graffiti.patch(
          {
            value: [
              {
                op: "replace",
                path: "/name",
                value: name,
              },
              {
                op: "replace",
                path: "/pronouns",
                value: pronouns,
              },
              {
                op: "replace",
                path: "/bio",
                value: bio,
              },
            ],
          },
          url,
          session
        );
      },
    },
    template: await fetch("./profile.html").then((r) => r.text()),
    mounted() {
      if (!this.$graffitiSession.value) {
        this.$router.push("/");
      }
    },
  };
}

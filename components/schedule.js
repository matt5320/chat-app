// import { gc } from "../group-chat.js";
import { defineAsyncComponent } from "vue";
import { ToggleSwitch } from "./toggle-switch.js";

export async function Schedule() {
  return {
    data() {
      return {
        activated: this.schedule.value.object.activated,
      };
    },
    props: ["schedule"],
    components: {
      ToggleSwitch: defineAsyncComponent(ToggleSwitch),
    },
    methods: {
      toggleActivated() {
        this.activated = !this.activated;

        this.$graffiti.patch(
          {
            value: [
              {
                op: "replace",
                path: "/object/activated",
                value: this.activated,
              },
            ],
          },
          this.schedule.url,
          this.$graffitiSession.value
        );
      },
    },
    template: await fetch("./schedule.html").then((r) => r.text()),
  };
}

import { gc } from "../group-chat.js";

export async function Chat() {
  return {
    props: ["groupChat"],
    methods: {
      selectGroupChat(e) {
        document.querySelectorAll(".chat.selected").forEach((el) => {
          el.classList.remove("selected");
        });
        let target = e.target;
        while (target !== null) {
          if (target.classList.contains("chat")) break;
          target = target.parentElement;
        }
        target?.classList.add("selected");

        gc.name = this.groupChat.value.object.name;
        gc.channel = this.groupChat.value.object.channel;
        gc.url = this.groupChat.url;
      },
      getLastMessage(objects) {
        return objects
          .toSorted((a, b) => a.value.published - b.value.published)
          .pop()?.value.content;
      },
    },
    template: await fetch("./components/chat.html").then((r) => r.text()),
  };
}

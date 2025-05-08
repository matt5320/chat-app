export async function ToggleSwitch() {
  return {
    props: ["activated"],
    template: await fetch("./components/toggle-switch.html").then((r) =>
      r.text()
    ),
  };
}

export async function ToggleSwitch() {
  return {
    props: ["activated"],
    template: await fetch("./toggle-switch.html").then((r) => r.text()),
  };
}

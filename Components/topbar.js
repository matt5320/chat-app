export async function Topbar() {
  return {
    template: await fetch("./components/topbar.html").then((r) => r.text()),
  };
}

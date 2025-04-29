export async function Topbar() {
  return {
    template: await fetch("./topbar.html").then((r) => r.text()),
  };
}

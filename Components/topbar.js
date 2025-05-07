export async function Topbar() {
  return {
    template: await fetch("./Components/topbar.html").then((r) => r.text()),
  };
}

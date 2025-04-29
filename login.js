export async function Login() {
  return {
    template: await fetch("./login.html").then((r) => r.text()),
  };
}

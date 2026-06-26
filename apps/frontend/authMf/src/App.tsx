// Exposed by the federation plugin as 'authMf/App'.
// Consumers render it lazily via `lazyProvider('authMf', 'App')`.
export function App() {
  return (
    <section data-testid="authMf">
      <h1>Hello from authMf</h1>
    </section>
  );
}

export default App;

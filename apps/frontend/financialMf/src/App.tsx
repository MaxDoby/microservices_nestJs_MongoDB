// Exposed by the federation plugin as 'financialMf/App'.
// Consumers render it lazily via `lazyProvider('financialMf', 'App')`.
export function App() {
  return (
    <section data-testid="financialMf">
      <h1>Hello from financialMf</h1>
    </section>
  );
}

export default App;

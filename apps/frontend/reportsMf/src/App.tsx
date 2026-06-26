// Exposed by the federation plugin as 'reportsMf/App'.
// Consumers render it lazily via `lazyProvider('reportsMf', 'App')`.
export function App() {
  return (
    <section data-testid="reportsMf">
      <h1>Hello from reportsMf</h1>
    </section>
  );
}

export default App;

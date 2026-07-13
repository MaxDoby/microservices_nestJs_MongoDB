import { createRoot, type Root } from 'react-dom/client';
import App from './App';

class FinancialTrackerTransactionsElement extends HTMLElement {
  private root: Root | null = null;

  connectedCallback() {
    if (this.root) return;

    this.root = createRoot(this);
    this.root.render(<App />);
  }

  disconnectedCallback() {
    this.root?.unmount();
    this.root = null;
  }
}

if (!customElements.get('ft-transactions')) {
  customElements.define('ft-transactions', FinancialTrackerTransactionsElement);
}

import { createRoot, type Root } from 'react-dom/client';
import App from './App';

class FinancialTrackerReportsElement extends HTMLElement {
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

if (!customElements.get('ft-reports')) {
  customElements.define('ft-reports', FinancialTrackerReportsElement);
}

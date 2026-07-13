import { createRoot, type Root } from 'react-dom/client';
import App from './App';

class FinancialTrackerAuthElement extends HTMLElement {
  private root: Root | null = null;

  connectedCallback() {
    if (this.root) return;

    this.root = createRoot(this);
    this.root.render(
      <App
        onAuthenticated={() => {
          this.dispatchEvent(
            new CustomEvent('ft:auth:authenticated', {
              bubbles: true,
              composed: true,
            }),
          );
        }}
      />,
    );
  }

  disconnectedCallback() {
	this.root?.unmount();
	this.root = null;
  }
}

if (!customElements.get('ft-auth')) {
	customElements.define('ft-auth', FinancialTrackerAuthElement)
}

import { lazy, type ComponentType } from 'react';
import { registerRemotes, loadRemote } from '@module-federation/runtime';

// The providers this consumer loads at runtime. Edit `entry` to point at a
// different URL (`remoteEntry.js` is what every supported bundler emits at dev
// + build time). `name` is the provider build's federation container name and
// must match the provider's federation `name`; `alias` is the key you pass to
// loadRemote()/lazyProvider().
const PROVIDERS: Array<{ alias: string; name: string; entry: string }> = [
  {
    alias: 'authMf',
    name: 'auth_mf',
    entry: import.meta.env.VITE_AUTH_MF_URL,
  },
  {
    alias: 'financialMf',
    name: 'financial_mf',
    entry: import.meta.env.VITE_FINANCIAL_MF_URL,
  },
  {
    alias: 'reportsMf',
    name: 'reports_mf',
    entry: import.meta.env.VITE_REPORTS_MF_URL,
  },
];

// `type: 'module'` is required because the providers in this workspace are
// vite-built and emit ESM remoteEntry.js. The federation runtime would load
// it as a classic `<script>` tag otherwise and the browser would throw
// `Cannot use import statement outside a module` (#RUNTIME-001).
registerRemotes(PROVIDERS.map((remote) => ({ ...remote, type: 'module' })));

export const lazyProvider = <Props = unknown>(
  alias: string,
  exposeName: string,
) => {
  return lazy(async () => {
    const mod = await loadRemote<{ default: ComponentType<Props> }>(
      `${alias}/${exposeName}`,
    );
    if (!mod) {
      throw new Error(`Could not load remote module: ${alias}/${exposeName}`);
    }
    return { default: mod.default };
  });
};

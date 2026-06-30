import { Component, Suspense, type ReactNode } from 'react';

interface ProviderBoundaryProps {
  children: ReactNode;
  name: string;
}

interface ProviderBoundaryState {
  error: Error | null;
}

export class ProviderBoundary extends Component<
  ProviderBoundaryProps,
  ProviderBoundaryState
> {
  state: ProviderBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ProviderBoundaryState {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div role="alert">
          <p>
            Provider &quot;{this.props.name}&quot; unavailable:{' '}
            {this.state.error.message}
          </p>
        </div>
      );
    }

    return (
      <Suspense fallback={<p>Loading {this.props.name}...</p>}>
        {this.props.children}
      </Suspense>
    );
  }
}

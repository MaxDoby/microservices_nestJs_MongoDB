import { createElement, useEffect, useState } from 'react';
import { loadProviderElement } from '../mf';

interface RemoteElementProps {
  alias: string;
  exposeName: string;
  tagName: string;
}

export const RemoteElement = ({
  alias,
  exposeName,
  tagName,
}: RemoteElementProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProviderElement(alias, exposeName)
      .then(() => setIsLoaded(true))
      .catch((remoteError: unknown) => {
        setError(
          remoteError instanceof Error
            ? remoteError.message
            : 'Could not load remote element.',
        );
      });
  }, [alias, exposeName]);

  if (error) return <p className="status-message">{error}</p>;
  if (!isLoaded) return <p className="status-message">Loading...</p>;

  return createElement(tagName);
};

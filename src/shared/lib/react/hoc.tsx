import { FC, Suspense, SuspenseProps } from 'react';

export function withSuspense<WrappedProps extends object>(
  WrappedComponent: FC<WrappedProps>,
  suspenseProps: SuspenseProps,
): FC<WrappedProps> {
  function WrapperComponent(props: WrappedProps) {
    return (
      <Suspense {...suspenseProps}>
        <WrappedComponent {...props} />
      </Suspense>
    );
  }

  return WrapperComponent;
}
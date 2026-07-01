// Patch @types/react@19 incompatibility with react-native.
// React 19's ReactNode includes `bigint`, which makes RN component types
// fail the JSX element type check. This narrows ReactNode to exclude bigint.
import 'react';

declare module 'react' {
  type ReactNode =
    | ReactElement
    | string
    | number
    | Iterable<ReactNode>
    | ReactPortal
    | boolean
    | null
    | undefined;
}

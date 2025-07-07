
/**
 * TypeScript type declarations for the 'swagger-ui-react' module.
 *
 * @remarks
 * Provides type safety for importing and using the SwaggerUI React component in TypeScript projects.
 *
 * @example
 * ```ts
 * import SwaggerUI from 'swagger-ui-react';
 * <SwaggerUI url="/api/swagger.yaml" />
 * ```
 */
declare module 'swagger-ui-react' {
  import * as React from 'react';

  /**
   * Props for the SwaggerUI React component.
   * @property url - The URL to the OpenAPI/Swagger spec.
   * @example
   * ```ts
   * <SwaggerUI url="/api/swagger.yaml" />
   * ```
   */
  interface SwaggerUIProps {
    /** The URL to the OpenAPI/Swagger spec. */
    url: string;
    /** Additional props supported by SwaggerUI. */
    [key: string]: any;
  }

  /**
   * The SwaggerUI React component for rendering API documentation.
   * @param props - {@link SwaggerUIProps}
   * @returns A React element displaying the Swagger UI.
   */
  const SwaggerUI: React.FC<SwaggerUIProps>;
  export default SwaggerUI;
}

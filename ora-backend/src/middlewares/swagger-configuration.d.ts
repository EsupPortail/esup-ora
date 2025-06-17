// Definition for the swagger-configuration module
import { swaggerJSDoc } from '@types/swagger-jsdoc';

declare module './swagger-configuration' {

    const specs: ReturnType<typeof swaggerJSDoc>;

  export { specs };
}
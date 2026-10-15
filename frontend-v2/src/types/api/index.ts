export {
  type paths as IApiServicePaths,
  type components as IApiService,
  type operations as IApiServiceOperations,
} from "./api-service";

import type { components as IApiService } from "./api-service";

export type ErrorResponseDto = IApiService["schemas"]["ErrorResponseDto"];

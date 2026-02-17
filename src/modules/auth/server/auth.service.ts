import { API_ENDPOINTS, NEXT_API_URL } from "@/modules/common/constants";
import { GenericRepository } from "@/modules/fetch/fetch.generic";

const authRepository = new GenericRepository({ API_URL: NEXT_API_URL });

export const authService = {
  login: async <TRequest, TResponse>(payload: TRequest) =>
    authRepository.POST<TRequest, TResponse>({
      path: API_ENDPOINTS.auth.login,
      data: payload,
    }),
  checkStatus: async <TResponse>() =>
    authRepository.GET<unknown, TResponse>({
      path: API_ENDPOINTS.auth.checkStatus,
      extra: { cache: "no-store" },
    }),
};

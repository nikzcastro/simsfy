const BASE_URL = import.meta.env.VITE_BASE_URL;
const BASE_CLIENT_IS_CLIENT =
  import.meta.env.VITE_BASE_CLIENT_IS_CLIENT ||
  "afkwakfawgjgeagjegajawsajewsgaegojkgaegaklegmakwewknm";
export const api = {
  async request(
    method: string,
    Route: string,
    Data?: any,
    customHeaders?: Record<string, string>
  ) {
    try {
      const authToken = localStorage.getItem("authToken");
      const defaultHeaders: Record<string, string> = {
        isclient: BASE_CLIENT_IS_CLIENT,
        isCliet: BASE_CLIENT_IS_CLIENT,
        Authorization: `Bearer ${authToken}`,
      };

       const isFormData = Data instanceof FormData;

      if (!customHeaders) {
        customHeaders = {};
      }

      if (!isFormData && !("Content-Type" in customHeaders)) {
        customHeaders["Content-Type"] = "application/json";
      }

      if (isFormData && "Content-Type" in customHeaders) {
        delete customHeaders["Content-Type"];
      }

        const headers = {
          ...defaultHeaders,
          ...customHeaders,
        };

      const body =
        method.toUpperCase() !== "GET"
          ? isFormData
            ? Data 
            : JSON.stringify(Data)
          : undefined;

      const response = await fetch(`${BASE_URL}${Route}`, {
        method: method.toUpperCase(),
        headers: headers,
        body,
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erro na API (${method}):`, error);
      throw error;
    }
  },


  get(Route: string, customHeaders?: Record<string, string>) {
    return this.request("GET", Route, undefined, customHeaders);
  },

  post(Route: string, Data?: any, customHeaders?: Record<string, string>) {
    return this.request("POST", Route, Data, customHeaders);
  },

  put(Route: string, Data?: any, customHeaders?: Record<string, string>) {
    return this.request("PUT", Route, Data, customHeaders);
  },

  delete(Route: string, Data?: any, customHeaders?: Record<string, string>) {
    return this.request("DELETE", Route, Data, customHeaders);
  },
};

"use client";

import { setCookie } from "cookies-next";
import { useState } from "react";
import { callApi } from "./call-api";

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async ({
    endpoint,
    payload,
    method = "GET",
    setEndpointCookie = true,
  }) => {
    setLoading(true);
    setError(null);

    if (setEndpointCookie) {
      setCookie("apiEndpoint", endpoint);
      setCookie("apiMethod", method);
    }

    try {
      const requestOptions =
        method.toUpperCase() === "GET"
          ? ''
          : {payload};

      const response = await callApi(requestOptions);
      return response;
    } catch (err) {
      const message = err?.message || "Something went wrong";
      setError(message);
      return { error: message };
    } finally {
      setLoading(false);
    }
  };

  return { request, loading, error };
}

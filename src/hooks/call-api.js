"use server";

import { cookies } from "next/headers";

const endpointMap = [
  { pattern: /^api\/auth\//, baseUrl: "http://localhost:8080" },
  { pattern: /^api\/cardholders\//, baseUrl: "http://localhost:8081" },
  { pattern: /^api\/expenses\//, baseUrl: "http://localhost:8082" },
];

function getBaseUrl(endpoint) {
  for (const { pattern, baseUrl } of endpointMap) {
    if (pattern.test(endpoint)) return baseUrl;
  }
  throw new Error("Unsupported or incorrect API endpoint");
}

export async function callApi({ endpoint, payload, method = "GET" }) {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;
  const storedEndpoint = decodeURIComponent(
    cookieStore.get("apiEndpoint")?.value || endpoint || ""
  );
  const storedMethod = (cookieStore.get("apiMethod")?.value || method).toUpperCase();

  if (!storedEndpoint) throw new Error("No API endpoint provided");

  const baseUrl = getBaseUrl(storedEndpoint);
  const url = `${baseUrl}/${storedEndpoint}`;
  const headers = {};

  if (baseUrl !== "http://localhost:8080") {
    if (!token) throw new Error("No authentication token found");
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method: storedMethod,
    headers,
  };

  if (payload && storedMethod !== "GET") {
    if (payload instanceof FormData) {
      options.body = payload;
    } else if (typeof payload === "object") {
      const isMultipart = Object.values(payload).some(
        (value) => value instanceof File || value instanceof Blob
      );

      if (isMultipart) {
        const formData = new FormData();
        for (const key in payload) {
          const value = payload[key];
          if (
            typeof value === "object" &&
            !(value instanceof File || value instanceof Blob)
          ) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        }
        options.body = formData;
      } else {
        headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(payload);
      }
    } else {
      headers["Content-Type"] = "text/plain";
      options.body = String(payload);
    }
  } else if (payload && storedMethod === "GET") {
    console.warn("Payload provided for GET request will be ignored.");
  }

  const res = await fetch(url, options);

  const contentType = res.headers.get("content-type");
  let responseData;

  if (contentType?.includes("application/json")) {
    responseData = await res.json();
  } else if (contentType?.includes("text/")) {
    responseData = await res.text();
  } else {
    responseData = await res.blob();
  }

  if (!res.ok) {
    throw new Error(
      responseData?.message || responseData || "API request failed"
    );
  }

  cookieStore.delete("apiEndpoint");
  cookieStore.delete("apiMethod");

  return {
    status: res.status,
    data: responseData,
  };
}

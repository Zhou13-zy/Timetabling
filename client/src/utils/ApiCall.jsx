export function apiCall(method, headers = {}, body = {}, path) {
  return new Promise((resolve, reject) => {
    const isFormData = body instanceof FormData;

    // If the body is not FormData, set Content-Type to application/json
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const init = {
      method: method,
      mode: "cors",
      headers: headers,
      body:
        method === "GET" ? undefined : isFormData ? body : JSON.stringify(body),
    };

    fetch(`http://localhost:5005/v1/api/${path}`, init)
      .then((response) => {
        const statusCode = response.status;

        response
          .json()
          .then((body) => {
            resolve({ statusCode, data: body });
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        console.log(err.message);
        reject(err);
      });
  });
}

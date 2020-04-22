const CONFIG = require("../../config.json");

export const fetchDataWithOptions = (path, requestOptions) => {
  return fetch(CONFIG["proxy"] + path, requestOptions).then(
    async (response) => {
      const data = await response.json();

      if (!response.ok) {
        // get error message from body or default to response status
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
      }
      return data;
    }
  );
};

export const fetchData = (path) => {
  return fetch(CONFIG["proxy"] + path).then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      // get error message from body or default to response status
      const error = (data && data.message) || response.status;
      return Promise.reject(error);
    }
    return data;
  });
};


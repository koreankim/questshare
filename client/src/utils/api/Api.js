const CONFIG = require("../../config.json");

export const sendDataWithOptions = async (path, requestOptions) => {
  const response = await fetch(process.env.REACT_APP_SERVER_PROXY + path, requestOptions);
  const data = await response.json();
  if (!response.ok) {
    // get error message from body or default to response status
    const error = (data && data.message) || response.status;
    return Promise.reject(error);
  }
  return data;
};

export const sendData = async (path) => {
  const response = await fetch(process.env.REACT_APP_SERVER_PROXY + path);
  const data = await response.json();
  if (!response.ok) {
    // get error message from body or default to response status
    const error = (data && data.message) || response.status;
    return Promise.reject(error);
  }
  return data;
};

export const fetchIP = async () => {
  const response = await fetch(process.env.REACT_APP_IP_PROXY);
  const data = await response.json();

  if (!response.ok) {
    // get error message from body or default to response status
    const error = (data && data.message) || response.status;
    return Promise.reject(error);
  }

  return data["ip"];
};

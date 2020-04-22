import { notification } from "antd";

export const openNotification = (msg, desc, duration) => {
  const args = {
    message: msg,
    description: desc,
    duration: duration,
  };
  notification.open(args);
};

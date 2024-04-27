import moment from "moment";

export const config = {
  // baseUrl: "http://65.0.29.203:5000/api/",
  baseUrl: "https://starexgreen.in/api/",
  // baseUrl: "http://localhost:5000/api/",
  // baseUrl:"http://192.168.1.44:5000/api/"
};

export const formatDate = (date: string) => {
  if (!date) return "";
  let formatedtime = moment(date).format("MMM Do YY");
  return formatedtime;
};

export const formateTime = (date: string) => {
  if (!date) return "";
  let formatedtime = moment(date).format("hh:mm A");
  return formatedtime;
};

export const formateDateandTime = (date: string) => {
  if (!date) return "";
  let formatedtime = moment(date).format("MMM Do YY hh:mm A");
  return formatedtime;
};

export const formatePhone = (phone: string) => {
  if (!phone) return "";
  let formatedtime = phone
    .toString()
    .replace(/(\d{2})(\d{4})(\d{4})/, "+$1 $2$3");
  return formatedtime;
};

export const statusEnums: any = {
  confirmed: "Confirmed",
  pickedup: "Picked Up",
  ontheWay: "On the Way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

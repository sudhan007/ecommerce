export const save = function (key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  };
  
  export const deletevalue = function (key: string) {
    localStorage.removeItem(key);
  };
  
  export const get = function (key: string) {
    return localStorage.getItem(key) || null;
  };
  
  export const wipeOut = function () {
    localStorage.clear();
  };
  
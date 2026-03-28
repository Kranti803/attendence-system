//setting the cookie
export const setCookie = (name: string, value: string, days: number) => {
    if (typeof document === "undefined") return;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
};

//getting the cookie
export const getCookie = (name: string) => {
    if (typeof document === "undefined") return undefined;
    const value = `; ${document.cookie}`;
    console.log(value)
    const parts = value.split(`; ${name}=`);
    console.log(parts)
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    console.log(parts.pop()?.split(";").shift())
};

//deleting the cookie
export const deleteCookie = (name: string) => {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
};
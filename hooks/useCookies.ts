"use client"

import { useState, Dispatch, SetStateAction, useEffect } from 'react';

type UseCookieReturnType<T> = [T, Dispatch<SetStateAction<T>>, () => void];

const useCookies = <T>(
  cookieName: string,
  initialValue: T,
  expiresHours?: number // Optional parameter for expiry time in hours
): UseCookieReturnType<T> => {
  // Helper function to get the cookie value
  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') {
      // If running on the server, return null
      return null;
    }

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(';').shift() as string);
    return null;
  };

  // Helper function to set the cookie
  const setCookie = (name: string, value: string, hours?: number) => {
    if (typeof document !== 'undefined') {
      const date = new Date();
      const expiryHours = hours !== undefined ? hours : 24; // Default to 24 hours if hours is not provided
      date.setTime(date.getTime() + expiryHours * 60 * 60 * 1000); // Set expiry time
      document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/`;
    }
  };

  // Helper function to delete the cookie
  const deleteCookie = (name: string) => {
    if (typeof document !== 'undefined') {
      document.cookie = `${name}=; Max-Age=-99999999; path=/`;
    }
  };

  // Get the initial value from the cookie or use the provided default value
  const getInitialValue = (): T => {
    const cookieValue = getCookie(cookieName);

    if (cookieValue) {
      try {
        return JSON.parse(cookieValue) as T;
      } catch (e) {
        console.error('Failed to parse cookie JSON', e);
        // If parsing fails, return the initial value
        return initialValue;
      }
    }

    return initialValue;
  };

  const [cookie, setCookieState] = useState<T>(getInitialValue);

  // Sync the cookie state with the browser cookies when the component mounts
  useEffect(() => {
    setCookieState(getInitialValue());
  }, []);

  // Function to update the cookie value
  const updateCookie = (newValue: SetStateAction<T>) => {
    setCookieState((prevValue) => {
      const valueToStore = newValue instanceof Function ? newValue(prevValue) : newValue;
      setCookie(cookieName, JSON.stringify(valueToStore), expiresHours);
      return valueToStore;
    });
  };

  // Function to remove the cookie
  const removeCookie = () => {
    setCookieState(initialValue);
    deleteCookie(cookieName);
  };

  return [cookie, updateCookie, removeCookie];
};

export default useCookies;

import { auth } from '../firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

/**
 * Checks if a user is authenticated
 * @returns {Promise<boolean>} True if user is authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(!!user);
    });
  });
};

/**
 * Redirects to login page if user is not authenticated
 * @param {string} redirectPath - Path to redirect back to after login
 */
export const requireAuth = async (redirectPath = window.location.pathname) => {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    // Store the intended path to redirect back after login
    sessionStorage.setItem('redirectAfterLogin', redirectPath);
    window.location.href = '/login';
    return false;
  }
  return true;
};

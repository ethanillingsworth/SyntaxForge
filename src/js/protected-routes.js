import { requireAuth } from './utils/auth.js';
import { auth } from './firebase.js';

// List of protected routes that require authentication
const protectedRoutes = [
  '/courses',
  '/editor',
  '/course',
  '/lesson'
];

// Check if current path is protected
const currentPath = window.location.pathname;
if (protectedRoutes.some(route => currentPath.startsWith(route))) {
  requireAuth();
}

// Add click handlers for protected links
document.addEventListener('DOMContentLoaded', () => {
  // Handle Start Learning button
  const startLearningBtn = document.querySelector('a[href="/courses"]');
  if (startLearningBtn) {
    startLearningBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const isAuth = await requireAuth('/courses');
      if (isAuth) {
        window.location.href = '/courses';
      }
    });
  }

  // Handle Playground link in navigation
  const playgroundLink = document.querySelector('a[href="/editor"]');
  if (playgroundLink) {
    playgroundLink.addEventListener('click', async (e) => {
      e.preventDefault();
      const isAuth = await requireAuth('/editor');
      if (isAuth) {
        window.location.href = '/editor';
      }
    });
  }
});

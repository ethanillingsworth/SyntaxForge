import $ from "jquery";

// Mobile menu functionality - shared across all pages
export function initMobileMenu() {
    $(document).ready(() => {
        const mobileMenuBtn = $('#mobile-menu-btn');
        const mobileNav = $('#mobile-nav');
        
        // Toggle mobile menu
        mobileMenuBtn.on('click', () => {
            if (mobileNav.hasClass('hidden')) {
                mobileNav.removeClass('hidden').addClass('show');
                mobileMenuBtn.addClass('active');
            } else {
                mobileNav.removeClass('show').addClass('hidden');
                mobileMenuBtn.removeClass('active');
            }
        });
        
        // Close mobile menu when clicking outside
        $(document).on('click', (e) => {
            if (!$(e.target).closest('#mobile-menu-btn, #mobile-nav').length) {
                mobileNav.removeClass('show').addClass('hidden');
                mobileMenuBtn.removeClass('active');
            }
        });
        
        // Close mobile menu when window is resized to desktop
        $(window).on('resize', () => {
            if ($(window).width() >= 768) {
                mobileNav.removeClass('show').addClass('hidden');
                mobileMenuBtn.removeClass('active');
            }
        });
        
        // Close mobile menu when clicking on a nav link
        $('.mobile-nav-menu a').on('click', () => {
            mobileNav.removeClass('show').addClass('hidden');
            mobileMenuBtn.removeClass('active');
        });
    });
}

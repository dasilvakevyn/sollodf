document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const navigationMenu = document.getElementById('navigation-menu');

    mobileMenuButton.addEventListener('click', function() {
        navigationMenu.classList.toggle('active');
    });

    const navLinks = navigationMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <1024) {
                navigationMenu.classList.remove('active');
            }
        });
    });
});
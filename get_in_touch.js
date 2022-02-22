//----------Hooking up hamburger menu-----------------

const hamBtn = document.getElementById('menu-btn')

const mobileNav = document.getElementById('menu')

hamBtn.addEventListener('click', (e) => {
    e.currentTarget.classList.toggle('open');
    mobileNav.classList.toggle('hidden')
})
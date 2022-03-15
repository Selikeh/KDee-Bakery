//----------Hooking up hamburger menu-----------------

const hamBtn = document.getElementById('menu-btn')

const mobileNav = document.getElementById('menu')

hamBtn.addEventListener('click', (e) => {
    e.currentTarget.classList.toggle('open');
    mobileNav.classList.toggle('hidden')
})

// -------------Dynamic Copyright Date---------------
window.onload = () => {
    let copyDate = document.getElementById('copyright-date')
    copyDate.innerText = new Date().getFullYear()
}
// NAVBAR

let navbar = document.getElementById('sidebar');
let hamburguer = document.getElementById('hamburguer');
let sidebarList = document.getElementById('sidebarList');

hamburguer.addEventListener('click', function () {
    navbar.classList.toggle('active');

    let sidebarListDisplay = window.getComputedStyle(sidebarList).getPropertyValue('display');
    if (sidebarListDisplay == 'block') {
        sidebarList.style.display = 'none';
    } else if (sidebarListDisplay == 'none') {
        sidebarList.style.display = 'block';
    }
});
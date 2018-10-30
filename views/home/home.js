let navbar = document.getElementById('navbar');
let hamburguer = document.getElementById('hamburguer');

hamburguer.addEventListener('click', function () {
    navbar.classList.toggle('active');
});
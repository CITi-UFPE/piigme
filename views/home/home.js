// NAVBAR

let navbar = document.getElementById('sidebar');
let hamburguer = document.getElementById('hamburguer');
let sidebarList = document.getElementById('sidebarList');

hamburguer.addEventListener('click', function () {
    navbar.classList.toggle('active');

    setTimeout(function(){
        let sidebarListDisplay = window.getComputedStyle(sidebarList).getPropertyValue('display');
        if (sidebarListDisplay == 'block') {
            sidebarList.style.display = 'none';
        } else if (sidebarListDisplay == 'none') {
            sidebarList.style.display = 'block';
        }
    }, 100);
});

function copyLink() {
    let customText = document.getElementById('customLink').value;
    let customLink = 'http://piig.me/' + customText;
    let element = document.createElement('textarea');
    element.value = customLink;
    document.body.appendChild(element);
    element.select();
    document.execCommand('copy');
    document.body.removeChild(element);
    alert('Link criado e copiado para área de transferência!!');
}
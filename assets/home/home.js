// NAVBAR

$(document).ready(function(){
    
    /* -------------------- NAVBAR -------------------- */
    let isMenuShown = false;
  
    $('.navbar-buttons-link').click(function() {
      if(isMenuShown) {
        $('#navbar-buttons-list').animate({width:'toggle'},200); // Proper function that closes the navbar menu
        isMenuShown=false;
  
        $('#navbar-x-container').toggleClass("change"); // Makes the X animation adding a css 'change' class
      }
    });
  
    $('#navbar-x-container').click(function(event) {
      if(!isMenuShown) {
  
        /* Slide down the navbar menu with a callback function to make 
        the div 'display: flex' and not 'display: block' */
        $('#navbar-buttons-list').animate({width:'toggle'},200);
        $('#navbar-buttons-list').css('display', 'flex');
        isMenuShown = true;
    
        $('#navbar-x-container').toggleClass("change"); // Makes the X animation adding a css 'change' class
  
      } else {
  
        $('#navbar-buttons-list').animate({width:'toggle'},200); // Closes with slide up animation the navbar menu
        isMenuShown=false;
  
        $('#navbar-x-container').toggleClass("change"); // Makes the X animation adding a css 'change' class
      }
    });
  
    /* Function to close the navbar slide down when clicked outside
    for making the UX better */
    $(document).click(function(event) { 
      if (!$(event.target).closest('.navbar').length) {
        if (isMenuShown) {
          $('#navbar-buttons-list').animate({width:'toggle'},200); // Proper function that closes the navbar menu
          isMenuShown=false;
  
          $('#navbar-x-container').toggleClass("change"); // Makes the X animation adding a css 'change' class
        }
      }
    });
});

function copyLink() {
    let customText = document.querySelector('input[name=custom_link]').value;
    let customLink = 'http://piig.me/' + customText;
    let element = document.createElement('textarea');
    element.value = customLink;
    document.body.appendChild(element);
    element.select();
    document.execCommand('copy');
    document.body.removeChild(element);
}
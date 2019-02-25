// NAVBAR

$(document).ready(function () {

  /* -------------------- NAVBAR -------------------- */
  let isMenuShown = false;

  $('.navbar-buttons-link').click(function () {
    if (isMenuShown) {
      $('#navbar-buttons-list').animate({
        width: 'toggle'
      }, 200); // Proper function that closes the navbar menu
      isMenuShown = false;

      $('#navbar-x-container').toggleClass("change"); // Makes the X animation adding a css 'change' class
    }
  });

  $('#navbar-x-container').click(function (event) {
    if (!isMenuShown) {

      /* Slide down the navbar menu with a callback function to make 
      the div 'display: flex' and not 'display: block' */
      $('#navbar-buttons-list').animate({
        width: 'toggle'
      }, 200);
      $('#navbar-buttons-list').css('display', 'flex');
      isMenuShown = true;

      $('#navbar-x-container').toggleClass("change"); // Makes the X animation adding a css 'change' class

    } else {

      $('#navbar-buttons-list').animate({
        width: 'toggle'
      }, 200); // Closes with slide up animation the navbar menu
      isMenuShown = false;

      $('#navbar-x-container').toggleClass("change"); // Makes the X animation adding a css 'change' class
    }
  });

  /* Function to close the navbar slide down when clicked outside
  for making the UX better */
  $(document).click(function (event) {
    if (!$(event.target).closest('.navbar').length) {
      if (isMenuShown) {
        $('#navbar-buttons-list').animate({
          width: 'toggle'
        }, 200); // Proper function that closes the navbar menu
        isMenuShown = false;

        $('#navbar-x-container').toggleClass("change"); // Makes the X animation adding a css 'change' class
      }
    }
  });

  let contributorsUrl = 'https://api.github.com/repos/CITi-UFPE/piigme/contributors'
  $.ajax({
    url: contributorsUrl,
    type: 'GET',
    success: (result) => {
      let contributors = result;
      contributors.forEach(element => {
        $('#contributors-box').append(`
        <li class="contributors-user">
          <a href="${element.html_url}" target="_blank" class="contributors-user-link">
            <img src="${element.avatar_url}" alt="Avatar de ${element.login}" class="contributors-user-image">
            <span class="contributors-user-login">@${element.login}</span>
          </a>
        </li>
        `);
      });
    },
    error: (error) => {
      console.log(`Error: ${error}`);
    }
  });

});
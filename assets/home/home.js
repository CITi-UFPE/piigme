// NAVBAR

$(document).ready(function () {
  const toast = new Toasty();

  /* -------------------- NAVBAR -------------------- */
  let isMenuShown = false;

  $('.navbar-buttons-link').click(function () {
    if (isMenuShown) {
      $('#navbar-buttons-list').animate({ width: 'toggle' }, 200); // Proper function that closes the navbar menu
      isMenuShown = false;

      $('#navbar-x-container').toggleClass("change"); // Makes the X animation adding a css 'change' class
    }
  });

  $('#navbar-x-container').click(function (event) {
    if (!isMenuShown) {

      /* Slide down the navbar menu with a callback function to make 
      the div 'display: flex' and not 'display: block' */
      $('#navbar-buttons-list').animate({ width: 'toggle' }, 200);
      $('#navbar-buttons-list').css('display', 'flex');
      isMenuShown = true;

      $('#navbar-x-container').toggleClass("change"); // Makes the X animation adding a css 'change' class

    } else {

      $('#navbar-buttons-list').animate({ width: 'toggle' }, 200); // Closes with slide up animation the navbar menu
      isMenuShown = false;

      $('#navbar-x-container').toggleClass("change"); // Makes the X animation adding a css 'change' class
    }
  });

  /* Function to close the navbar slide down when clicked outside
  for making the UX better */
  $(document).click((event) => {
    if (!$(event.target).closest('.navbar').length) {
      if (isMenuShown) {
        $('#navbar-buttons-list').animate({ width: 'toggle' }, 200); // Proper function that closes the navbar menu
        isMenuShown = false;

        $('#navbar-x-container').toggleClass("change"); // Makes the X animation adding a css 'change' class
      }
    }
  });

  /* -------------------- POST REQUEST -------------------- */

  $('#form-link').submit((e) => {
    e.preventDefault();

    $.post('/', {
      original_link: $('input[name="original_link"]').val(),
      custom_link: $('input[name="custom_link"]').val(),
    }, (data) => {
      if(data === 'ok') toast.success('Link criado e copiado para área de transferência!');
      if(data === 'repeated') toast.error('Esse link customizado já está em uso!');
      if(data === 'piig') toast.error('O link não deve conter "piig.me"!');
    });

    // Copy text to the clipboard (Ctrl + C)
    let customText = document.querySelector('input[name=custom_link]').value;
    let customLink = 'https://piig.me/' + customText;
    let element = document.createElement('textarea');

    element.value = customLink;
    document.body.appendChild(element);
    element.select();
    document.execCommand('copy');
    document.body.removeChild(element);
  });

  /* -------------------- CHECK AVAILABILITY -------------------- */

  const specialLinks = ['links', '404', 'contributors'];
  let linksJson;

  $.ajax({ // ajax request to the api to get json of links
    dataType: 'json',
    url: '/api/get_links',
    type: 'GET',
    success: (result) => {
      linksJson = result;
    },
    error: (error) => {
      console.log(`Error: ${error}`);
    }
  });

  // When key is pressed, runs the array looking for the desired key
  $('#input-new').keyup(() => {
    let customLink = $('#input-new').val();
    let isFound = 0;
    linksJson.forEach((link) => {
      if(customLink === link.key) {
        isFound = 1;
      }
    });

    specialLinks.forEach((link) => { // Looks also in the specialLinks
      if(customLink === link) {
        isFound = 1;
      }
    });

    if(isFound) { // Then, changes the alert section
      $('.input-status').css('background-color', '#DD0048');
      $('.input-status-text').text('EM USO');
    } else {
      $('.input-status').css('background-color', '#60D77F');
      $('.input-status-text').text('OK!');
    }
  });
});

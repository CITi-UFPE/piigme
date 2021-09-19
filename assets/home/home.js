// NAVBAR

const deployedUrlServer = 'http://bepig.me';
const localUrlServer = 'http://localhost:5000'

const deployedUrlWeb = 'http://web.bepig.me';
const localUrlWeb = 'http://localhost:3333'

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
    $.ajax({
      dataType: 'json',
      headers: {  'Access-Control-Allow-Origin': `${deployedUrlWeb}` },
      data: {
        longUrl: $('input[name="original_link"]').val(),
        urlCode: $('input[name="custom_link"]').val(),
      },
      url: `${deployedUrlServer}/api/urls/shorten`,
      type: 'POST',
      success: (data) => {
        if(data.shortUrl) toast.success('Link criado e já copiado! Basta colar onde você deseja 🐷');
        $('input[name="original_link"]').val('');
        $('input[name="custom_link"]').val('')
      },
      error: (error) => {
        if(error.responseJSON === 'Already existing code') toast.error('Esse link customizado já está em uso!');
        if(error.responseJSON === 'The link must not contain bepig.me') toast.error('O link não deve conter "bepig.me"!');
      }
    });

    // Copy text to the clipboard (Ctrl + C)
    let customText = document.querySelector('input[name=custom_link]').value;
    let customLink = `${deployedUrlServer}/` + customText;
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
    headers: {  'Access-Control-Allow-Origin': `${deployedUrlWeb}` },
    url: `${deployedUrlServer}/api/urls`,
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
      if(customLink === link.urlCode) {
        isFound = 1;
      }
    });

    specialLinks.forEach((link) => { // Looks also in the specialLinks
      if(customLink === link) {
        isFound = 1;
      }
    });

    if(isFound) { // Then, changes the alert section
      $('.input-status').css('background-color', '#FF6363');
      $('.input-status-text').text('EM USO');
    } else {
      $('.input-status').css('background-color', '#60D77F');
      $('.input-status-text').text('OK!');
    }
  });
});

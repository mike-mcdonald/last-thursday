(function ($, Drupal) {

  "use strict";

  // For each of hero image elements, set their background image property.
  $('.paragraph--type--hero-image .paragraph--type--hero-image__image').each(function () {
    var $backgroundObj = $(this);

    $backgroundObj.css('background-image', 'url(' + $backgroundObj.find('img').attr('src') + ')');
  });

})(jQuery, Drupal);

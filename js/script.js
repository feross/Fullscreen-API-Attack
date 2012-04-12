// Emulates UI of:
// - current browser (TODO)
// - current OS (TODO)
// - handles arbitrary screen resolutions

// Attack works whether user starts out in fullscreen mode or not
// - In fact, it's even more convincing when user is already fullscreened



// TODO: message when no fullscreen support

// Fullscreen API Shim adapted from:
// https://github.com/toji/game-shim/blob/master/game-shim.js

var elementPrototype = (window.HTMLElement || window.Element)["prototype"];
var getter;
var fullscreenSupport = true;

// document.isFullScreen
if(!document.hasOwnProperty("fullscreenEnabled")) {
    getter = (function() {
        // These are the functions that match the spec, and should be preferred
        if("webkitIsFullScreen" in document) {
            return function() { return document.webkitIsFullScreen; };
        }
        if("mozFullScreen" in document) {
            return function() { return document.mozFullScreen; };
        }

        fullscreenSupport = false;
        return function() { return false; }; // not supported, never fullscreen
    })();
    
    Object.defineProperty(document, "fullscreenEnabled", {
        enumerable: true, configurable: false, writeable: false,
        get: getter
    });
}

if(!document.hasOwnProperty("fullscreenElement")) {
    getter = (function() {
        // These are the functions that match the spec, and should be preferred
        if("webkitFullscreenElement" in document) {
            return function() { return document.webkitFullscreenElement; };
        }
        if("mozFullscreenElement" in document) {
            return function() { return document.mozFullscreenElement; };
        }
        return function() { return null; }; // not supported
    })();
    
    Object.defineProperty(document, "fullscreenElement", {
        enumerable: true, configurable: false, writeable: false,
        get: getter
    });
}

// Document event: fullscreenchange
function fullscreenchange(oldEvent) {
    var newEvent = document.createEvent("CustomEvent");
    newEvent.initCustomEvent("fullscreenchange", true, false, null);
    // TODO: Any need for variable copy?
    document.dispatchEvent(newEvent);
}
document.addEventListener("webkitfullscreenchange", fullscreenchange, false);
document.addEventListener("mozfullscreenchange", fullscreenchange, false);

// Document event: fullscreenerror
function fullscreenerror(oldEvent) {
    var newEvent = document.createEvent("CustomEvent");
    newEvent.initCustomEvent("fullscreenerror", true, false, null);
    // TODO: Any need for variable copy?
    document.dispatchEvent(newEvent);
}
document.addEventListener("webkitfullscreenerror", fullscreenerror, false);
document.addEventListener("mozfullscreenerror", fullscreenerror, false);

// element.requestFullScreen
if(!elementPrototype.requestFullScreen) {
    elementPrototype.requestFullScreen = (function() {
        if(elementPrototype.webkitRequestFullScreen) {
            return function() {
                this.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            };
        }
        
        return  elementPrototype.mozRequestFullScreen ||
                function(){ /* unsupported, fail silently */ };
    })();
}

// document.exitFullscreen
if(!document.exitFullscreen) {
    document.exitFullscreen = (function() {
        return  document.webkitExitFullscreen ||
                document.mozExitFullscreen ||
                function(){ /* unsupported, fail silently */ };
    })();
}

$.facebox.settings.closeImage = 'img/facebox/closelabel.png';
$.facebox.settings.loadingImage = 'img/facebox/loading.gif';

var errors = [];
if (fullscreenSupport) {

  log(BrowserDetect);
  // Browser detect
  if (BrowserDetect.browser == "Chrome") {
    $('html').addClass('chrome');
  } else if (BrowserDetect.browser == "Firefox") {
    $('html').addClass('firefox');
  } else {
    $('html').addClass('chrome'); // fallback to wrong UI
    errors.push("Your browser supports the Fullscreen API! However, it didn't support it when I made this demo. The <b>demo will still work</b> but you will see Chrome's UI instead of your own browser's UI.");
  }

  // OS detect
  if (BrowserDetect.OS == "Mac") {
    $('html').addClass('osx');
  } else if (BrowserDetect.OS == "Windows") {
    $('html').addClass('windows');
  } else {
    errors.push("You're not using Windows or Mac OS X. The <b>demo will still work</b> but you will see the Mac UI instead of your own OS's UI. I didn't have time to take a million screenshots!");
  }

} else {
  errors.push("Your browser does not support the Fullscreen API. Sorry - this demo will not work for you. Try Chrome or Firefox.");
}

if (errors.length) {
  var str = "";
  $.each(errors, function(i, error) {
    str += error;
    if (i != errors.length - 1) {
      str += "<br><br>";
    }
  });

  $.facebox(str);
}

function setup() {
  $('#links').show();
  $('#spoofedSites div').hide();
  $('#menu, #browser').hide();

  $('html').off('click keypress');
  $('html').on('click keypress', '#links a', function(e) {
    
    // $('html')[0].requestFullScreen();

    $('#links').hide();
    $('#menu, #browser').show();

    var windowHeight = $(window).height();
    var headerHeight = $('header').height();
    $('#spoofedSites').css({
      top: headerHeight,
      height: windowHeight - headerHeight
    });

    $('html').off('click keypress');
    $('html').on('click keypress', function() {
      $('#menu').effect('shake');
      $('#browser').effect('shake');
      $.facebox({div: '#phished'});
    });

    e.preventDefault();
    e.stopPropagation();
  });

  $('html').on('click keypress', '#boaLink', function(e) {
    $('#boa').show();
  });
}


$(function() {

  $(document).on('fullscreenchange', function(test) {
    
    if (!document.fullscreenEnabled) {
      setup();
    
    }

  });

  setup();

});


$(window).load(function() {
  
  // preload images
  $('#spoofedSites img').each(function(i, img) {
    var temp = new Image();
    temp.src = img.src;
    
    log(img.src);
  });

});










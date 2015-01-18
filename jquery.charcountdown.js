/**
 * jQuery Character Countdown v1.3
 * Copyright (c) 2011-2015 Adam Messinger (www.zenscope.com)
 * Distributed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 * @requires jQuery 1.8 or later
 *
 * A plugin for producing a twitter-like countdown of the characters remaining
 * in a form field that only allows a limited amount of content.
 *
 * =CHANGE LOG=
 * ---------------------
 * As of v1.2, normalizes line-ending count across browsers to always count
 * CR & LF, per the HTML5 spec for a textarea's submission value*, rather than
 * counting them differently in field.value.length and when constraining input
 * based on maxlength (a WebKit peculiarity).
 *       * http://www.w3.org/TR/html5/forms.html#the-textarea-element
 *
 * Also in 1.2, emulates maxlength support for textareas in browsers that don't
 * offer this HTML5 feature or do so in a way that throws off the character
 * count (I'm looking at you, WebKit).
 *
 * As of 1.3, added allow_overrun parameter (see below).
 *
 * =PARAMETER REFERENCE=
 * ---------------------
 * + max_chars: The max number of characters allowed in the field. Defaults to
 *   the field's "maxlength" attribute if available, or 500 if no maxlength.
 *
 * + low_chars: The number of characters remaining that triggers the addition of
 *   the "low_class" parameter as a class name on the character count.
 *   Default: 10
 *
 * + allow_overrun: Boolean parameter indicating whether the user is allowed to
 *   exceed max_chars, pushing the counter into the negative. Default: false
 *
 * + low_class: The class name added to the character count once the number of
 *   characters remaining reaches low_chars. Default: "low"
 *
 * + field_class: The class name added to fields using this plugin as a hook to
 *   any related styles you want to apply. Default: "has-counter"
 *
 * + counter_class: The class name of the <label> element that contains the
 *   countdown of remaining characters. Default: "char-counter"
 *
 * + counter_message: The text that precedes and explains the numerical
 *   countdown. Default: "Characters remaining: "
 *
 * + counter_location: Where you want the countdown to appear. Accepts "before"
 *   (puts the countdown immediately before the field in the DOM tree), "after"
 *   (like "before" only... after-er), or a jQuery selector (appends the
 *   countdown to the selector's target(s)). Default: "after"
 *
 * =TODO=
 * ---------------------
 * + When allow_overrun is true and field starts beyond max_chars, goes beyond it,
 *   or goes back below max trigger event. Either different events for exceeding
 *   max and and coming back within bounds or one event with current char count
 *   passed as data for use in a callback. Users can listen for this/these event(s)
 *   to do things like disable/enable submit buttons.
 *
 * + What (if anything) to do with fields that start beyond max_chars when
 *   allow_overrun is false?
 *
 * + Allow for counting up as well as down?
 */
;
(function($) {
  $.fn.charCountdown = function(user_settings) {
    return this.each(function() {
      var starting_count,
          $counter_label,
          $counter,
          $field = $(this),
          // merge user args with defaults
          settings = $.extend({
            max_chars: parseInt($field.attr('maxlength'), 10) || 500,
            low_chars: 10,
            allow_overrun: false,
            low_class: 'low',
            field_class: 'has-counter',
            counter_class: 'char-counter',
            counter_message: 'Characters remaining: ',
            counter_location: 'after'  // takes "before", "after", or jQuery selector
          }, user_settings || {});

      // if overrun is allowed, remove maxlength attr to prevent browser-native input inhibition
      if (settings.allow_overrun) {
        $field.removeAttr('maxlength');
      }

      // begin with a label that represents the current char count
      starting_count = calcCount($field[0], settings.max_chars);
      $counter_label = $('<label></label>', {
        "for": $field[0].id,
        "class": settings.counter_class,
        "data-charcountdown-generated": 'true',
        text: settings.counter_message
      }).append($('<strong></strong>', {
        "class": starting_count <= settings.low_chars ? settings.low_class : '',
        text: starting_count
      }));
      $counter = $counter_label.find('strong');

      // window.console && console.log('starting count: ', starting_count);

      $field.addClass(settings.field_class);
      switch (settings.counter_location) {
        case 'after':
          $field.after($counter_label);
          break;
        case 'before':
          $field.before($counter_label);
          break;
        default:
          // if not "before" or "after", assume a selector
          $(settings.counter_location).append($counter_label);
      }

      // update the label and trim excess...
      // * on input for instant action (in compatible browsers -- not IE 8)
      // * on keyup for broad compatibility
      // * on change for non-keyboard inputs like paste w/ mouse
      // Event lineup inspired by James "brothercake" Edwards's Form Tools Library: http://bit.ly/10vFicw
      $field.on('input keyup change', function() {
        var new_count = calcCount($field[0], settings.max_chars);

        // window.console && console.log('new count: ', new_count);

        if (new_count < 0 && !settings.allow_overrun) {
          doMaxlength($field[0], Math.abs(new_count));
          new_count = 0;
        }

        $counter.text(new_count);
        if (new_count <= settings.low_chars) {
          $counter.addClass(settings.low_class);
        }
        else {
          $counter.removeClass(settings.low_class);
        }
      });
    });
  };

  // private function for counting remaining characters
  function calcCount(field, max) {
    return max - field.value.replace(/\r\n|\r|\n/g, '\r\n').length;
  }

  // private function for maxlength emulation
  function doMaxlength(field, excess_len) {
    var excess_end = getInputSelection(field).start,
        excess_start = excess_end - excess_len,
        val = field.value;
    // concatenate the value before and after excess, removing the extra chars
    field.value = val.substring(0, excess_start) + val.substring(excess_end);
    setCaretPosition(field, excess_start);
  }

  // private function for cross-browser set cursor position from http://bit.ly/12AjxJ7
  function setCaretPosition(field, pos) {
    var range;

    field.focus();

    if (field.setSelectionRange) {
      field.setSelectionRange(pos, pos);
    }
    else if (field.createTextRange) {
      range = field.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  }

  // private function for cross-browser get cursor position from http://stackoverflow.com/a/3053640
  function getInputSelection(field) {
    var start = 0,
        end = 0,
        normalizedValue, range,
        textInputRange, len, endRange;

    if (typeof field.selectionStart == "number" && typeof field.selectionEnd == "number") {
      start = field.selectionStart;
      end = field.selectionEnd;
    }
    else {
      range = document.selection.createRange();

      if (range && range.parentElement() == field) {
        len = field.value.length;
        normalizedValue = field.value.replace(/\r\n|\r|\n/g, '\r\n');

        // Create a working TextRange that lives only in the input
        textInputRange = field.createTextRange();
        textInputRange.moveToBookmark(range.getBookmark());

        // Check if the start and end of the selection are at the very end
        // of the input, since moveStart/moveEnd doesn't return what we want
        // in those cases
        endRange = field.createTextRange();
        endRange.collapse(false);

        if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
          start = end = len;
        }
        else {
          start = -textInputRange.moveStart("character", -len);
          start += normalizedValue.slice(0, start).split("\n").length - 1;

          if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
            end = len;
          }
          else {
            end = -textInputRange.moveEnd("character", -len);
            end += normalizedValue.slice(0, end).split("\n").length - 1;
          }
        }
      }
    }

    return {
      start: start,
      end: end
    };
  }
})(jQuery);
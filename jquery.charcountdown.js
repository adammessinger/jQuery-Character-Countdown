/**
 * jQuery Character Countdown v1.3.0
 * Copyright (c) 2011-2015 Adam Messinger (www.zenscope.com)
 * Released under the MIT license, see LICENSE file for details.
 *
 * requires jQuery 1.8 or later
 */
;(function($) {
  'use strict';

  $.fn.charCountdown = function(user_settings) {
    return this.each(function() {
      var starting_count;
      var $counter_label;
      var $counter;
      var $field = $(this);
      var settings = $.extend({
        max_chars: parseInt($field.attr('maxlength'), 10) || 500,
        low_chars: 10,
        allow_overrun: false,
        low_class: 'low',
        field_class: 'has-counter',
        counter_class: 'char-counter',
        counter_message: 'Characters remaining: ',
        counter_location: 'after'  // takes "before", "after", or jQuery selector
      }, user_settings || {});

      // if overrun allowed, remove maxlength attr to prevent input inhibition
      // by browser
      if (settings.allow_overrun) {
        $field.removeAttr('maxlength');
      }

      // begin with a label that represents the current char count
      starting_count = _calcRemainingCharCount($field[0], settings.max_chars);
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
      // Event lineup inspired by James "brothercake" Edwards's Form Tools
      // Library: http://bit.ly/10vFicw
      $field.on('input keyup change', function() {
        var new_count = _calcRemainingCharCount($field[0], settings.max_chars);

        if (new_count < 0 && !settings.allow_overrun) {
          _emulateMaxlength($field[0], Math.abs(new_count));
          new_count = 0;
        }

        $counter.text(new_count);
        if (new_count <= settings.low_chars) {
          $counter.addClass(settings.low_class);
        } else {
          $counter.removeClass(settings.low_class);
        }
      });
    });
  };


  function _calcRemainingCharCount(field, max) {
    return max - field.value.replace(/\r\n|\r|\n/g, '\r\n').length;
  }


  function _emulateMaxlength(field, excess_len) {
    var excess_end = _getInputSelection(field).start;
    var excess_start = excess_end - excess_len;
    var val = field.value;

    // concatenate the value before and after excess, removing the extra chars
    field.value = val.substring(0, excess_start) + val.substring(excess_end);
    _setCaretPosition(field, excess_start);
  }


  // cross-browser set cursor position from http://bit.ly/12AjxJ7
  function _setCaretPosition(field, pos) {
    var range;

    field.focus();

    if (field.setSelectionRange) {
      field.setSelectionRange(pos, pos);
    } else if (field.createTextRange) {
      range = field.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  }


  // cross-browser get selection from http://stackoverflow.com/a/3053640
  function _getInputSelection(field) {
    var start = 0;
    var end = 0;
    var normalizedValue;
    var range;
    var textInputRange;
    var len;
    var endRange;

    if (typeof field.selectionStart == "number" && typeof field.selectionEnd == "number") {
      start = field.selectionStart;
      end = field.selectionEnd;
    } else {
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
        } else {
          start = -textInputRange.moveStart("character", -len);
          start += normalizedValue.slice(0, start).split("\n").length - 1;

          if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
            end = len;
          } else {
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
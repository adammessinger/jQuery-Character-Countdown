# jQuery Character Countdown

A jQuery plugin for producing a twitter-like countdown of characters remaining for 
length-limited form fields.

## Parameter Reference
 
* `max_chars`: The max number of characters allowed in the field. _Default:_ The
  field's `maxlength` attribute if available, or 500 if no `maxlength`.
* `low_chars`: The number of characters remaining that will trigger the addition
  of the "low_class" parameter as a class name on the character count.
  _Default:_ `10`
* `allow_overrun`: Boolean parameter indicating whether the user is allowed to
  exceed `max_chars`, pushing the counter into the negative. _Default:_ `false`
* `low_class`: The class name added to the character count once the number of
  characters remaining reaches `low_chars`. _Default:_ `"low"`
* `field_class:` The class name added to fields using this plugin as a hook to
  any related styles you want to apply. _Default:_ `"has-counter"`
* `counter_class`: The class name of the `<label>` element that contains the
  countdown of remaining characters. _Default:_ `"char-counter"`
* `counter_message`: The text that precedes and explains the numerical
  countdown. _Default:_ `"Characters remaining: "`
* `counter_location`: Where you want the countdown to appear. Accepts `"before"`
  (puts the countdown immediately before the field in the DOM tree), `"after"`
  (like `"before"` only... after-er), or a jQuery selector (appends the
  countdown to the selector's target(s)). _Default:_ `"after"`

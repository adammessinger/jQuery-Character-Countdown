* [ ] Option to choose a countdown container tag other than `<label>`, with field
      association established by `aria-labelledby` attribute.
* [ ] Accessibility audit.
* [ ] Trigger an event when `allow_overrun` is true and field starts beyond 
      `max_chars`, goes beyond it, or goes back below the max. Different,
      namespaced events for exceeding the max and and coming back within bounds,
      with current char count and max passed as data for use in a callback.
      Users can listen for this/these events to do things like disable/enable
      submit buttons.
* [ ] What (if anything) to do with fields that start beyond max_chars when
      allow_overrun is false? Truncate?
* [ ] Option to allow for counting up as well as down?
# 1.3.1 (2015-05-16)

**Documentation:

* Split opening comments from the plugin's `.js` file into separate `README`,
  `CHANGELOG`, `LICENSE`, and `TODO` files. 
* Updates to `TODO`.
* Renamed `test.html` to `demo.html` and improved the file's CSS styles.
* Cleaned up and reformatted comments.
* Clearer names for private helper functions.

**Bug Fixes:

* Specified UTF-8 character set for `demo.html`.

**Miscellaneous:

* Updated JS coding style to match other publicly-released code.
* Consolidated line-ending normalization into the `_normalizeLineEndings` function.

# 1.3.0

**Features:

Added `allow_overrun` parameter -- set to true, allows user to exceed field's max 
length and push the countdown into the negative.

# 1.2.0

**Features

Emulates `maxlength` support for textareas in browsers that don't offer this HTML5
feature.

**Bug Fixes

Normalize line-endings in **one way** to smooth out the contradiction between
raw value, API value, and submission value line endings [in the HTML5 spec](http://www.w3.org/TR/html5/forms.html#the-textarea-element)*
(and the effects of that contradiction on calculated field value length).

> \* "For historical reasons, the element's value is normalised in three different 
ways for three different purposes. The raw value is the value as it was originally
set. It is not normalized. The API value is the value used in the value IDL 
attribute. It is normalized so that line breaks use "LF" (U+000A) characters. 
Finally, there is the form submission value. It is normalized so that line breaks
use U+000D CARRIAGE RETURN "CRLF" (U+000A) character pairs, and in addition, if 
necessary given the element's wrap attribute, additional line breaks are 
inserted to wrap the text at the given width."
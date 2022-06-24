# Copy Buttons

A simple module for adding reactive "Copy" buttons to a webpage to allow the
user to copy text from the page. I'll refer to them as "buttons" but in fact
you could use any of a number of HTML elements.

To set up the buttons, just import the function `copyButtonSetUp` and call it
with no arguments. As a very basic example, the below javascript is enough to
import and wire up the copy buttons:

```javascript
import {copyButtonsSetup} from './copy_buttons.js';
copyButtonsSetup();
```

And here's valid html for the button (assuming an element with id
`"text_to_copy"` exists on your page):

```html
<div data-copy-button="copyButton" data-copy-button-target="#text_to_copy">Copy</div>
```

For a full example using Bootstrap 4 button classes, check out `index.html`
in this repo. It's hosted at https://willfirman.github.io/copyButtons/

The elements you want to work as buttons require a few things to be
configured properly:
- They will only work when the site is hosted on HTTPS (or a locally-hosted
dev server) because they use the Clipboard interface.
- The button must have two attributes set:
  1) `data-copy-button="copyButton"` - this is how the function
  `copyButtonSetup` identifies the elements to add click event listeners to.
  2) `data-copy-button-target="{target's ID here}"`. This is the query
  selector that identifies the button's target; i.e. the element whose
  innerText you want to copy to the user's clipboard. It should be the target
  element's `id` attribute e.g. `data-copy-button-target="#elementToCopy"`

The module also exports two settings - `COPY_BUTTON_TEXT` and
`COPY_BUTTON_CLASSES`. You can use these to configure the innerText and CSS
classes that are applied to the copy button after they are clicked.
They're JavaScript objects, look at the source for how they're structured.

Expanding on the previous example, here's how you can import and change these
settings before calling `copyButtonsSetup`:

```javascript
import {copyButtonsSetup, COPY_BUTTON_CLASSES} from './copy_buttons.js';
COPY_BUTTON_CLASSES.success.add = ['your_css_class', 'css_class_2']
copyButtonsSetup();
```

When the button is clicked, it will copy the innerText of some other HTML
element to the user's clipboard. The button itself will have its innerText
set to a success/failure message (configurable in the `COPY_BUTTON_TEXT`
setting, default `'✔ Copied!'` or `'Failed'`).

The Copy buttons will have their CSS classes updated on click. The defaults
are based on Bootstrap 4 button styling classes and assume your buttons start
out as `'btn-outline-secondary'`. So on success, `'disabled'` is added. On
failure, `'btn-outline-secondary'` is removed and `'disabled', 'text-danger',
'btn-outline-danger'` are added. The classes are configurable using the
`COPY_BUTTON_CLASSES` setting.

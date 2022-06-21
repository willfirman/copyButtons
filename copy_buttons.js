
/** @file
 * A simple module for adding reactive "Copy" buttons to a webpage to allow the
 * user to copy text from the page. I'll refer to them as "buttons" but in fact
 * you could use any of a number of HTML elements.
 *
 * To set up the buttons, just import the function `copyButtonSetUp` and call it
 * with no arguments.
 *
 * The elements you want to work as buttons require a few things to be
 * configured properly:
 * - They will only work when the site is hosted on HTTPS (or a locally-hosted
 * dev server) because they use the Clipboard interface.
 * - The button must have two attributes set:
 *   1) `data-copy-button="copyButton" - this is how the function
 *   `copyButtonSetup` identifies the elements to add click event listeners to.
 *   2) `data-copy-button-target="{target's ID here}". This is the query
 *   selector that identifies the button's target; i.e. the element whose
 *   innerText you want to copy to the user's clipboard. It should be the target
 *   element's `id`` attribute e.g. `data-copy-button-target="#elementToCopy"`
 *
 * The module also exports two settings - COPY_BUTTON_TEXT and
 * COPY_BUTTON_CLASSES. You can use these to configure the innerText and CSS
 * classes that are applied to the copy button after they are clicked.
 *
 * When the button is clicked, it will copy the innerText of some other HTML
 * element to the user's clipboard. The button itself will have its innerText
 * set to a success/failure message (configurable in the COPY_BUTTON_TEXT
 * setting, default `'✔ Copied!'` or `'Failed'`).
 *
 * The Copy buttons will have their CSS classes updated on click. The defaults
 * are based on Bootstrap 4 button styling classes and assume your buttons start
 * out as `'btn-outline-secondary'`. So on success, `'disabled'` is added. On
 * failure, `'btn-outline-secondary'` is removed and `'disabled', 'text-danger',
 * 'btn-outline-danger'` are added. The classes are configurable using the
 * COPY_BUTTON_CLASSES setting.
 */

// TODO: move these to a config file
const COPY_BUTTON_TEXT = {success: '✔ Copied!', failed: 'Failed'};
const COPY_BUTTON_CLASSES = {
  success: {
    add: ['disabled'],
    remove: [],
  },
  failed: {
    add: ['disabled', 'btn-outline-danger', 'text-danger'],
    remove: ['btn-outline-secondary'],
  },
};

/**
 * Event handling function to be set up as a listener on copy buttons. Gets the
 * innerText of the copy button's target, copies it to the user's clipboard and
 * updates the copy button with a success or failure message.
 * @param {Event} evt The event that is being handled
 */
function copyButtonEventHandler(evt) {
  const copyButton = evt.target;
  let elementContainingText;
  try {
    elementContainingText = getCopyButtonTargetElement(copyButton);
  } catch (err) {
    console.error(err);
    updateCopyButtonOnFailure(copyButton);
    return;
  }

  // Copy the selected text to the clipboard, then update the event target's
  // styling and innerText based on the result.
  const newText = elementContainingText.innerText;
  navigator.clipboard.writeText(newText).then(
      function() {
        updateCopyButtonOnSuccess(copyButton);
      },
      function(error) {
        updateCopyButtonOnFailure(copyButton);
        throw new Error(`Failed to write to clipboard. Reason: ${error}`);
      },
  );
}

/**
 * Given a copy button element, this function returns the HTML element targeted
 * by that button. If the button is missing a required attribute, an Error is
 * thrown.
 * @param {HTMLElement} copyButton  An HTML element representing a copy button
 * @return {HTMLElement} The element which the copy button targets
 */
function getCopyButtonTargetElement(copyButton) {
  const copyButtonTargetSelector = copyButton.dataset.copyButtonTarget;
  if (copyButtonTargetSelector === undefined) {
    throw new Error(`Could not identify the element whose text should be
    copied. This copy button has no data-copy-button-target element.`);
  }

  const copyButtonTarget = document.querySelector(copyButtonTargetSelector);
  if (copyButtonTarget === null) {
    throw new Error(`Could not select the copy button's target element. Query
    selector '${copyButtonTargetSelector}' returned null.`);
  }

  return copyButtonTarget;
}

/**
 * Updates a copy button to its 'success' state - changes its innerText and
 * CSS classes to the configured values.
 * @param {HTMLElement} copyButton The copy button to be updated
 */
function updateCopyButtonOnSuccess(copyButton) {
  copyButton.classList.remove(...COPY_BUTTON_CLASSES.success.remove);
  copyButton.classList.add(...COPY_BUTTON_CLASSES.success.add);
  copyButton.innerText = COPY_BUTTON_TEXT.success;
}

/**
 * Updates a copy button to its 'failed' state - changes its innerText and
 * CSS classes to the configured values.
 * @param {HTMLElement} copyButton The copy button to be updated
 */
function updateCopyButtonOnFailure(copyButton) {
  copyButton.classList.remove(...COPY_BUTTON_CLASSES.failed.remove);
  copyButton.classList.add(...COPY_BUTTON_CLASSES.failed.add);
  copyButton.innerText = COPY_BUTTON_TEXT.failed;
}

/**
 * Iterate over all HTML elements with the `data-copy-button="copyButton"`
 * attribute and sets up the `copyButtonEventHandler` function as a 'click'
 * event listener
 */
function copyButtonsSetup() {
  const copyButtons = document.querySelectorAll(
      '[data-copy-button="copyButton"]'
  );
  for (const copyButton of copyButtons) {
    copyButton.addEventListener('click', copyButtonEventHandler);
  }
}

export {COPY_BUTTON_TEXT, COPY_BUTTON_CLASSES, copyButtonsSetup};



/** @file
 * A module for setting up reactive buttons to copy text on a web page.
 * See the readme at https://github.com/willfirman/copyButtons for usage tips.
 */

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


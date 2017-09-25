<?php
/**
 * @file
 * Contains \Drupal\pbot\Plugin\Preprocess\Page.
 */

namespace Drupal\pbot\Plugin\Preprocess;

use Drupal\bootstrap\Annotation\BootstrapPreprocess;
use Drupal\bootstrap\Utility\Element;
use Drupal\bootstrap\Utility\Variables;

/**
 * Pre-processes variables for the "input" theme hook.
 *
 * @ingroup plugins_preprocess
 *
 * @BootstrapPreprocess("input")
 */
class Input extends \Drupal\bootstrap\Plugin\Preprocess\Input {

  /**
   * {@inheritdoc}
   */
  public function preprocessElement(Element $element, Variables $variables) {
    parent::preprocessElement($element, $variables);
    // never use input group with radios and checkboxes
    $is_toggle = $element->isType(['radio', 'checkbox']);
    if ($is_toggle) {
        $variables['input_group'] = FALSE;
        $suffix = $variables['suffix'];
        $suffix['#attributes']['class'] = [];
        $variables['suffix'] = $suffix;
    }
  }
}
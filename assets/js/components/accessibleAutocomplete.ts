import accessibleAutocomplete from 'accessible-autocomplete'
import { Component } from 'govuk-frontend'

// eslint-disable-next-line import/prefer-default-export
export class AccessibleAutocompleteEnhancedSelect extends Component<HTMLSelectElement> {
  static moduleName = 'autocomplete-enhanced-select'

  static elementType = HTMLSelectElement

  constructor(root: HTMLSelectElement) {
    super(root)

    accessibleAutocomplete.enhanceSelectElement({
      selectElement: root,
      showAllValues: false,
      autoselect: false,
      defaultValue: '',
    })
  }
}

import accessibleAutocomplete from 'accessible-autocomplete'
import { Component } from 'govuk-frontend'

export class AccessibleAutocompleteEnhancedSelect extends Component<HTMLSelectElement> {
  static moduleName = 'autocomplete-enhanced-select'

  static elementType = HTMLSelectElement

  constructor(root: HTMLSelectElement) {
    super(root)

    accessibleAutocomplete.enhanceSelectElement({
      selectElement: root,
      showAllValues: true,
      autoselect: true,
      preserveNullOptions: true,
      defaultValue: '',
    })
  }
}

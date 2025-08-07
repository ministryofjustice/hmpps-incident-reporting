import { Component } from 'govuk-frontend'

export abstract class Dialogue extends Component<HTMLDialogElement> {
  static elementType = HTMLDialogElement

  constructor(root: HTMLDialogElement) {
    super(root)

    root.querySelectorAll('button[name="userAction"]').forEach((button: HTMLButtonElement) => {
      button.addEventListener('click', event => {
        event.preventDefault()
        root.close(button.value)
      })
    })
    root.addEventListener('close', this.onClose.bind(this))
  }

  open(): void {
    // reset value
    this.$root.returnValue = ''

    // open modal
    this.$root.showModal()

    // focus on wrapper element
    this.$root.addEventListener('focus', () => this.$root.setAttribute('tabindex', '1'), { once: true })
    this.$root.addEventListener('blur', () => this.$root.removeAttribute('tabindex'), { once: true })
    this.$root.focus()
  }

  abstract onClose(): void
}

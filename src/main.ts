import { Controller } from 'stimulus'
import nextFrame from './helpers/nextFrame'
import afterTransition from './helpers/afterTransition'

type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T;
}

export default class extends Controller {
  declare contentTargets: HTMLElement[]
  declare durationValue: number
  declare hasDurationValue: boolean
  declare multipleValue: boolean
  declare hasMultipleValue: boolean
  declare alwaysValue: boolean
  declare hasAllwaysValue: boolean
  declare activeClass: string
  declare hasActiveClass: boolean
  declare activeClassName: string
  declare transitionValue: string
  declare hasTransitionValue: boolean

  static targets = [
    'content'
  ]

  static values = {
    duration: Number,
    multiple: Boolean,
    always: Boolean,
    transition: String,
  }

  static classes = [
    'active'
  ]

  connect (): void {
    // set default values
    this.durationValue = this.hasDurationValue ? this.durationValue : 200
    this.multipleValue = this.hasMultipleValue ? this.multipleValue : false
    this.activeClassName = this.hasActiveClass ? this.activeClass : 'is-active'
  }

  async trigger (event: HTMLElementEvent<HTMLButtonElement>): void {

    const toggleTarget = event.target
    const contentTarget = this.contentTargets.find(el => el.dataset.id === toggleTarget.dataset.id)

    if (!contentTarget) return
    
    if (this.alwaysValue) {
      let otherTabOpen = false
      this.contentTargets.forEach(target => {
        if (target !== contentTarget && target.classList.contains(this.activeClassName)) {
          otherTabOpen = true
        }
      })

      if (!otherTabOpen && contentTarget?.classList.contains(this.activeClassName)) {
        return
      }
    }

    if (!this.multipleValue) {
      var promises: Promise<void>[] = []

      this.contentTargets.forEach(element => {
        if (element.dataset.id !== event.target.dataset.id) {
          promises.push(this.hideElement(element))
        }
      })

      await Promise.all(promises)
    }

    this.toggleElement(contentTarget)
  }

  toggleElement (element: HTMLElement): void {
    if (element.classList.contains(this.activeClassName)) {
      this.hideElement(element)
    } else {
      this.showElement(element)
    }
  }

  async showElement (element: HTMLElement): Promise<void> {
    element.classList.add(this.activeClassName)
    console.log(this)

    if (this.hasTransitionValue) {
      const transition = this.transitionValue

      element.classList.add(`${transition}-enter`)
      element.classList.add(`${transition}-enter-start`)
    
      await nextFrame()

      element.classList.remove(`${transition}-enter-start`)
      element.classList.add(`${transition}-enter-end`)
    
      await afterTransition(element)

      element.classList.remove(`${transition}-enter`)
      element.classList.remove(`${transition}-enter-end`)
    }
  }


  async hideElement (element: HTMLElement): Promise<void> {
    if (this.hasTransitionValue) {
      const transition = this.transitionValue

      element.classList.add(`${transition}-leave`)
      element.classList.add(`${transition}-leave-start`)
  
      await nextFrame();

      element.classList.remove(`${transition}-leave-start`)
      element.classList.add(`${transition}-leave-end`)
    
      await afterTransition(element);

      element.classList.remove(`${transition}-leave-end`)
      element.classList.remove(`${transition}-leave`)
    }
  
    element.classList.remove(this.activeClassName)
  }
}

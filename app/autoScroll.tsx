'use client'
import React, { useEffect, useRef } from 'react'

const AutoScroll = () => {
  const requestRef = useRef<number | null>(null)
  // Use a WeakMap to track fractional offsets per element
  const offsets = new WeakMap<HTMLElement, number>()
  // Use a WeakMap to track if an element is currently being dragged (clicked)
  const dragging = new WeakMap<HTMLElement, boolean>()

  useEffect(() => {
    // Attach events to all current and future scrolling elements.
    const attachPointerEvents = (el: HTMLElement) => {
      el.addEventListener('pointerdown', onPointerDown)
      el.addEventListener('pointerup', onPointerUp)
      el.addEventListener('pointerleave', onPointerUp)
    }

    const onPointerDown = (e: PointerEvent) => {
      const el = e.currentTarget as HTMLElement
      dragging.set(el, true)
    }

    const onPointerUp = (e: PointerEvent) => {
      const el = e.currentTarget as HTMLElement
      dragging.set(el, false)
      // Reset the accumulated offset to the current scroll position.
      offsets.set(el, el.scrollLeft)
    }

    // Get all scrolling elements and attach events.
    const elements = document.querySelectorAll<HTMLElement>('.scrolling')
    elements.forEach(el => {
      attachPointerEvents(el)
    })

    const animate = () => {
      const elements = document.querySelectorAll<HTMLElement>('.scrolling')
      elements.forEach(el => {
        // If the user is interacting with the element, skip auto-scroll.
        if (dragging.get(el)) {
          // Optionally, update our stored offset to match the user's new scroll position.
          offsets.set(el, el.scrollLeft)
          return
        }
        const prev = offsets.get(el) ?? el.scrollLeft
        const next = prev + 0.5 // adding a small fraction
        offsets.set(el, next)
        const newScroll = Math.floor(next)
        el.scrollLeft = newScroll

        if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
          // Reset when reaching the end
          el.scrollLeft = 0
          offsets.set(el, 0)
        }
      })
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)

    // Cleanup: remove animation frame and pointer events.
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
      elements.forEach(el => {
        el.removeEventListener('pointerdown', onPointerDown)
        el.removeEventListener('pointerup', onPointerUp)
        el.removeEventListener('pointerleave', onPointerUp)
      })
    }
  }, [])

  return null
}

export default AutoScroll
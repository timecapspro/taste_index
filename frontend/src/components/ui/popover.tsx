'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type PopoverContextType = {
  open: boolean
  setOpen: (open: boolean) => void
}

const PopoverContext = React.createContext<PopoverContextType | null>(null)

function usePopoverContext() {
  const ctx = React.useContext(PopoverContext)
  if (!ctx) throw new Error('Popover components must be used within Popover')
  return ctx
}

function Popover({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    function handle(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative inline-block">
        {children}
      </div>
    </PopoverContext.Provider>
  )
}

const PopoverTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }>(
  ({ asChild, onClick, ...props }, ref) => {
    const { open, setOpen } = usePopoverContext()
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setOpen(!open)
      onClick?.(event)
    }

    if (asChild && React.isValidElement(props.children)) {
      return React.cloneElement(props.children as React.ReactElement, {
        ref,
        onClick: handleClick,
      })
    }

    return <button ref={ref} onClick={handleClick} {...props} />
  }
)
PopoverTrigger.displayName = 'PopoverTrigger'

const PopoverContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { align?: 'start' | 'end' }>(
  ({ className, align = 'start', ...props }, ref) => {
    const { open } = usePopoverContext()
    if (!open) return null
    return (
      <div
        ref={ref}
        className={cn(
          'absolute z-50 mt-2 w-auto min-w-[12rem] rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
          align === 'end' ? 'right-0' : 'left-0',
          className
        )}
        {...props}
      />
    )
  }
)
PopoverContent.displayName = 'PopoverContent'

export { Popover, PopoverTrigger, PopoverContent }

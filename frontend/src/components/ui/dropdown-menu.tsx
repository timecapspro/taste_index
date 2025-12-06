'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type DropdownContextType = {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownContext = React.createContext<DropdownContextType | null>(null)

function useDropdownContext() {
  const ctx = React.useContext(DropdownContext)
  if (!ctx) throw new Error('DropdownMenu components must be used within DropdownMenu')
  return ctx
}

function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={menuRef} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }>(
  ({ className, asChild, onClick, ...props }, ref) => {
    const { open, setOpen } = useDropdownContext()

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

    return <button ref={ref} className={className} onClick={handleClick} {...props} />
  }
)
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger'

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { align?: 'start' | 'end' }
>(({ className, align = 'start', ...props }, ref) => {
  const { open } = useDropdownContext()
  if (!open) return null
  return (
    <div
      ref={ref}
      className={cn(
        'absolute z-50 mt-2 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none',
        align === 'end' ? 'right-0' : 'left-0',
        className
      )}
      {...props}
    />
  )
})
DropdownMenuContent.displayName = 'DropdownMenuContent'

const DropdownMenuLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('px-2 py-1.5 text-sm font-semibold', className)} {...props} />
))
DropdownMenuLabel.displayName = 'DropdownMenuLabel'

const DropdownMenuSeparator = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(({ className, ...props }, ref) => (
  <hr ref={ref} className={cn('my-1 h-px bg-muted', className)} {...props} />
))
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator'

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }
>(({ className, inset, onClick, ...props }, ref) => {
  const { setOpen } = useDropdownContext()
  return (
    <div
      ref={ref}
      className={cn(
        'flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground',
        inset && 'pl-8',
        className
      )}
      onClick={(event) => {
        setOpen(false)
        onClick?.(event)
      }}
      {...props}
    />
  )
})
DropdownMenuItem.displayName = 'DropdownMenuItem'

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
}

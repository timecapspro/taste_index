'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type SheetContextType = {
  open: boolean
  setOpen: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextType | null>(null)

function useSheet() {
  const ctx = React.useContext(SheetContext)
  if (!ctx) throw new Error('Sheet components must be used within Sheet')
  return ctx
}

function Sheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return <SheetContext.Provider value={{ open, setOpen }}>{children}</SheetContext.Provider>
}

const SheetTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }>(
  ({ asChild, onClick, ...props }, ref) => {
    const { open, setOpen } = useSheet()
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
SheetTrigger.displayName = 'SheetTrigger'

function SheetOverlay({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { open, setOpen } = useSheet()
  if (!open) return null
  return <div className={cn('fixed inset-0 z-50 bg-black/50', className)} onClick={() => setOpen(false)} {...props} />
}

const SheetContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { side?: 'left' | 'right' | 'top' | 'bottom' }
>(({ className, side = 'right', ...props }, ref) => {
  const { open, setOpen } = useSheet()
  if (!open) return null
  const sideClasses: Record<typeof side, string> = {
    right: 'right-0 top-0 h-full w-full max-w-md',
    left: 'left-0 top-0 h-full w-full max-w-md',
    top: 'top-0 left-0 w-full max-h-[90vh]',
    bottom: 'bottom-0 left-0 w-full max-h-[90vh]',
  }
  return (
    <div className="fixed inset-0 z-50 flex">
      <SheetOverlay />
      <div
        ref={ref}
        className={cn(
          'relative ml-auto flex h-full w-full flex-col border bg-background p-6 shadow-lg',
          sideClasses[side],
          side === 'bottom' && 'ml-0 mt-auto rounded-t-2xl',
          side === 'top' && 'ml-0 mb-auto rounded-b-2xl',
          (side === 'left' || side === 'right') && 'rounded-none',
          className
        )}
        {...props}
      />
    </div>
  )
})
SheetContent.displayName = 'SheetContent'

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mb-4 space-y-1 text-center sm:text-left', className)} {...props} />
)
SheetHeader.displayName = 'SheetHeader'

const SheetTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>( ({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn('text-lg font-semibold', className)} {...props} />
))
SheetTitle.displayName = 'SheetTitle'

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle }

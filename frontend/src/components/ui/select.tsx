'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type SelectContextType = {
  open: boolean
  setOpen: (o: boolean) => void
  value?: string
  onChange?: (value: string) => void
}

const SelectContext = React.createContext<SelectContextType | null>(null)

function useSelect() {
  const ctx = React.useContext(SelectContext)
  if (!ctx) throw new Error('Select components must be used within Select')
  return ctx
}

function Select({ value, onValueChange, children }: { value?: string; onValueChange?: (value: string) => void; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return (
    <SelectContext.Provider value={{ open, setOpen, value, onChange: onValueChange }}>
      <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
  )
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>( (
  { className, children, onClick, ...props }, ref
) => {
  const { open, setOpen } = useSelect()
  return (
    <button
      ref={ref}
      type="button"
      onClick={(event) => {
        setOpen(!open)
        onClick?.(event)
      }}
      className={cn(
        'flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})
SelectTrigger.displayName = 'SelectTrigger'

function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value } = useSelect()
  return <span className="truncate text-left text-sm text-foreground">{value || placeholder}</span>
}

const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>( ({ className, ...props }, ref) => {
  const { open } = useSelect()
  if (!open) return null
  return (
    <div
      ref={ref}
      className={cn('absolute z-50 mt-1 w-full min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md', className)}
      {...props}
    />
  )
})
SelectContent.displayName = 'SelectContent'

const SelectItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value: string }>(
  ({ className, value, onClick, ...props }, ref) => {
    const { onChange, setOpen } = useSelect()
    return (
      <div
        ref={ref}
        role="option"
        tabIndex={0}
        className={cn('flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground', className)}
        onClick={(event) => {
          onChange?.(value)
          setOpen(false)
          onClick?.(event)
        }}
        {...props}
      />
    )
  }
)
SelectItem.displayName = 'SelectItem'

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }

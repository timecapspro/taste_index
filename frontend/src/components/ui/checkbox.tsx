'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className, checked, defaultChecked, ...props }, ref) => {
  const [internalChecked, setInternalChecked] = React.useState<boolean>(Boolean(defaultChecked))
  const isControlled = checked !== undefined
  const value = isControlled ? Boolean(checked) : internalChecked

  return (
    <label className={cn('inline-flex items-center', className)}>
      <input
        ref={ref}
        type="checkbox"
        className="h-4 w-4 rounded border border-input bg-background text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        checked={value}
        onChange={(e) => {
          if (!isControlled) setInternalChecked(e.target.checked)
          props.onChange?.(e)
        }}
        {...props}
      />
    </label>
  )
})
Checkbox.displayName = 'Checkbox'

export { Checkbox }

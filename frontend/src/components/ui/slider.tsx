'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type SliderProps = {
  value: number[]
  min?: number
  max?: number
  step?: number
  onValueChange?: (value: number[]) => void
  className?: string
}

function Slider({ value, min = 0, max = 100, step = 1, onValueChange, className }: SliderProps) {
  const val = value?.[0] ?? 0
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={(e) => onValueChange?.([Number(e.target.value)])}
        className="h-2 w-full cursor-pointer appearance-none rounded bg-muted"
      />
      <span className="text-xs text-muted-foreground tabular-nums">{val}</span>
    </div>
  )
}

export { Slider }

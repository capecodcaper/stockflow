import { useState, useEffect, useCallback } from 'react'
import { Undo2, X } from 'lucide-react'

/**
 * UndoToast — shows a toast bar at the bottom of the screen with an Undo button.
 * Auto-dismisses after `duration` ms. If the user clicks Undo, calls `onUndo`.
 * When the toast disappears without undo, calls `onExpire` (the action is finalized).
 *
 * Props:
 *   message   — text to show (e.g. "Product deleted")
 *   onUndo    — called when user clicks Undo (restore the item)
 *   onExpire  — called when the toast disappears without undo (finalize the action)
 *   onDismiss — called to remove the toast from parent state
 *   duration  — ms before auto-dismiss (default 5000)
 */
export default function UndoToast({ message, onUndo, onExpire, onDismiss, duration = 5000 }) {
  const [progress, setProgress] = useState(100)
  const [dismissed, setDismissed] = useState(false)

  const dismiss = useCallback((didUndo) => {
    if (dismissed) return
    setDismissed(true)
    if (didUndo) {
      onUndo?.()
    } else {
      onExpire?.()
    }
    // Small delay so the fade-out animation plays
    setTimeout(() => onDismiss?.(), 200)
  }, [dismissed, onUndo, onExpire, onDismiss])

  // Countdown timer
  useEffect(() => {
    const start = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)
      if (remaining <= 0) {
        clearInterval(interval)
        dismiss(false)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [duration, dismiss])

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-md transition-all duration-200 ${dismissed ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
      <div className="bg-gray-900 dark:bg-gray-700 text-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm font-medium">{message}</span>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => dismiss(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-lg text-sm font-semibold transition-colors"
            >
              <Undo2 className="w-3.5 h-3.5" />
              Undo
            </button>
            <button
              onClick={() => dismiss(false)}
              className="p-1 text-white/50 hover:text-white/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Progress bar countdown */}
        <div className="h-1 bg-white/10">
          <div
            className="h-1 bg-indigo-400 transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

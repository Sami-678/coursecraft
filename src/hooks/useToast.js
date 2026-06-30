import { useState, useRef, useCallback } from 'react';

/**
 * useToast
 * Returns { toast, showToast } where:
 *   toast  = { message, isError, visible }
 *   showToast(msg, isError?) triggers a 2.8 s auto-dismiss notification
 */
export function useToast() {
  const [toast, setToast] = useState({ message: '', isError: false, visible: false });
  const timerRef = useRef(null);

  const showToast = useCallback((message, isError = false) => {
    setToast({ message, isError, visible: true });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(
      () => setToast((t) => ({ ...t, visible: false })),
      2800
    );
  }, []);

  return { toast, showToast };
}

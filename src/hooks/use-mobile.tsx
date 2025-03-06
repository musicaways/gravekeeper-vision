
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Initial check on mount
    checkIfMobile()
    
    // Set up the listener
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      checkIfMobile()
    }
    
    // Use the appropriate event listener based on browser support
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange)
    } else {
      // @ts-ignore - For older browsers
      mql.addListener(onChange)
    }
    
    // Cleanup
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onChange)
      } else {
        // @ts-ignore - For older browsers
        mql.removeListener(onChange)
      }
    }
  }, [])
  
  function checkIfMobile() {
    // Check both screen width and userAgent to be extra sure
    const byWidth = window.innerWidth < MOBILE_BREAKPOINT
    const byUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    setIsMobile(byWidth || byUserAgent)
  }

  // While undefined (during SSR), assume not mobile
  return isMobile === undefined ? false : isMobile
}

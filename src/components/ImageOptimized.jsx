import React from 'react'

// ImageOptimized: simple wrapper for picture element
// Robustly handles asset imports (Vite returns URL string) and module objects
// Props:
// - webp: webp src or srcset string
// - src: fallback image (png/jpg/svg) or srcset string
// - alt: alt text
// - sizes, srcSet: optional
export default function ImageOptimized({webp, src, alt = '', sizes, srcSet, className}) {
  const resolve = (val) => {
    if (!val) return undefined
    if (typeof val === 'string') return val
    // handle module object like { default: '/assets/..' }
    if (val && typeof val === 'object') return val.default || val.src || undefined
    return undefined
  }

  const webpResolved = resolve(webp)
  const srcResolved = resolve(src)
  // debug log to help diagnose missing images in the browser console
  // (will appear in the page console when the component renders)
  try {
    // eslint-disable-next-line no-console
    console.log('[ImageOptimized] resolved', { srcResolved, webpResolved, sizes, srcSet })
  } catch (e) {}

  const picClass = className ? `${className} debug-outline` : 'debug-outline'

  return (
    <picture className={picClass}>
      {webpResolved && <source type="image/webp" srcSet={webpResolved} sizes={sizes} />}
      {srcResolved ? (
        <img src={srcResolved} srcSet={srcSet} sizes={sizes} alt={alt} loading="lazy" style={{display:'block',width:'100%',height:'100%'}} />
      ) : (
        // fallback empty element to avoid layout shift when no src provided
        <img src={''} alt={alt} style={{display:'none'}} />
      )}
    </picture>
  )
}

import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)
  const { src, fallbackSrc, alt, style, className, ...rest } = props
  const [imgSrc, setImgSrc] = useState(src)

  React.useEffect(() => {
    setImgSrc(src)
    setDidError(false)
  }, [src])

  const handleError = () => {
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc)
    } else {
      setDidError(true)
    }
  }

  return didError ? (
    <div
      className={`inline-flex items-center justify-center bg-[#0d1421] border border-[#00F5FF]/20 text-center ${className ?? ''}`}
      style={style}
    >
      <div className="flex flex-col items-center justify-center w-full h-full p-4 text-[#00F5FF]/60">
        <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="text-xs fira-code text-gray-400">{alt || 'Profile Image'}</span>
      </div>
    </div>
  ) : (
    <img src={imgSrc} alt={alt} className={className} style={style} {...rest} onError={handleError} />
  )
}

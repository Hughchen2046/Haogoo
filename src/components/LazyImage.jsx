import { useState } from 'react';
import { BeatLoader } from 'react-spinners';

/**
 * LazyImage - 懶加載圖片元件
 * 使用原生 loading="lazy" 實現延遲加載
 *
 * @param {string} src - 圖片來源
 * @param {string} alt - 替代文字
 * @param {string} className - CSS 類別
 * @param {string} placeholderColor - 佔位背景色
 * @param {number} loaderSize - BeatLoader 大小 (預設: 12)
 */
const LazyImage = ({
  src,
  alt = '',
  className = '',
  placeholderColor = 'transparent',
  loaderSize = 12,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`lazy-image-wrapper ${className}`}
      style={{
        backgroundColor: placeholderColor,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* 載入中動畫 */}
      {!isLoaded && !hasError && (
        <div style={{ position: 'absolute', zIndex: 1 }}>
          <BeatLoader color="var(--bs-primary, #2fa58d)" size={loaderSize} />
        </div>
      )}

      {/* 圖片 */}
      <img
        src={hasError ? '/placeholder.svg' : src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`lazy-image ${isLoaded ? 'loaded' : ''}`}
        loading="lazy"
        decoding="async"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        {...props}
      />
    </div>
  );
};

export default LazyImage;

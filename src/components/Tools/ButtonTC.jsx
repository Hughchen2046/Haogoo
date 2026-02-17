// ButtonTextChange.jsx

export default function ButtonTC({ label = '水泥工業', className = '', ...props }) {
  return (
    <button type="button" className={`btn btc-btn ${className}`} {...props}>
      <span className="btc-text-wrap">
        <span className="btc-text btc-text--top">{label}</span>
        <span className="btc-text btc-text--bottom">{label}</span>
      </span>
    </button>
  );
}

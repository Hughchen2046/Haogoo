export default function StockCard({ stockName, stockPrice }) {
  return (
    <div style={{ border: "2px solid red", padding: 16, marginBottom: 12 }}>
      <h2>{stockName || "測試名稱"}</h2>
      <p>價格：{stockPrice || "測試價格"}</p>
    </div>
  );
}

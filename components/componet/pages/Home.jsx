import StockCard from "../components/StockCard/StockCard";

export default function Home() {
  const stockData = [
    { stockName: "AAPL", stockPrice: 180, stockChange: 2.5, details: "Apple Inc. stock info..." },
    { stockName: "TSLA", stockPrice: 720, stockChange: -1.2, details: "Tesla Inc. stock info..." },
  ];

  return (
    <div style={{ padding: "20px" }}>
      {stockData.map((stock, idx) => (
        <StockCard
          key={idx}
          stockName={stock.stockName}
          stockPrice={stock.stockPrice}
          stockChange={stock.stockChange}
          details={stock.details}
        />
      ))}
    </div>
  );
}


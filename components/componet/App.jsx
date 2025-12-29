import StockCard from "./StockCard";
{symbols.map(item => (
  <StockCard
    key={item.id}
    stockName={item.name}       // 確認 item 有 name
    stockPrice={item.price}     // 確認 item 有 price
  />
))}

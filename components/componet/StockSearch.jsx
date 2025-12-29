import Input from './Input'
import Button from './Button'

export default function StockSearch() {
  return (
    <section className="stock-search">
      <Input placeholder="搜尋股票 / ETF" />
      <Button>搜尋</Button>
    </section>
  )
}

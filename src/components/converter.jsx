import { useEffect, useState } from "react";
import { getRates } from "../api";
import "./converter.css";

export default function Converter() {
  const [rates, setRates] = useState({});
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("NGN");
  const [result, setResult] = useState(null);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 60000);
    return () => clearInterval(interval);
  }, [from]);

  const fetchRates = async () => {
    const data = await getRates(from);
    setRates(data.rates);
  };

  useEffect(() => {
    if (rates[to]) {
      setResult((amount * rates[to]).toFixed(2));
    }
  }, [amount, to, rates]);

  /* Swap currencies */
  const swapCurrencies = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  /* Toggle theme */
  const toggleTheme = () => {
    document.body.classList.toggle("light");
    setDark(!dark);
  };

  return (
    <div className="converter">
      <div className="live-indicator">
        <span className="live-dot"></span>
        Live
      </div>

      <button className="theme-toggle" onClick={toggleTheme}>
        {dark ? "Light" : "Dark"}
      </button>
    
    <h1>Chanji</h1>
      <h2>Currency Converter</h2>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <div className="currency-row">
        <select value={from} onChange={(e) => setFrom(e.target.value)}>
          {Object.keys(rates).map((cur) => (
            <option key={cur}>{cur}</option>
          ))}
        </select>

        <button className="swap-btn" onClick={swapCurrencies}>
          ⇅
        </button>

        <select value={to} onChange={(e) => setTo(e.target.value)}>
          {Object.keys(rates).map((cur) => (
            <option key={cur}>{cur}</option>
          ))}
        </select>

        <div className="currency-picker">
          <button className="picker-btn">
            <img
              src={`https://flagcdn.com/24x18/${from.slice(0, 2).toLowerCase()}.png`}
            />
            {from}
          </button>
        </div>
      </div>

      <h2>
        {amount} {from} = {result} {to}
      </h2>
    </div>
  );
}

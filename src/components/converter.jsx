import { useEffect, useState } from "react";
import { getRates } from "../api";
import "./converter.css";

export default function Converter() {
  const [rates, setRates] = useState({});
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("NGN");
  const [result, setResult] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [dark, setDark] = useState(true);

  /* Fetch rates */
  const fetchRates = async () => {
    try {
      const data = await getRates(from);
      setRates(data.rates);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch rates", error);
    }
  };

  /* Auto refresh every 30 seconds */
  useEffect(() => {
    fetchRates();

    const interval = setInterval(() => {
      fetchRates();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [from]);

  /* Convert currency */
  useEffect(() => {
    if (rates[to]) {
      setResult((amount * rates[to]).toFixed(2));
    }
  }, [amount, to, rates]);

  /* Swap currencies */
  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
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
        Auto updating
      </div>

      <button className="theme-toggle" onClick={toggleTheme}>
        {dark ? "Light" : "Dark"}
      </button>

      <h1>Currency Converter</h1>

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
      </div>

      <h2>
        {amount} {from} = {result} {to}
      </h2>

      {/* Last updated */}
      {lastUpdated && (
        <p className="updated-time">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}

      {/* Manual refresh */}
      <button className="refresh-btn" onClick={fetchRates}>
        Refresh now
      </button>
    </div>
  );
}
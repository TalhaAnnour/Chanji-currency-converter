export const getRates = async (base = "USD") => {
  const res = await fetch(`https://open.er-api.com/v6/latest/${base}`);
  const data = await res.json();
  return data;
};
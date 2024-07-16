import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [Date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then(transactions => {
      setTransactions(transactions);
    });
  }, []);

  async function getTransactions() {
    const res = await fetch("http://localhost:5000/api/transactions");
    return await res.json();
  }

  const addNewTransaction = async (e) => {
    e.preventDefault();
    try {
      const price = name.split(' ')[0];
      const res = await fetch("http://localhost:5000/api/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price, name: name.substring(price.length + 1), Date, description }),
      });

      const data = await res.json();

      // Update transactions state with the new transaction data
      setTransactions([...transactions, data]);

      // Clear input fields after successful submission
      setName("");
      setDate("");
      setDescription("");

      console.log(data);
    } catch (error) {
      console.error("Error adding transaction:", error.message);
    }
  };

  let balance = 0;
  for (const transaction of transactions) {
    balance += transaction.price;
  }

  return (
    <main>
      <div className="container">
        <form onSubmit={addNewTransaction}>
          <h1 className="appHeading">MoneyTracker</h1>
          <h2 className={`balance ${balance < 0 ? "red" : "green"}`}>{balance} ₹</h2>
          <div className="basicInfo">
            <input
              type="text"
              placeholder="-20000 samsung tv"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />
            <input
              type="datetime-local"
              placeholder="time"
              value={Date}
              onChange={(ev) => setDate(ev.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="description"
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
            />
          </div>
          <button>Add new transaction</button>
          <p>Total transactions: {transactions.length}</p>
        </form>
        <div className="transactions">
          {transactions.map(transaction => (
            <div className="transaction" key={transaction._id}>
              <div className="left">
                <div className="transactionName">{transaction.name}</div>
                <div className="transactionDescription">{transaction.description}</div>
              </div>
              <div className="right">
                <div className={`transactionPrice ${transaction.price < 0 ? "red" : "green"}`}>{`${transaction.price} ₹`}</div>
                <div className="transactionDate">{transaction.Date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default App;

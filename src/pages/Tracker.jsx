import React from "react";
import styles from "./Tracker.module.css";
import { Link } from "react-router";

const transactions = [
  // Example transaction data
  {
    id: 1,
    image: "/vite.svg",
    type: "income",
    amount: 100,
    category: "Salary",
    subcategory: "Monthly",
    date: "2023-10-01",
  },
  {
    id: 2,
    image: "/vite.svg",
    type: "expense",
    amount: 50,
    category: "Groceries",
    subcategory: "Monthly",
    date: "2023-10-01",
  },
  {
    id: 1,
    image: "/vite.svg",
    type: "income",
    amount: 100,
    category: "Salary",
    subcategory: "Monthly",
    date: "2023-10-01",
  },
  {
    id: 2,
    image: "/vite.svg",
    type: "expense",
    amount: 50,
    category: "Groceries",
    subcategory: "Monthly",
    date: "2023-10-01",
  },
  {
    id: 1,
    image: "/vite.svg",
    type: "income",
    amount: 100,
    category: "Salary",
    subcategory: "Monthly",
    date: "2023-10-01",
  },
  {
    id: 2,
    image: "/vite.svg",
    type: "expense",
    amount: 50,
    category: "Groceries",
    subcategory: "Monthly",
    date: "2023-10-01",
  },
  {
    id: 1,
    image: "/vite.svg",
    type: "income",
    amount: 100,
    category: "Salary",
    subcategory: "Monthly",
    date: "2023-10-01",
  },
  {
    id: 2,
    image: "/vite.svg",
    type: "expense",
    amount: 50,
    category: "Groceries",
    subcategory: "Monthly",
    date: "2023-10-01",
  },
];
function Tracker() {
  return (
    <div>
      <div className={styles.balance}>
        <h4>Total balance</h4>
        <span>0.00€</span>
      </div>

      <section className={styles.options}>
        <button className={styles.income}>Add Income</button>
        <button className={styles.expense}>Add Expense</button>
      </section>

      <section className={styles.transactions}>
        <div className={styles.flex}>
          <h3>Transações recentes</h3>
          <Link to="transactions">Ver tudo</Link>
        </div>
        <div>
          {transactions.map((transaction) => (
            <div key={transaction.id} className={styles.transaction}>
              <img src={transaction.image} alt="" />
              <div className={styles.descriptions}>
                <h4>{transaction.category}</h4>
                <p>{transaction.subcategory}</p>
                <p>{transaction.date}</p>
              </div>

              <p className={styles.income}>
                {transaction.type === "income" ? "+" : "-"}
                {transaction.amount}€
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Tracker;

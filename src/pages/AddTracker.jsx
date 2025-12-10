import React, { useState } from "react";
import { Link, useParams } from "react-router";
import styles from "./AddTracker.module.css";
import { Cascader, DatePicker } from "antd";
import TextArea from "antd/es/input/TextArea";

const values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];
const categories = [
  {
    id: 1,
    name: "Food",
    children: [
      { id: 1, name: "Groceries" },
      { id: 2, name: "Restaurants" },
    ],
  },
  {
    id: 2,
    name: "Transport",
    children: [
      { id: 3, name: "Public Transport" },
      { id: 4, name: "Taxi" },
    ],
  },
  {
    id: 3,
    name: "Entertainment",
    children: [
      { id: 5, name: "Movies" },
      { id: 6, name: "Games" },
    ],
  },
  {
    id: 4,
    name: "Salary",
    children: [],
  },
];

function AddTracker() {
  const { type } = useParams();
  const [form, setForm] = useState({
    description: undefined,
    category: undefined,
    date: undefined,
    type: type,
    total: undefined,
  });

  const handleKeypadClick = (value) => {
    if (value === "⌫") {
      setForm({ ...form, total: form.total.slice(0, -1) });
    } else {
      setForm({ ...form, total: (form.total || "") + value });
    }
  };

  return (
    <div>
      <div className={styles.totalContainer}>
        {type == "income" ? "+" : "-"}
        <span>{form.total ? form.total : "0"}€</span>
      </div>

      <div className={styles.keypadContainer}>
        {values.map((value) => (
          <div onClick={() => handleKeypadClick(value)}>{value}</div>
        ))}
      </div>

      <section className={styles.form}>
        <div className={styles.formItem}>
          <p>Categoria</p>
          <Cascader
            style={{ width: "100%" }}
            value={form.category}
            fieldNames={{ label: "name", value: "id", children: "children" }}
            options={categories}
            onChange={(value, selectedOptions) => {
              setForm({ ...form, category: value });
            }}
            placeholder="Please select"
          />
        </div>
        <div className={styles.formItem}>
          <p>Data</p>
          <DatePicker
            style={{ width: "100%" }}
            value={form.date}
            onChange={(date) => setForm({ ...form, date })}
            placeholder="Please select"
          />
        </div>
        <p>Comentários</p>
        <TextArea
          style={{ width: "100%" }}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Please enter comments"
          rows={4}
        />
      </section>
      <div className={styles.buttonContainer}>
        <button
          type="reset"
          onClick={() =>
            setForm({
              description: undefined,
              category: undefined,
              date: undefined,
              type: type,
              total: undefined,
            })
          }
        >
          Reset
        </button>
        <button type="submit">Submeter</button>
      </div>
    </div>
  );
}

export default AddTracker;

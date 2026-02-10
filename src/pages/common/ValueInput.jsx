import React from "react";
import styles from "./ValueInput.module.css";
const values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];

function ValueInput(props) {
  const { form } = props;

  const handleKeypadClick = (value) => {
    if (value === "⌫") {
      props.setForm({ ...form, amount: form.amount.slice(0, -1) });
    } else {
      props.setForm({ ...form, amount: (form.amount || "") + value });
    }
  };

  return (
    <div>
      <div className={styles.totalContainer}>
        {form.type}
        <span>{form.amount ? form.amount : "0"}€</span>
      </div>

      <div className={styles.keypadContainer}>
        {values.map((value) => (
          <div onClick={() => handleKeypadClick(value)}>{value}</div>
        ))}
      </div>
    </div>
  );
}

export default ValueInput;

import React, { useEffect, useState } from "react";
import { Link, Navigate, redirect, useNavigate, useParams } from "react-router";
import styles from "./AddTracker.module.css";
import { Cascader, DatePicker } from "antd";
import TextArea from "antd/es/input/TextArea";
import { fetchTransactionCategories } from "../redux/redux-modules/transactionCategory/actions";
import { createTransaction } from "../redux/redux-modules/transaction/actions";

import { connect } from "react-redux";

const values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];

function AddTracker(props) {
  const navigate = useNavigate();
  const { type } = useParams();
  const [form, setForm] = useState({
    description: undefined,
    category: undefined,
    date: undefined,
    type: type,
    amount: undefined,
  });

  useEffect(() => {
    props.fetchTransactionCategories();
  }, []);

  const handleKeypadClick = (value) => {
    if (value === "⌫") {
      setForm({ ...form, amount: form.amount.slice(0, -1) });
    } else {
      setForm({ ...form, amount: (form.amount || "") + value });
    }
  };

  const handleSubmit = () => {
    if (form.category && form.date && form.amount) {
      props
        .createTransaction({
          ...form,
          date: new Date(form.date).toISOString().split("T")[0],
          amount: type == "income" ? form.amount : -form.amount,
        })
        .then((response) => {
          navigate("/tracker");
        });
    }
  };

  return (
    <div>
      <section className={styles.form}>
        <div className={styles.formItem}>
          <Cascader
            size="large"
            variant="filled"
            style={{ width: "100%" }}
            value={form.category}
            fieldNames={{
              label: "name",
              value: "id",
              children: "subcategories",
            }}
            options={props.data}
            onChange={(value, selectedOptions) => {
              setForm({ ...form, category: value });
            }}
            placeholder="Categoria"
          />
        </div>
        <div className={styles.formItem}>
          <DatePicker
            format="DD-MM-YYYY"
            size="large"
            variant="filled"
            style={{ width: "100%" }}
            value={form.date}
            onChange={(date) => setForm({ ...form, date })}
            placeholder="Data"
          />
        </div>
      </section>

      <div className={styles.totalContainer}>
        {type == "income" ? "+" : "-"}
        <span>{form.amount ? form.amount : "0"}€</span>
      </div>

      <div className={styles.keypadContainer}>
        {values.map((value) => (
          <div onClick={() => handleKeypadClick(value)}>{value}</div>
        ))}
      </div>

      {/* <section className={styles.form}>
        <TextArea
          size="large"
          variant="filled"
          style={{ width: "100%" }}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Introduza os seus comentários"
          rows={4}
        />
      </section> */}
      <div className={styles.buttonContainer}>
        {/* <button
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
          Cancelar
        </button> */}
        <button onClick={handleSubmit} type="submit">
          Submeter
        </button>
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTransactionCategories: (filters) =>
      dispatch(fetchTransactionCategories(filters)),
    createTransaction: (data) => dispatch(createTransaction(data)),
  };
};

const mapStateToProps = (state) => {
  return {
    data: state.transactionCategory.data,
    loading: state.transactionCategory.loading,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddTracker);

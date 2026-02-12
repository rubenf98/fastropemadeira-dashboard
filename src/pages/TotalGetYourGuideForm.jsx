import React, { useEffect, useState } from "react";
import { data, Link, useNavigate, useParams } from "react-router";
import styles from "./TotalBalanceForm.module.css";
import { Cascader, DatePicker, InputNumber, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { fetchTransactionCategories } from "../redux/redux-modules/transactionCategory/actions";
import { fetchTransactionPartners } from "../redux/redux-modules/transactionPartner/actions";

import { createTransaction } from "../redux/redux-modules/transaction/actions";

import { connect } from "react-redux";
import ValueInput from "./common/ValueInput";

function TotalGetYourGuideForm(props) {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    description: undefined,
    category: undefined,
    date: undefined,
    amount: undefined,
    n_clients: undefined,
  });

  useEffect(() => {
    props.fetchTransactionCategories({ notNormal: true });
  }, []);

  const handleSubmit = () => {
    setHasSubmitted(true);
    if (form.category && form.date && form.amount && form.n_clients) {
      props
        .createTransaction({
          ...form,
          type: "total_getyourguide",
          date: new Date(form.date).toISOString().split("T")[0],
        })
        .then((response) => {
          navigate("/tracker");
        })
        .catch((error) => {
          if (error.status == 400) {
            navigate("/tracker");
          }
        });
    }
  };

  useEffect(() => {
    if (form.category && form.n_clients) {
      var currentPrice =
        props.data
          .find((c) => c.id === form.category[0])
          ?.subcategories.find((s) => s.id === form.category[1])?.price ?? 0;

      setForm({
        ...form,
        amount: currentPrice * form.n_clients,
      });
    }
  }, [form.category, form.n_clients]);

  return (
    <div>
      <button
        className={styles.backButton}
        onClick={() => navigate("/tracker/")}
      >
        <img src="/back.svg" alt="Voltar" />
        Voltar
      </button>
      <section className={styles.form}>
        <div className={styles.formItem}>
          <Cascader
            status={hasSubmitted && !form.category ? "error" : ""}
            size="large"
            open={open}
            onOpenChange={setOpen}
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
              setOpen(false);
            }}
            placeholder="Categoria"
          />
        </div>
        <div className={styles.formItem}>
          <DatePicker
            status={hasSubmitted && !form.date ? "error" : ""}
            format="DD-MM-YYYY"
            size="large"
            variant="filled"
            style={{ width: "100%" }}
            value={form.date}
            onChange={(date) => setForm({ ...form, date })}
            placeholder="Data"
          />
        </div>
        <div className={styles.formItem}>
          <InputNumber
            status={hasSubmitted && !form.n_clients ? "error" : ""}
            size="large"
            variant="filled"
            style={{ width: "100%" }}
            value={form.n_clients}
            onChange={(value) => setForm({ ...form, n_clients: value })}
            placeholder="Nº de clientes"
          />
        </div>
      </section>

      <section className={styles.form}>
        <TextArea
          size="large"
          variant="filled"
          style={{ width: "100%" }}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Introduza os seus comentários"
          rows={4}
        />
      </section>

      {form.amount !== undefined ? (
        <section>
          <p>
            <strong>Valor Total:</strong> {form.amount}€
          </p>
          <p>
            <strong>Valor FastRope (70%):</strong>{" "}
            {parseFloat(form.amount * 0.7).toFixed(2)}€
          </p>
          <p>
            <strong>Comissão (30%):</strong>{" "}
            {parseFloat(form.amount * 0.3).toFixed(2)}€
          </p>
        </section>
      ) : null}

      <div className={styles.buttonContainer}>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TotalGetYourGuideForm);

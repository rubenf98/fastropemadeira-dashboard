import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import styles from "./AddTracker.module.css";
import { Cascader, DatePicker } from "antd";
import { fetchTransactionCategories } from "../redux/redux-modules/transactionCategory/actions";
import {
  fetchTransaction,
  updateTransaction,
} from "../redux/redux-modules/transaction/actions";
import dayjs from "dayjs";

import { connect } from "react-redux";

const values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];

function Transaction(props) {
  const { transaction } = props;
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    description: undefined,
    category: undefined,
    date: undefined,
    type: undefined,
    amount: undefined,
  });

  useEffect(() => {
    props.fetchTransactionCategories();
    props.fetchTransaction(id);
  }, []);

  useEffect(() => {
    if (transaction.id) {
      setForm({
        description: undefined,
        category: [transaction?.category?.id, transaction?.subCategory?.id],
        date: dayjs(transaction.date),
        type: transaction.type,
        amount: transaction?.amount.replace("-", ""),
      });
    }
  }, [transaction]);

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
        .updateTransaction(id, {
          ...form,
          date: new Date(form.date).toISOString().split("T")[0],
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
        {props.transaction.type == "income" ? "+" : "-"}
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
          Atualizar
        </button>
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTransaction: (id) => dispatch(fetchTransaction(id)),
    fetchTransactionCategories: (filters) =>
      dispatch(fetchTransactionCategories(filters)),
    updateTransaction: (id, data) => dispatch(updateTransaction(id, data)),
  };
};

const mapStateToProps = (state) => {
  return {
    data: state.transactionCategory.data,
    transaction: state.transaction.current,
    loading: state.transactionCategory.loading,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);

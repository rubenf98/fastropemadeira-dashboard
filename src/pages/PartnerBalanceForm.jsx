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

function PartnerBalanceForm(props) {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    description: undefined,
    category: undefined,
    date: undefined,
    amount: undefined,
    n_clients: undefined,
    transaction_partner_id: undefined,
    willPay: undefined,
  });

  useEffect(() => {
    props.fetchTransactionCategories({ notNormal: true });
    props.fetchTransactionPartners();
  }, []);

  const handleSubmit = () => {
    setHasSubmitted(true);
    if (
      form.category &&
      form.date &&
      form.amount &&
      form.transaction_partner_id &&
      form.n_clients &&
      form.willPay !== undefined
    ) {
      props
        .createTransaction({
          ...form,
          type: "total_partners",
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
        <div style={{ width: "100%" }} className={styles.formItem}>
          <Select
            status={hasSubmitted && !form.willPay ? "error" : ""}
            size="large"
            variant="filled"
            style={{ width: "100%" }}
            value={form.willPay}
            onChange={(value) => setForm({ ...form, willPay: value })}
            placeholder="Com quem foi pago o serviço?"
            options={[
              { value: 1, label: "FastRope" },
              { value: 0, label: "Parceiro" },
            ]}
          />
        </div>
        <div className={styles.formItem}>
          <Select
            status={hasSubmitted && !form.transaction_partner_id ? "error" : ""}
            size="large"
            variant="filled"
            style={{ width: "100%" }}
            value={form.transaction_partner_id}
            fieldNames={{
              label: "name",
              value: "id",
            }}
            options={props.partners}
            onChange={(value, selectedOptions) => {
              setForm({ ...form, transaction_partner_id: value });
            }}
            placeholder="Parceiro"
          />
        </div>

        <div className={styles.formItem}>
          <Cascader
            open={open}
            onOpenChange={setOpen}
            status={hasSubmitted && !form.category ? "error" : ""}
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
            optionRender={(option) => (
              <span>
                {option.name}
                {option.price != null && (
                  <span style={{ marginLeft: 6, opacity: 0.7 }}>
                    ({option.price}€)
                  </span>
                )}
              </span>
            )}
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
            placeholder="Nº de pessoas"
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

      {form.willPay !== undefined && form.amount !== undefined ? (
        <section>
          <p>
            <strong>Valor Total:</strong> {form.amount}€
          </p>
          <p>
            {form.willPay == 1 && (
              <>
                <strong>Valor FastRope:</strong>{" "}
                {parseFloat(form.willPay == 1 ? form.amount * 0.7 : 0).toFixed(
                  2,
                )}
                €
              </>
            )}
          </p>
          <p>
            {form.willPay == 1 ? (
              <>
                <strong>Devemos ao parceiro: </strong>
                {parseFloat(form.amount * 0.3).toFixed(2)}
              </>
            ) : (
              <>
                <strong>Parceiro deve: </strong>
                {parseFloat(0.7 * form.amount).toFixed(2)}
              </>
            )}
            €
          </p>
        </section>
      ) : null}

      <div className={styles.buttonContainer}>
        {/* <button
          type="reset"
          onClick={() =>
            setForm({
              description: undefined,
              category: undefined,
              date: undefined,
              type: undefined,
              total: undefined,
            })
          }
        >
          Reset
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
    fetchTransactionPartners: (filters) =>
      dispatch(fetchTransactionPartners(filters)),
  };
};

const mapStateToProps = (state) => {
  return {
    data: state.transactionCategory.data,
    loading: state.transactionCategory.loading,
    partners: state.transactionPartner.data,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PartnerBalanceForm);

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import styles from "./TotalBalanceForm.module.css";
import { Cascader, DatePicker, Input, InputNumber, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { fetchTransactionCategories } from "../redux/redux-modules/transactionCategory/actions";
import { createTransaction } from "../redux/redux-modules/transaction/actions";

import { connect } from "react-redux";
import ValueInput from "./common/ValueInput";

function TotalBalanceForm(props) {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [extraField, setExtraField] = useState(undefined);
  const [open, setOpen] = useState(false);
  const [openTransactionType, setOpenTransactionType] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    description: undefined,
    category: undefined,
    date: undefined,
    type: undefined,
    amount: undefined,
  });

  useEffect(() => {
    props.fetchTransactionCategories();
  }, []);

  const handleSubmit = () => {
    setHasSubmitted(true);
    if (form.category && form.date && form.amount) {
      props
        .createTransaction({
          ...form,
          type: "total_balance",
          date: new Date(form.date).toISOString().split("T")[0],
          amount: form.type == "-" ? -form.amount : form.amount,
        })
        .then(() => {
          navigate("/tracker");
        });
    }
  };

  useEffect(() => {
    if (form.category) {
      if (form?.category[1]) {
        var record = checkForExtraFields();

        setExtraField(record?.extra_field ?? undefined);
      }
    }
  }, [form.category]);

  const checkForExtraFields = () => {
    for (const category of props.data) {
      if (!category.subcategories) continue;

      const subcategory = category.subcategories.find(
        (sub) => sub.id === form.category[1],
      );

      if (subcategory) {
        return subcategory;
      }
    }

    return undefined;
  };

  const cascaderFilter = (inputValue, path) => {
    return path.some((option) => {
      return option.name.toLowerCase().includes(inputValue.toLowerCase());
    });
  };

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
            showSearch={{
              filter: cascaderFilter,
              onSearch: (value) => console.log(value),
            }}
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
            onChange={(value, selectedOptions) => {
              setForm({ ...form, category: value });
              if (value.length == 2 || !value.length) {
                setOpen(false);
              }
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
          <Select
            open={openTransactionType}
            onOpenChange={setOpenTransactionType}
            onChange={(value) => {
              setForm({ ...form, type: value });

              setOpenTransactionType(false);
            }}
            status={hasSubmitted && !form.type ? "error" : ""}
            size="large"
            variant="filled"
            style={{ width: "100%" }}
            value={form.type}
            placeholder="Tipo de transação"
            options={[
              { value: "+", label: "Creditar" },
              { value: "-", label: "Debitar" },
            ]}
          />
        </div>

        {extraField === "n_clients" && (
          <div className={styles.formItem}>
            <InputNumber
              size="large"
              variant="filled"
              style={{ width: "100%" }}
              value={form.n_clients}
              onChange={(value) => setForm({ ...form, n_clients: value })}
              placeholder="Nº de pessoas"
            />
          </div>
        )}

        {extraField === "guide_name" && (
          <div className={styles.formItem}>
            <Input
              size="large"
              variant="filled"
              style={{ width: "100%" }}
              value={form.guide_name}
              onChange={(e) => setForm({ ...form, guide_name: e.target.value })}
              placeholder="Nome do guia"
            />
          </div>
        )}
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

      <ValueInput form={form} setForm={setForm} />

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
  };
};

const mapStateToProps = (state) => {
  return {
    data: state.transactionCategory.data,
    loading: state.transactionCategory.loading,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TotalBalanceForm);

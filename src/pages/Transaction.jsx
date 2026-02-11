import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import styles from "./Transaction.module.css";
import { Cascader, DatePicker, Popconfirm } from "antd";
import { fetchTransactionCategories } from "../redux/redux-modules/transactionCategory/actions";
import {
  deleteTransaction,
  fetchTransaction,
  updateTransaction,
} from "../redux/redux-modules/transaction/actions";
import dayjs from "dayjs";

import { connect } from "react-redux";

const trackerDictionary = {
  total_balance: "Geral",
  total_getyourguide: "GetYourGuide",
  total_partners: "Parceiros",
};

function Transaction(props) {
  const { transaction } = props;
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    props.fetchTransaction(id);
  }, []);

  const handleDelete = () => {
    props.deleteTransaction(id).then((response) => {
      navigate("/tracker");
    });
  };

  return (
    <div>
      <h3 style={{ textAlign: "center" }}>Resumo do registo</h3>
      <section className={styles.show}>
        <div className={styles.showItem}>
          <span>Plataforma/Tipologia</span>
          <span>{trackerDictionary[transaction.tracker?.name]}</span>
        </div>
        <div className={styles.showItem}>
          <span>Data</span>
          <span>{dayjs(transaction.date).format("DD/MM/YYYY")}</span>
        </div>
        {transaction.tracker?.name == "total_partners" && (
          <>
            <div className={styles.showItem}>
              <span>Parceiro</span>
              <span>
                <Link to={`/partner/${transaction.partner?.id}`}>
                  {transaction.partner?.name}
                </Link>
              </span>
            </div>
            <div className={styles.showItem}>
              <span>Pagamento</span>
              <span>{transaction.willPay ? "FastRope" : "Parceiro"}</span>
            </div>
          </>
        )}

        <div className={styles.showItem}>
          <span>Valor</span>
          <span>{transaction.amount}€</span>
        </div>

        <div className={styles.showItem}>
          <span>Categoria</span>
          <span>
            {transaction.category?.name} - {transaction.subCategory?.name}
          </span>
        </div>

        <div className={styles.showItem}>
          <span>Estado</span>
          <span>{transaction.pending ? "Pendente" : "Concluído"}</span>
        </div>

        {transaction.n_clients ? (
          <div className={styles.showItem}>
            <span>Nº pessoas</span>
            <span>{transaction.n_clients}</span>
          </div>
        ) : null}

        {transaction.guide_name ? (
          <div className={styles.showItem}>
            <span>Nome do guia</span>
            <span>{transaction.guide_name}</span>
          </div>
        ) : null}
      </section>

      <div className={styles.buttonContainer}>
        <Popconfirm
          onConfirm={handleDelete}
          title="Tem a certeza que quer eliminar esta transação?"
          okText="Sim"
          cancelText="Não"
        >
          <button type="reset">Apagar</button>
        </Popconfirm>
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
    deleteTransaction: (id) => dispatch(deleteTransaction(id)),
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

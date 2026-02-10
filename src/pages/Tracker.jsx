import React, { useEffect } from "react";
import styles from "./Tracker.module.css";
import { Link } from "react-router";
import TrackerGraph from "./TrackerGraph";
import { connect } from "react-redux";
import {
  fetchTransactions,
  fetchTransactionsStatistics,
} from "../redux/redux-modules/transaction/actions";
import { fetchTrackers } from "../redux/redux-modules/tracker/actions";
import MultitypeChart from "./MultitypeChart";
import { fetchTransactionPartners } from "../redux/redux-modules/transactionPartner/actions";
import { Collapse, Table } from "antd";

function Tracker(props) {
  useEffect(() => {
    props.fetchTransactions();
    props.fetchTrackers();
    props.fetchTransactionsStatistics();
    props.fetchTransactionPartners();
  }, []);

  const pendingIncome = Number(
    props.trackers.find((element) => element.name === "pending_income_partners")
      ?.value ?? 0,
  );

  const pendingPayment = Number(
    props.trackers.find(
      (element) => element.name === "pending_payment_partners",
    )?.value ?? 0,
  );

  const totalPending = pendingIncome - pendingPayment;

  return (
    <div className={styles.container}>
      <Link to="/tracker/total-balance">
        <div className={`${styles.card_content} ${styles.card}`}>
          <h4>Saldo real</h4>
          <span className={styles.total_price}>
            {
              props.trackers.find((element) => element.name == "total_balance")
                ?.value
            }
            €
          </span>
        </div>
      </Link>

      <div className={`${styles.card_content} ${styles.card}`}>
        <Link to="/tracker/partner-balance">
          <h4>Valor parceiros</h4>
          <span className={styles.total_price}>
            {
              props.trackers.find((element) => element.name == "total_partners")
                ?.value
            }
            €
          </span>

          <ul>
            <li>
              A receber:
              <span>{pendingIncome} €</span>
            </li>

            <li>
              A pagar:
              <span>{pendingPayment} €</span>
            </li>

            <li>
              Total pendente:
              <span>{totalPending} €</span>
            </li>
          </ul>
        </Link>
        <Collapse
          ghost
          items={[
            {
              key: "1",
              label: "Ver detalhes",
              children: (
                <Table
                  pagination={false}
                  columns={[
                    {
                      title: "",
                      dataIndex: "name",
                      key: "name",
                    },
                    {
                      title: "A receber",
                      dataIndex: "pending_income",
                      key: "pending_income",
                      render: (value) => (
                        <span>
                          {parseFloat(value) > 0 ? value + "€" : "--"}
                        </span>
                      ),
                    },
                    {
                      title: "A pagar",
                      dataIndex: "pending_payment",
                      key: "pending_payment",
                      render: (value) => (
                        <span>
                          {parseFloat(value) > 0 ? value + "€" : "--"}
                        </span>
                      ),
                    },
                    {
                      title: "",
                      dataIndex: "id",
                      key: "id",
                      render: (value) => (
                        <Link to={`/partner/${value}`}>
                          <button
                            style={{ cursor: "pointer", padding: "4px 12px" }}
                          >
                            Gerir
                          </button>
                        </Link>
                      ),
                    },
                  ]}
                  dataSource={props.partners}
                />
              ),
            },
          ]}
        />
      </div>

      <div className={`${styles.balance} ${styles.card}`}>
        <h4>GetYourGuide</h4>
        <span className={styles.total_price}>
          {
            props.trackers.find(
              (element) => element.name == "total_getyourguide",
            )?.value
          }
          €
        </span>
      </div>

      {/* <section className={styles.options}>
        <Link to="/tracker/income">
          <button className={styles.income}>Creditar</button>
        </Link>
        <Link to="/tracker/expense">
          <button className={styles.expense}>Debitar</button>
        </Link>
      </section> */}

      {/* <TrackerGraph data={props.statistics} /> */}
      <MultitypeChart data={props.statistics} />

      <section className={styles.transactions}>
        <div className={styles.flex}>
          <h3>Transações recentes</h3>
          <Link to="/transactions">Ver tudo</Link>
        </div>
        <div>
          {props.data.map((transaction) => (
            <Link
              to={"/transaction/" + transaction.id}
              key={transaction.id}
              className={styles.transaction}
            >
              <img
                src={import.meta.env.VITE_API_URL + transaction.category.image}
                alt=""
              />
              <div className={styles.descriptions}>
                <h4>{transaction.category.name}</h4>
                <p>{transaction.subCategory.name}</p>
                <p>{transaction.date}</p>
              </div>

              <p className={styles.income}>{transaction.amount}€</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTransactions: (page, filters) =>
      dispatch(fetchTransactions(page, filters)),
    fetchTrackers: (filters) => dispatch(fetchTrackers(filters)),
    fetchTransactionsStatistics: (filters) =>
      dispatch(fetchTransactionsStatistics(filters)),
    fetchTransactionPartners: (filters) =>
      dispatch(fetchTransactionPartners(filters)),
  };
};

const mapStateToProps = (state) => {
  return {
    data: state.transaction.data,
    statistics: state.transaction.statistics,
    partners: state.transactionPartner.data,
    loading: state.transaction.loading,
    trackers: state.tracker.data,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tracker);

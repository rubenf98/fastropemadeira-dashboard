import React, { useEffect } from "react";
import styles from "./Tracker.module.css";
import { Link } from "react-router";
import TrackerGraph from "./TrackerGraph";
import { connect } from "react-redux";
import { fetchTransactions } from "../redux/redux-modules/transaction/actions";
import { fetchTrackers } from "../redux/redux-modules/tracker/actions";

function Tracker(props) {
  useEffect(() => {
    props.fetchTransactions();
    props.fetchTrackers();
  }, []);

  return (
    <div>
      <div className={styles.balance}>
        <h4>Total</h4>
        <span>
          {
            props.trackers.find((element) => element.name == "total_balance")
              ?.value
          }
          €
        </span>
        <div className={styles.flex}>
          <div>
            <p>Crédito(s)</p>
            <span>
              {
                props.trackers.find((element) => element.name == "income")
                  ?.value
              }
              €
            </span>
          </div>
          <div>
            <p>Despesa(s)</p>
            <span>
              {
                props.trackers.find((element) => element.name == "expense")
                  ?.value
              }
              €
            </span>
          </div>
        </div>
      </div>

      <section className={styles.options}>
        <Link to="/tracker/income">
          <button className={styles.income}>Creditar</button>
        </Link>
        <Link to="/tracker/expense">
          <button className={styles.expense}>Debitar</button>
        </Link>
      </section>

      <TrackerGraph />

      <section className={styles.transactions}>
        <div className={styles.flex}>
          <h3>Transações recentes</h3>
          <Link to="transactions">Ver tudo</Link>
        </div>
        <div>
          {props.data.map((transaction) => (
            <div key={transaction.id} className={styles.transaction}>
              <img src={transaction.category.image} alt="" />
              <div className={styles.descriptions}>
                <h4>{transaction.category.name}</h4>
                <p>{transaction.subCategory.name}</p>
                <p>{transaction.date}</p>
              </div>

              <p className={styles.income}>{transaction.amount}€</p>
            </div>
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
  };
};

const mapStateToProps = (state) => {
  return {
    data: state.transaction.data,
    loading: state.transaction.loading,
    trackers: state.tracker.data,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tracker);

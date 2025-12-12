import React, { useEffect, useState } from "react";
import styles from "./Tracker.module.css";
import { Link } from "react-router";
import TrackerGraph from "./TrackerGraph";
import { connect } from "react-redux";
import { fetchTransactions } from "../redux/redux-modules/transaction/actions";
import { fetchTrackers } from "../redux/redux-modules/tracker/actions";
import { Skeleton } from "antd";

function Transactions(props) {
  const [allData, setAllData] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    props.fetchTransactions(page);

    if (page === 1) {
      setAllData([]);
    }
  }, [page]);

  useEffect(() => {
    if (props.data.length) {
      setAllData((prev) => {
        const newItems = props.data.filter(
          (d) => !prev.some((p) => p.id === d.id)
        );
        return [...prev, ...newItems];
      });
    }
  }, [props.data]);

  return (
    <div style={{ marginBottom: "50px" }}>
      <section className={styles.transactions}>
        <Skeleton loading={props.loading}>
          {allData.map((transaction) => (
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
          {!(page == props.meta.last_page) && (
            <button
              className={styles.seeMore}
              onClick={() => setPage(page + 1)}
            >
              ver mais
            </button>
          )}
        </Skeleton>
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
    meta: state.transaction.meta,

    loading: state.transaction.loading,
    trackers: state.tracker.data,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);

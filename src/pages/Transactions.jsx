import React, { useEffect, useState } from "react";
import styles from "./Tracker.module.css";
import { Link } from "react-router";
import { connect } from "react-redux";
import { fetchTransactions } from "../redux/redux-modules/transaction/actions";
import { fetchTrackers } from "../redux/redux-modules/tracker/actions";
import { Cascader, DatePicker, Input, Row, Select, Skeleton } from "antd";
import { fetchTransactionCategories } from "../redux/redux-modules/transactionCategory/actions";
import debounce from "debounce";

const trackerDictionary = {
  total_balance: "Geral",
  total_getyourguide: "GetYourGuide",
  total_partners: "Parceiros",
};

const trackerClassMap = {
  total_balance: styles.total_balance,
  total_partners: styles.total_partners,
  total_getyourguide: styles.total_getyourguide,
};

function Transactions(props) {
  const [allData, setAllData] = useState([]);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    props.fetchTransactionCategories();
  }, []);

  useEffect(() => {
    var formattedFilters = { ...filters };

    if (filters.date) {
      formattedFilters.date = filters.date.format("YYYY-MM-DD");
    }
    props.fetchTransactions(page, formattedFilters);

    if (page === 1) {
      setAllData([]);
    }
  }, [page, filters]);

  useEffect(() => {
    if (props.data.length) {
      setAllData((prev) => {
        const newItems = props.data.filter(
          (d) => !prev.some((p) => p.id === d.id),
        );
        return [...prev, ...newItems];
      });
    }
  }, [props.data]);

  const cascaderFilter = (inputValue, path) => {
    return path.some((option) => {
      return option.name.toLowerCase().includes(inputValue.toLowerCase());
    });
  };
  return (
    <div style={{ marginBottom: "50px" }}>
      <section>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: "20px", gap: "20px 0px" }}
        >
          <Input
            // value={filters.search}
            onChange={debounce(
              (e) => setFilters({ ...filters, search: e.target.value }),
              500,
            )}
            placeholder="Pesquisar"
            style={{ width: "100%" }}
          />
          <DatePicker
            allowClear
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e })}
            placeholder="Data de transação"
            style={{ width: "31%" }}
          />
          <Cascader
            value={filters.category}
            showSearch={{
              filter: cascaderFilter,
              onSearch: (value) => console.log(value),
            }}
            allowClear
            fieldNames={{
              label: "name",
              value: "id",
              children: "subcategories",
            }}
            onChange={(e) => setFilters({ ...filters, category: e })}
            options={props.categories}
            placeholder="Categoria"
            style={{ width: "31%" }}
            changeOnSelect
          />
          <Select
            value={filters.type}
            allowClear
            onChange={(e) => setFilters({ ...filters, type: e })}
            options={[
              { value: ">", label: "Crédito" },
              { value: "<", label: "Débito" },
            ]}
            placeholder="Tipo de operação"
            style={{ width: "31%" }}
          />
        </Row>

        <Row style={{ margin: "20px 0px " }} justify="end">
          <button
            style={{
              padding: "8px 28px ",
              backgroundColor: "transparent",
              cursor: "pointer",
            }}
            type="reset"
            onClick={() => setFilters({})}
            className={styles.searchButton}
          >
            Reset
          </button>
        </Row>
      </section>
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
                <div className={`${styles.transactionType}`}>
                  <p
                    className={` ${trackerClassMap[transaction?.tracker?.name]}`}
                  >
                    {trackerDictionary[transaction?.tracker?.name]}
                  </p>
                  <p className={` ${transaction?.pending && styles.pending}`}>
                    Pendente
                  </p>
                </div>
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
    fetchTransactionCategories: (filters) =>
      dispatch(fetchTransactionCategories(filters)),
  };
};

const mapStateToProps = (state) => {
  return {
    data: state.transaction.data,
    meta: state.transaction.meta,
    categories: state.transactionCategory.data,
    loading: state.transaction.loading,
    trackers: state.tracker.data,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);

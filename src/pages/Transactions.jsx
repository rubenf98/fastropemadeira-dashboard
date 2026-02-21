import React, { useEffect, useState } from "react";
import styles from "./Tracker.module.css";
import { Link } from "react-router";
import { connect } from "react-redux";
import { fetchTransactions } from "../redux/redux-modules/transaction/actions";
import { fetchTrackers } from "../redux/redux-modules/tracker/actions";
import { Cascader, DatePicker, Input, Row, Select, Skeleton } from "antd";
import { fetchTransactionCategories } from "../redux/redux-modules/transactionCategory/actions";
import { fetchTransactionPartners } from "../redux/redux-modules/transactionPartner/actions";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import debounce from "debounce";
const { RangePicker } = DatePicker;

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
  const [filters, setFilters] = useState({ perPage: 50 });
  const [page, setPage] = useState(1);
  const [openPartner, setOpenPartner] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openType, setOpenType] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    props.fetchTransactionCategories();
    props.fetchTransactionPartners();
  }, []);

  useEffect(() => {
    var formattedFilters = { ...filters };

    if (filters.dateRange) {
      formattedFilters.dateRange = undefined;
      formattedFilters.dateFrom = filters.dateRange[0].format("YYYY-MM-DD");
      formattedFilters.dateTo = filters.dateRange[1].format("YYYY-MM-DD");
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

  const handleExportPDF = () => {
    // ----------------------------------
    // FILTER OUT PENDING TRANSACTIONS
    // ----------------------------------

    if (!allData.length) return;

    const doc = new jsPDF("p", "mm", "a4");

    // ----------------------------------
    // DETERMINE DATE RANGE
    // ----------------------------------

    let startDate;
    let endDate;

    if (filters.dateRange && filters.dateRange.length === 2) {
      startDate = filters.dateRange[0].format("YYYY-MM-DD");
      endDate = filters.dateRange[1].format("YYYY-MM-DD");
    } else {
      const sortedDates = [...allData]
        .map((t) => new Date(t.date))
        .sort((a, b) => a - b);

      startDate = sortedDates[0].toISOString().split("T")[0];
      endDate = sortedDates[sortedDates.length - 1].toISOString().split("T")[0];
    }

    // ----------------------------------
    // CALCULATIONS
    // ----------------------------------

    let totalEntradas = 0;
    let totalSaidas = 0;
    let totalClientes = 0;
    let clientesParceiros = 0;

    let totalPartners = 0;
    let totalGetYourGuide = 0;
    let totalGuides = 0;

    allData.forEach((t) => {
      const amount = Number(t.amount);

      if (amount > 0) totalEntradas += amount;
      if (amount < 0) totalSaidas += amount;

      totalClientes += Number(t.n_clients || 0);

      if (t.tracker?.name === "total_partners") {
        totalPartners += amount;
        clientesParceiros += Number(t.n_clients || 0);
      }

      if (t.tracker?.name === "total_getyourguide") {
        totalGetYourGuide += amount;
      }

      if (t.tracker?.name === "n_clients") {
        totalClientes += amount;
      }

      if (t.subCategory?.id === 24) {
        // Pagamento de guias
        totalGuides += amount;
      }
    });

    const saldoReal = totalEntradas + totalSaidas - Math.abs(totalGetYourGuide);

    // ----------------------------------
    // HEADER
    // ----------------------------------

    doc.setFontSize(16);
    doc.text("Relatório Financeiro", 14, 15);

    doc.setFontSize(10);
    doc.text(`Período: ${startDate} até ${endDate}`, 14, 22);
    doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 14, 27);

    // ----------------------------------
    // TABLE
    // ----------------------------------

    const tableData = allData.map((t) => [
      t.date,
      t.category?.name || "",
      t.subCategory?.name || "",
      t.n_clients || "NA",
      t.partner?.name || "",
      t.tracker ? trackerDictionary[t.tracker.name] : "",
      `${Number(t.amount).toFixed(2)}€`,
      t.pending ? "Pendente" : "",
    ]);

    autoTable(doc, {
      startY: 32,
      head: [
        [
          "Data",
          "Categoria",
          "Subcategoria",
          "Nº Clientes",
          "Parceiro",
          "Destino",
          "Valor",
          "",
        ],
      ],
      body: tableData,
      styles: { fontSize: 8 },
    });

    // ----------------------------------
    // SUMMARY
    // ----------------------------------

    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.text("Resumo do Período", 14, finalY);

    doc.setFontSize(10);

    const summaryLines = [
      `Total de Entradas: ${totalEntradas.toFixed(2)}€`,
      `Total de Saídas: ${Math.abs(totalSaidas).toFixed(2)}€`,
      `Saldo Real: ${saldoReal.toFixed(2)}€`,
      `Total Parceiros: ${totalPartners.toFixed(2)}€`,
      `Total GetYourGuide: ${totalGetYourGuide.toFixed(2)}€`,
      `Total Guias: ${totalGuides.toFixed(2)}€`,
      `Número Total de Clientes: ${totalClientes}`,
      `Clientes Vindos de Parceiros: ${clientesParceiros}`,
    ];

    summaryLines.forEach((line, index) => {
      doc.text(line, 14, finalY + 8 + index * 6);
    });

    doc.save("relatorio-financeiro.pdf");
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
            style={{ width: "49%" }}
          />
          <Select
            onOpenChange={setOpenPartner}
            style={{ width: "49%" }}
            value={filters.partner}
            fieldNames={{
              label: "name",
              value: "id",
            }}
            options={props.partners}
            onChange={(value, selectedOptions) => {
              setFilters({ ...filters, partner: value });
              setOpenPartner(false);
            }}
            placeholder="Parceiro"
          />
          <RangePicker
            allowClear
            value={filters.dateRange}
            onChange={(value) =>
              setFilters({
                ...filters,
                dateRange: value,
              })
            }
            placeholder="Data de transação"
            style={{ width: "31%" }}
          />
          <Cascader
            open={openCategory}
            onOpenChange={setOpenCategory}
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
            onChange={(value, selectedOptions) => {
              setFilters({ ...filters, category: value });
              if (value.length == 2 || !value.length) {
                setOpenCategory(false);
              }
            }}
            options={props.categories}
            placeholder="Categoria"
            style={{ width: "31%" }}
            changeOnSelect
          />
          <Select
            onOpenChange={setOpenType}
            value={filters.type}
            allowClear
            onChange={(e) => {
              setFilters({ ...filters, type: e });
              setOpenType(false);
            }}
            options={[
              { value: ">", label: "Crédito" },
              { value: "<", label: "Débito" },
            ]}
            placeholder="Tipo de operação"
            style={{ width: "31%" }}
          />
        </Row>

        <Row style={{ margin: "20px 0px ", gap: "20px" }} justify="end">
          <button
            style={{
              padding: "8px 28px ",
              backgroundColor: "transparent",
              cursor: "pointer",
            }}
            type="reset"
            onClick={() => setFilters({ perPage: 50 })}
            className={styles.searchButton}
          >
            Reset
          </button>

          <button
            style={{
              padding: "8px 28px ",
              backgroundColor: "rgb(53, 162, 235)",
              cursor: "pointer",
              color: "white",
              border: "none",
            }}
            type="button"
            onClick={handleExportPDF}
            className={styles.searchButton}
          >
            Exportar
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
    fetchTransactionPartners: (filters) =>
      dispatch(fetchTransactionPartners(filters)),
  };
};

const mapStateToProps = (state) => {
  return {
    data: state.transaction.data,
    meta: state.transaction.meta,
    categories: state.transactionCategory.data,
    loading: state.transaction.loading,
    trackers: state.tracker.data,
    partners: state.transactionPartner.data,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);

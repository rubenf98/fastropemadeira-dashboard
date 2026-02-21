import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import styles from "./Partner.module.css";
import { Cascader, DatePicker, Input, notification, Popconfirm } from "antd";
import {
  fetchTransactionPartner,
  liquidateTransactionPartner,
} from "../redux/redux-modules/transactionPartner/actions";
import { login } from "../redux/redux-modules/auth/actions";
import { fetchTransactions } from "../redux/redux-modules/transaction/actions";
import dayjs from "dayjs";
import { setAuthorizationToken } from "../redux/redux-modules/auth/actions";
import { connect } from "react-redux";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "dayjs/locale/pt";
dayjs.locale("pt");

function Partner(props) {
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [api, contextHolder] = notification.useNotification();
  const { transaction } = props;

  const [openPopConfirm, setOpenPopConfirm] = useState([false, false]);
  const [passwordInput, setPasswordInput] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(undefined);
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
    props.fetchTransactionPartner(id);
  }, []);

  const handlePasswordCheck = (type) => {
    if (passwordInput) {
      props
        .login({ email: props?.user?.email, password: passwordInput })
        .then((response) => {
          const token = response.value.data.access_token;
          localStorage.setItem("token", token);

          setAuthorizationToken(token);
          setErrorMessage(undefined);
          props.liquidateTransactionPartner(id, { type: type }).then(() => {
            // navigate("/tracker");
            console.log("liquidated");
            api.success({
              title: "Valor liquidado com sucesso!",
            });
            resetStatus();
          });
        })
        .catch(() => {
          setErrorMessage("Credenciais incorretas!");
        });
    }
  };

  useEffect(() => {
    if (!selectedMonth) return;

    const monthStart = selectedMonth.startOf("month").format("YYYY-MM-DD");
    const monthEnd = selectedMonth.endOf("month").format("YYYY-MM-DD");

    props.fetchTransactions(1, {
      partner: id,
      dateFrom: monthStart,
      dateTo: monthEnd,
      perPage: 1000, // get all
    });
  }, [selectedMonth, id]);

  const resetStatus = () => {
    setErrorMessage(undefined);
    setPasswordInput(undefined);
    setOpenPopConfirm([false, false]);
  };

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

  const handleExportPartnerReport = () => {
    if (!props?.transactions?.length) {
      api.error({
        title: "Nenhuma transação encontrada para o parceiro neste mês!",
      });
      return;
    }

    const doc = new jsPDF("p", "mm", "a4");

    // ---------------------------
    // HEADER
    // ---------------------------

    const logoImg = "/logo_navbar.png"; // public folder or base64
    doc.addImage(logoImg, "PNG", 14, 10, 40, 10); // x, y, width, height

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório Mensal", 14, 30);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Parceiro: ${props.partner.name}`, 14, 36);
    doc.text(`Mês: ${selectedMonth.locale("pt").format("MMMM YYYY")}`, 14, 41);
    doc.text(`Data de criação: ${dayjs().format("DD/MM/YYYY")}`, 14, 46);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Transações:", 14, 55);
    // ---------------------------
    // TABLE
    // ---------------------------

    let totalPendente = 0;
    let totalIncome = 0;

    const tableData = props.transactions.map((t) => {
      const amount = Number(t.amount);
      if (t.pending) {
        t.willPay ? (totalPendente += amount) : (totalIncome += amount);
      }

      console.log("Transaction", t.commissionTo);

      return [
        t.id,
        dayjs(t.date).format("DD/MM/YYYY"),
        t.category?.name || "",
        t.category?.id != 1
          ? t.subCategory?.name +
            (t.commission_level ? " - " + t.commission_level : "")
          : t.subCategory?.name || "",
        t.n_clients > 0 ? t.n_clients : t.commissionTo?.n_clients || "NA",
        amount.toFixed(2) + "€" || "",
        t.pending ? "Pendente" : "",
      ];
    });

    autoTable(doc, {
      startY: 60,
      head: [
        ["#", "Data", "Categoria", "Subcategoria", "Nº Clientes", "Valor", ""],
      ],
      body: tableData,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [0, 0, 0], // black header
        textColor: 255,
        halign: "center",
        fontStyle: "bold",
      },
      bodyStyles: {
        halign: "left",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], // light gray for every other row
      },
      columnStyles: {
        3: { halign: "right" }, // Valor column right aligned
      },
    });

    // ---------------------------
    // TOTAL SECTION
    // ---------------------------

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `Total a liquidar: ${totalPendente.toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}`,
      14,
      finalY,
    );

    doc.text(
      `Total a receber: ${totalIncome.toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}`,
      14,
      finalY + 10,
    );

    // ---------------------------
    // SIGNATURE SECTION
    // ---------------------------

    const signatureY = finalY + 25;

    // Line for signature
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text("Data:", 14, signatureY);
    doc.line(14, signatureY + 10, 95, signatureY + 10);

    doc.text(`Assinatura ${props.partner.name}:`, 14, signatureY + 25);
    doc.line(14, signatureY + 35, 95, signatureY + 35);

    doc.text("Assinatura FastRope:", 120, signatureY + 25);
    doc.line(120, signatureY + 35, 190, signatureY + 35);

    const addFooter = () => {
      const pageCount = doc.getNumberOfPages();
      const footerText = [
        "Urbanização Vista Alegre, Caminho Velho da Azenha Loja A, 9125-115 Caniço",
        "(351) 933 933 452",
        "info@fastropemadeira.com",
      ];

      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");

        // Position from bottom
        let startY = 270;
        footerText.forEach((line, idx) => {
          doc.text(line, 14, startY + idx * 4); // small line spacing
        });
      }
    };

    // ---------------------------
    addFooter();
    doc.save(`${props.partner.name}-${selectedMonth.format("YYYY-MM")}.pdf`);
  };

  return (
    <div>
      {contextHolder}
      <h3 style={{ textAlign: "center" }}>{props?.partner?.name}</h3>
      <button
        className={styles.backButton}
        onClick={() => navigate("/tracker/")}
      >
        <img src="/back.svg" alt="Voltar" />
        Voltar
      </button>

      <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
        <DatePicker
          picker="month"
          value={selectedMonth}
          onChange={(value) => setSelectedMonth(value)}
        />

        <button
          style={{
            padding: "8px 20px",
            backgroundColor: "rgb(53, 162, 235)",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
          onClick={handleExportPartnerReport}
        >
          Exportar Relatório Mensal
        </button>
      </div>

      <section className={styles.form}></section>

      <div className={`${styles.card}`}>
        <div className={`${styles.card_content}`}>
          <h4>A pagar (pendente)</h4>
          <span>{props.partner.pending_payment}€</span>
        </div>
        <Popconfirm
          placement="top"
          open={openPopConfirm[0]}
          // onOpenChange={(open) => setOpenPopConfirm(open)}
          title={
            <div>
              <p style={{ marginTop: 0 }}>
                Introduza a sua password para confirmar a ação:
              </p>

              <Input
                status={errorMessage ? "error" : ""}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                type="password"
                autoComplete={false}
              />
              <span style={{ color: "red", fontSize: "12px" }}>
                {errorMessage}
              </span>
            </div>
          }
          onCancel={resetStatus}
          onConfirm={() => handlePasswordCheck("pending_payment")}
        >
          <button
            onClick={() => setOpenPopConfirm([true, false])}
            className={styles.pending_payment}
            type="submit"
          >
            Liquidar Dívida
          </button>
        </Popconfirm>
      </div>

      <div className={`${styles.card}`}>
        <div className={`${styles.card_content}`}>
          <h4>A receber (pendente)</h4>
          <span>{props.partner.pending_income}€</span>
        </div>
        <Popconfirm
          placement="top"
          open={openPopConfirm[1]}
          // onOpenChange={(open) => setOpenPopConfirm(open)}
          title={
            <div>
              <p style={{ marginTop: 0 }}>
                Introduza a sua password para confirmar a ação:
              </p>

              <Input
                status={errorMessage ? "error" : ""}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                type="password"
                autoComplete={false}
              />
              <span style={{ color: "red", fontSize: "12px" }}>
                {errorMessage}
              </span>
            </div>
          }
          onCancel={resetStatus}
          onConfirm={() => handlePasswordCheck("pending_income")}
        >
          <button
            onClick={() => setOpenPopConfirm([false, true])}
            className={styles.pending_income}
            type="submit"
          >
            Liquidar Crédito
          </button>
        </Popconfirm>
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTransactionPartner: (id) => dispatch(fetchTransactionPartner(id)),
    liquidateTransactionPartner: (id, data) =>
      dispatch(liquidateTransactionPartner(id, data)),
    login: (data) => dispatch(login(data)),
    fetchTransactions: (page, filters) =>
      dispatch(fetchTransactions(page, filters)),
  };
};

const mapStateToProps = (state) => {
  return {
    partner: state.transactionPartner.current,
    data: state.transactionCategory.data,
    transaction: state.transaction.current,
    loading: state.transactionCategory.loading,
    user: state.auth.user,
    transactions: state.transaction.data,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Partner);

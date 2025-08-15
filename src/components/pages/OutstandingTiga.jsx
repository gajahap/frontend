import {
  React,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  Container,
  Breadcrumb,
  Card,
  Form,
  Row,
  Col,
  Button,
  Table,
  Spinner,
} from "react-bootstrap";
import CustomSelect from "../childs/CustomSelect";
import axiosInstance from "../../axiosConfig";
import Notification from "../childs/Notification";
import Loading from "../childs/Loading";
import debounce from "lodash.debounce";

// NEW: Excel + save
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Outstanding = () => {
  useEffect(() => {
    document.title = "Outstanding | Marketing App";
  }, []);

  const [customerOptions, setCustomerOptions] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({});
  const [data, setData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const fetchCustomerOptions = () => {
    axiosInstance
      .get("customer/get-customer")
      .then((response) => {
        setCustomerOptions(
          response.data.map((customer) => ({
            value: customer.id,
            label: customer.name,
          }))
        );
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchCustomerOptions();
  }, []);

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   setIsLoadingData(true);
  //   const formData = new FormData(event.target);

  //   const startDate = new Date(params.start_date);
  //   const endDate = new Date(params.end_date);

  //   // Validasi end_date lebih besar dari start_date
  //   if (endDate < startDate) {
  //     setNotification({
  //       show: true,
  //       title: "Perhatian !!!",
  //       message: "Tanggal akhir harus lebih besar dari tanggal awal",
  //       variant: "warning",
  //     });
  //     setIsLoadingData(false);
  //     return;
  //   }

  //   // Validasi end_date tidak lebih dari 1 tahun dari start_date
  //   const oneYearLater = new Date(startDate);
  //   oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

  //   if (endDate > oneYearLater) {
  //     setNotification({
  //       show: true,
  //       title: "Perhatian !!!",
  //       message:
  //         "Tanggal akhir tidak boleh lebih dari 1 tahun dari tanggal awal",
  //       variant: "warning",
  //     });
  //     setIsLoadingData(false);
  //     return;
  //   }

  //   // Jika valid, kirim request
  //   axiosInstance
  //     .get("marketing/outstanding", { params: params })
  //     .then((response) => {
  //       console.log(response.data.data.grouped_outstanding_items);
  //       setData(response.data.data.grouped_outstanding_items || []);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setError(error.response?.data?.errors || {});
  //     })
  //     .finally(() => {
  //       setIsLoadingData(false);
  //     });

  //   console.log("Data yang dikirim:", params);
  // };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoadingData(true);

    // Ambil semua value dari form
    const formData = new FormData(event.target);
    const allParams = Object.fromEntries(formData.entries());

    // Update params state (opsional kalau mau disimpan)
    setParams(allParams);

    const startDate = new Date(allParams.start_date);
    const endDate = new Date(allParams.end_date);

    // Validasi tanggal seperti sebelumnya
    if (endDate < startDate) {
      setNotification({
        show: true,
        title: "Perhatian !!!",
        message: "Tanggal akhir harus lebih besar dari tanggal awal",
        variant: "warning",
      });
      setIsLoadingData(false);
      return;
    }

    const oneYearLater = new Date(startDate);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    if (endDate > oneYearLater) {
      setNotification({
        show: true,
        title: "Perhatian !!!",
        message:
          "Tanggal akhir tidak boleh lebih dari 1 tahun dari tanggal awal",
        variant: "warning",
      });
      setIsLoadingData(false);
      return;
    }

    // Kirim request dengan semua params (termasuk po_no)
    axiosInstance
      .get("marketing/outstanding", { params: allParams })
      .then((response) => {
        console.log(response.data.data.grouped_outstanding_items);
        setData(response.data.data.grouped_outstanding_items || []);
      })
      .catch((error) => {
        console.log(error);
        setError(error.response?.data?.errors || {});
      })
      .finally(() => {
        setIsLoadingData(false);
      });

    console.log("Data yang dikirim:", allParams);
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    console.log("Error:", error);
  }, [error]);

  const handleChangeParam = (event) => {
    const { name, value } = event.target;
    setParams((prevParam) => ({
      ...prevParam,
      [name]: value,
    }));
  };

  const [filters, setFilters] = useState({
    sc_no: "",
    mo_no: "",
    po_no: "",
    wo_no: "",
    color: "",
    kartu_proses: "",
  });

  // Fungsi yang di-debounce
  const debouncedSetFilters = useCallback(
    debounce((name, value) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    }, 0),
    []
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    debouncedSetFilters(name, value);
  };

  const buyerName =
    customerOptions.find((option) => option.value === params.customer_id)
      ?.label || "Unknown";

  const filteredData = useMemo(() => {
    const noFiltersActive = Object.values(filters).every(
      (value) => value === ""
    );
    if (noFiltersActive) {
      return data;
    }

    return data
      .map((sc) => {
        const scMatch = (sc.sc_no?.toLowerCase() || "").includes(
          filters.sc_no.toLowerCase()
        );
        if (!scMatch && filters.sc_no !== "") {
          return null;
        }

        const filteredMoList = sc.mo_list
          .map((mo) => {
            const moMatch = (mo.mo_no?.toLowerCase() || "").includes(
              filters.mo_no.toLowerCase()
            );
            const poMatch = (mo.mo_po?.toLowerCase() || "").includes(
              filters.po_no.toLowerCase()
            );
            if (
              (!moMatch && filters.mo_no !== "") ||
              (!poMatch && filters.po_no !== "")
            ) {
              return null;
            }

            const filteredWoList = mo.wo_list
              .map((wo) => {
                const woMatch = (wo.wo_no?.toLowerCase() || "").includes(
                  filters.wo_no.toLowerCase()
                );
                if (!woMatch && filters.wo_no !== "") {
                  return null;
                }

                const filteredColorList = wo.wo_colors
                  .map((colorObj) => {
                    const colorMatch = (
                      colorObj.color?.toLowerCase() || ""
                    ).includes(filters.color.toLowerCase());
                    if (!colorMatch && filters.color !== "") {
                      return null;
                    }

                    const filteredKpList = colorObj.kartu_proses.filter((kp) =>
                      (kp.no?.toLowerCase() || "").includes(
                        filters.kartu_proses.toLowerCase()
                      )
                    );

                    if (
                      filteredKpList.length > 0 ||
                      filters.kartu_proses === ""
                    ) {
                      return { ...colorObj, kartu_proses: filteredKpList };
                    }
                    return null;
                  })
                  .filter(Boolean);

                if (
                  filteredColorList.length > 0 ||
                  (filters.color === "" && filters.kartu_proses === "")
                ) {
                  return { ...wo, wo_colors: filteredColorList };
                }
                return null;
              })
              .filter(Boolean);

            if (
              filteredWoList.length > 0 ||
              (filters.wo_no === "" &&
                filters.color === "" &&
                filters.kartu_proses === "")
            ) {
              return { ...mo, wo_list: filteredWoList };
            }
            return null;
          })
          .filter(Boolean);

        if (
          filteredMoList.length > 0 ||
          (filters.mo_no === "" &&
            filters.po_no === "" &&
            filters.wo_no === "" &&
            filters.color === "" &&
            filters.kartu_proses === "")
        ) {
          return { ...sc, mo_list: filteredMoList };
        }
        return null;
      })
      .filter(Boolean);
  }, [data, filters]);

  const handleFilter = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // ===== Helpers untuk format =====
  const formatDateISOToDDMMYYYY = (val) => {
    if (!val) return "-";
    try {
      const d = new Date(val);
      if (isNaN(d)) return val;
      return d
        .toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .split("/")
        .join("-");
    } catch (e) {
      return val;
    }
  };

  const parseQtyTerima = (kp) => {
    const unit = kp.unit || "";
    const qtyStr = kp.qty_sum_terima;
    if (!qtyStr) return "-";
    const parts = qtyStr
      .split(", ")
      .map((item) => item.trim())
      .filter(Boolean);
    const filtered = parts.filter((item) => {
      const num = parseFloat(item.split(": ")[1]);
      return !isNaN(num) && num !== 0;
    });
    if (filtered.length === 0) return "-";
    const total = filtered
      .map((item) => parseFloat(item.split(": ")[1]))
      .reduce((s, n) => s + n, 0);
    return `${filtered.join(", ")} | Total: ${total} (${unit})`;
  };

  // ===== Flatten data for export =====
  const flattenForExport = () => {
    const rows = [];
    (filteredData || []).forEach((sc) => {
      (sc.mo_list || []).forEach((mo) => {
        (mo.wo_list || []).forEach((wo) => {
          (wo.wo_colors || []).forEach((colorObj) => {
            (colorObj.kartu_proses || []).forEach((kp) => {
              rows.push({
                "SC No": sc.sc_no || "-",
                "SC Date": formatDateISOToDDMMYYYY(sc.sc_date),
                "MO No": mo.mo_no || "-",
                "MO Date": formatDateISOToDDMMYYYY(mo.mo_date),
                "PO No": mo.mo_po || "-",
                "WO No": wo.wo_no || "-",
                "WO Greige": wo.wo_greige || "-",
                "WO Date": formatDateISOToDDMMYYYY(wo.wo_date),
                Color: colorObj.color || "-",
                Qty: colorObj.qty || "-",
                "Kartu Proses": kp.no || "-",
                "Panjang Greige": kp.panjang_greige ?? "-",
                "Buka Greige": formatDateISOToDDMMYYYY(
                  kp.processes?.find((p) => p.process_id === 1)?.value
                ),
                Relaxing: formatDateISOToDDMMYYYY(
                  kp.processes?.find((p) => p.process_id === 3)?.value
                ),
                Dyeing: formatDateISOToDDMMYYYY(
                  kp.processes?.find((p) => p.process_id === 8)?.value
                ),
                "Toping 1": formatDateISOToDDMMYYYY(
                  kp.processes?.find((p) => p.process_id === 15)?.value
                ),
                "Toping 2": formatDateISOToDDMMYYYY(
                  kp.processes?.find((p) => p.process_id === 18)?.value
                ),
                "Toping 3": formatDateISOToDDMMYYYY(
                  kp.processes?.find((p) => p.process_id === 19)?.value
                ),
                "Toping Level": formatDateISOToDDMMYYYY(
                  kp.processes?.find((p) => p.process_id === 21)?.value
                ),
                "Tarik Ulang": formatDateISOToDDMMYYYY(
                  kp.processes?.find((p) => p.process_id === 23)?.value
                ),
                "Approved Date": kp.approved
                  ? new Date(kp.approved * 1000).toLocaleDateString("id-ID")
                  : "-",
                "Qty Terima Gudang": parseQtyTerima(kp),
              });
            });
          });
        });
      });
    });
    return rows;
  };

  // ===== Export Excel =====
  const handleExportExcel = () => {
    try {
      const exportData = flattenForExport();
      if (!exportData.length) {
        setNotification({
          show: true,
          message: "Tidak ada data untuk diexport",
          variant: "warning",
        });
        return;
      }
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Outstanding");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const dataBlob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(
        dataBlob,
        `Outstanding_${params.start_date || ""}_${
          params.end_date || ""
        }_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
    } catch (e) {
      console.error(e);
      setNotification({
        show: true,
        message: "Gagal export Excel",
        variant: "danger",
      });
    }
  };

  // ===== Print =====
  const handlePrint = () => {
    const printContent = document.getElementById("print-area");
    if (!printContent) {
      setNotification({
        show: true,
        message: "Area cetak tidak ditemukan",
        variant: "danger",
      });
      return;
    }
    const newWin = window.open("", "_blank", "width=1200,height=800");
    newWin.document.write(`
      <html>
        <head>
          <title>Print Outstanding</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; padding: 10px; }
            table { border-collapse: collapse; width: 100%; font-size: 12px; }
            table, th, td { border: 1px solid #333; padding: 6px; }
            th { background: #f2f2f2; }
          </style>
        </head>
        <body>
          <h3>Outstanding</h3>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    newWin.document.close();
    newWin.focus();
    // Delay sejenak untuk memastikan resources render
    setTimeout(() => {
      newWin.print();
      //newWin.close(); // jangan auto-close agar user bisa lihat hasil print preview
    }, 500);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <Container fluid className="p-4">
      <Breadcrumb className="p-2 rounded">
        <div className="white d-flex align-items-center">
          <Breadcrumb.Item className="text-primary-custom text-muted" href="/">
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item active className="text-primary-custom">
            Outstanding
          </Breadcrumb.Item>
        </div>
      </Breadcrumb>
      <h4 className="text-primary-custom font-italic">Outstanding</h4>
      <Card className="p-4">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Group className="mb-3 flex-grow-1">
                <Form.Label>Customer</Form.Label>
                <CustomSelect
                  options={customerOptions}
                  name="customer_id"
                  onChange={({ value }) =>
                    setParams({ ...params, customer_id: value })
                  }
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3 flex-grow-1">
                <Form.Label>Tanggal Awal</Form.Label>
                <Form.Control
                  type="date"
                  name="start_date"
                  onChange={handleChangeParam}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3 flex-grow-1">
                <Form.Label>Tanggal Akhir</Form.Label>
                <Form.Control
                  type="date"
                  name="end_date"
                  onChange={handleChangeParam}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3 flex-grow-1">
                <Form.Label>No Po</Form.Label>
                <Form.Control
                  type="text"
                  name="po_no"
                  onChange={handleChangeParam}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3 flex-grow-1">
                <Form.Label>No Wo</Form.Label>
                <Form.Control
                  type="text"
                  name="no_wo"
                  onChange={handleChangeParam}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3 flex-grow-1">
                <Form.Label></Form.Label>
                <br />
                <Button
                  type="submit"
                  className="bg-primary-custom text-white w-100"
                  disabled={isLoadingData}
                >
                  {isLoadingData ? (
                    <>
                      <Spinner
                        animation="border"
                        size="sm"
                        className="text-white"
                      />{" "}
                      Please Wait..
                    </>
                  ) : (
                    "Cari"
                  )}
                </Button>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Card>

      <div className="py-4">
        <h5 className="p-4 bg-primary-gradient-custom text-white rounded ">
          {filteredData.length === 0
            ? "Tidak Ada Data"
            : `Hasil Untuk ${
                customerOptions.find(
                  (option) =>
                    String(option.value) === String(params.customer_id)
                )?.label || "-"
              } dari tanggal ${params.start_date || "-"} s/d ${
                params.end_date || "-"
              }`}
        </h5>

        {error !== null && (
          <Card className="bg-light p-4 mb-3">
            <h5>Errors :</h5>
            {Object.entries(error).map(([key, value]) => (
              <div key={key} className="error-message text-danger">
                {value}
              </div>
            ))}
          </Card>
        )}

        {data && (
          <>
            <div className="d-flex mb-3 gap-2">
              <Button
                className="bg-success text-white"
                onClick={handleExportExcel}
                disabled={filteredData.length === 0}
              >
                Export Excel
              </Button>
              {/* <Button
                className="bg-secondary text-white"
                onClick={handlePrint}
                disabled={filteredData.length === 0}
              >
                Print
              </Button> */}
            </div>

            <div
              id="print-area"
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                overflowX: "auto",
              }}
            >
              <Table
                striped
                bordered
                hover
                onClick={handleFilter}
                style={{ fontSize: "12px" }}
              >
                <thead
                  style={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "white",
                    zIndex: 1000,
                  }}
                >
                  <tr>
                    <th>
                      SC No
                      <Form.Control
                        type="text"
                        name="sc_no"
                        value={filters.sc_no}
                        onChange={handleFilterChange}
                        placeholder="Filter SC No"
                      />
                    </th>
                    <th>
                      MO No
                      <Form.Control
                        type="text"
                        name="mo_no"
                        value={filters.mo_no}
                        onChange={handleFilterChange}
                        placeholder="Filter MO No"
                      />
                    </th>
                    <th>PO No</th>
                    <th>
                      WO No
                      <Form.Control
                        type="text"
                        name="wo_no"
                        value={filters.wo_no}
                        onChange={handleFilterChange}
                        placeholder="Filter WO No"
                      />
                    </th>
                    <th>Wo Greige</th>
                    <th>Wo Date</th>
                    <th>
                      Color
                      <Form.Control
                        type="text"
                        name="color"
                        value={filters.color}
                        onChange={handleFilterChange}
                        placeholder="Filter Color"
                      />
                    </th>
                    <th>Qty</th>
                    <th>Kartu Proses</th>
                    <th>Panjang Greige</th>
                    <th>Buka Greige</th>
                    <th>Relaxing</th>
                    <th>Dyeing</th>
                    <th>Toping 1</th>
                    <th>Toping 2</th>
                    <th>Toping 3</th>
                    <th>Toping Level</th>
                    <th>Tarik Ulang</th>
                    <th>RF Ulang</th>
                    <th>Packing</th>
                    <th>Qty Terima Gudang</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((sc, scIndex) => {
                    const scRowspan = sc.mo_list.reduce(
                      (acc, mo) =>
                        acc +
                        mo.wo_list.reduce(
                          (woAcc, wo) =>
                            woAcc +
                            wo.wo_colors.reduce(
                              (colorAcc, colorObj) =>
                                colorAcc + colorObj.kartu_proses.length,
                              0
                            ),
                          0
                        ),
                      0
                    );

                    return sc.mo_list.map((mo, moIndex) => {
                      const moRowspan = mo.wo_list.reduce(
                        (acc, wo) =>
                          acc +
                          wo.wo_colors.reduce(
                            (colorAcc, colorObj) =>
                              colorAcc + colorObj.kartu_proses.length,
                            0
                          ),
                        0
                      );

                      return mo.wo_list.map((wo, woIndex) => {
                        const woRowspan = wo.wo_colors.reduce(
                          (acc, colorObj) => acc + colorObj.kartu_proses.length,
                          0
                        );

                        return wo.wo_colors.map((colorObj, colorIndex) => {
                          return colorObj.kartu_proses.map((kp, kpIndex) => (
                            <tr
                              key={`kp-${scIndex}-${moIndex}-${woIndex}-${colorIndex}-${kpIndex}`}
                            >
                              {moIndex === 0 &&
                                woIndex === 0 &&
                                colorIndex === 0 &&
                                kpIndex === 0 && (
                                  <td rowSpan={scRowspan}>{sc.sc_no}</td>
                                )}

                              {woIndex === 0 &&
                                colorIndex === 0 &&
                                kpIndex === 0 && (
                                  <>
                                    <td rowSpan={moRowspan}>{mo.mo_no}</td>
                                    <td rowSpan={moRowspan}>
                                      {mo.mo_po || "-"}
                                    </td>
                                  </>
                                )}

                              {colorIndex === 0 && kpIndex === 0 && (
                                <>
                                  <td rowSpan={woRowspan}>{wo.wo_no}</td>
                                  <td rowSpan={woRowspan}>{wo.wo_greige}</td>
                                  <td rowSpan={woRowspan}>
                                    {new Intl.DateTimeFormat("id-ID", {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                    })
                                      .format(new Date(wo.wo_date))
                                      .split("/")
                                      .join("-")}
                                  </td>
                                </>
                              )}

                              {kpIndex === 0 && (
                                <td rowSpan={colorObj.kartu_proses.length}>
                                  {colorObj.color}
                                </td>
                              )}
                              {kpIndex === 0 && (
                                <td rowSpan={colorObj.kartu_proses.length}>
                                  {colorObj.qty}
                                </td>
                              )}
                              <td>{kp.no}</td>
                              <td>{kp.panjang_greige}</td>
                              <td>
                                {kp.processes.find((p) => p.process_id === 1)
                                  ?.value
                                  ? new Date(
                                      kp.processes.find(
                                        (p) => p.process_id === 1
                                      ).value
                                    )
                                      .toLocaleDateString("id-ID", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      })
                                      .split("/")
                                      .join("-")
                                  : "-"}
                              </td>
                              <td>
                                {kp.processes.find((p) => p.process_id === 3)
                                  ?.value
                                  ? new Date(
                                      kp.processes.find(
                                        (p) => p.process_id === 3
                                      ).value
                                    )
                                      .toLocaleDateString("id-ID", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      })
                                      .split("/")
                                      .join("-")
                                  : "-"}
                              </td>
                              <td>
                                {kp.processes.find((p) => p.process_id === 8)
                                  ?.value
                                  ? new Date(
                                      kp.processes.find(
                                        (p) => p.process_id === 8
                                      ).value
                                    )
                                      .toLocaleDateString("id-ID", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      })
                                      .split("/")
                                      .join("-")
                                  : "-"}
                              </td>
                              <td>
                                {kp.processes.find((p) => p.process_id === 15)
                                  ?.value
                                  ? new Date(
                                      kp.processes.find(
                                        (p) => p.process_id === 15
                                      ).value
                                    )
                                      .toLocaleDateString("id-ID", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      })
                                      .split("/")
                                      .join("-")
                                  : "-"}
                              </td>
                              <td>
                                {kp.processes.find((p) => p.process_id === 18)
                                  ?.value
                                  ? new Date(
                                      kp.processes.find(
                                        (p) => p.process_id === 18
                                      ).value
                                    )
                                      .toLocaleDateString("id-ID", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      })
                                      .split("/")
                                      .join("-")
                                  : "-"}
                              </td>
                              <td>
                                {kp.processes.find((p) => p.process_id === 19)
                                  ?.value
                                  ? new Date(
                                      kp.processes.find(
                                        (p) => p.process_id === 19
                                      ).value
                                    )
                                      .toLocaleDateString("id-ID", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      })
                                      .split("/")
                                      .join("-")
                                  : "-"}
                              </td>
                              <td>
                                {kp.processes.find((p) => p.process_id === 21)
                                  ?.value
                                  ? new Date(
                                      kp.processes.find(
                                        (p) => p.process_id === 21
                                      ).value
                                    )
                                      .toLocaleDateString("id-ID", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      })
                                      .split("/")
                                      .join("-")
                                  : "-"}
                              </td>
                              <td>
                                {kp.processes.find((p) => p.process_id === 23)
                                  ?.value
                                  ? new Date(
                                      kp.processes.find(
                                        (p) => p.process_id === 23
                                      ).value
                                    )
                                      .toLocaleDateString("id-ID", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      })
                                      .split("/")
                                      .join("-")
                                  : "-"}
                              </td>
                              <td>
                                {kp.processes.find((p) => p.process_id === 19)
                                  ?.value
                                  ? new Date(
                                      kp.processes.find(
                                        (p) => p.process_id === 19
                                      ).value
                                    )
                                      .toLocaleDateString("id-ID", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      })
                                      .split("/")
                                      .join("-")
                                  : "-"}
                              </td>
                              <td>
                                {kp.approved
                                  ? new Date(
                                      kp.approved * 1000
                                    ).toLocaleDateString("id-ID", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    })
                                  : "-"}
                              </td>
                              <td>{parseQtyTerima(kp)}</td>
                            </tr>
                          ));
                        });
                      });
                    });
                  })}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan="21" className="text-center">
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </>
        )}
      </div>
      <Notification
        show={notification?.show}
        onHide={handleCloseNotification}
        title={notification?.title}
        message={notification?.message}
        variant={notification?.variant}
      />
    </Container>
  );
};

export default Outstanding;

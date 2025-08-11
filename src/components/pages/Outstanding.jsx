import React, { useState, useEffect, useMemo } from 'react';
import {
  Container, Breadcrumb, Card, Form, Row, Col, Button, Spinner
} from 'react-bootstrap';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper,getFilteredRowModel } from '@tanstack/react-table';
import CustomSelect from '../childs/CustomSelect';
import axiosInstance from '../../axiosConfig';
import Notification from '../childs/Notification';
import Loading from '../childs/Loading';

const columnHelper = createColumnHelper();

const Outstanding = () => {
  const [customerOptions, setCustomerOptions] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({});
  const [rawData, setRawData] = useState([]);

  // ✅ Fetch customer dropdown
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

  // ✅ Form filter handler
  const handleChangeParam = (event) => {
    const { name, value } = event.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (params.end_date < params.start_date) {
      setNotification({
        show: true,
        message: "Tanggal akhir harus lebih besar dari tanggal awal",
        variant: 'danger',
      });
      return;
    }

    setIsLoadingData(true);
    axiosInstance
      .get("marketing/outstanding", { params })
      .then((response) => {
        const nested = response.data.data.grouped_outstanding_items;
        const flattened = flattenData(nested);
        setRawData(flattened);
      })
      .catch((error) => {
        console.log(error);
        setError(error.response?.data?.errors || {});
      })
      .finally(() => {
        setIsLoadingData(false);
      });
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  // ✅ Flatten nested data
  const flattenData = (nestedData) => {
    const rows = [];
    nestedData.forEach((sc) => {
      sc.mo_list.forEach((mo) => {
        mo.wo_list.forEach((wo) => {
          wo.wo_colors.forEach((color) => {
            color.kartu_proses.forEach((kp, indexKp) => {
              const prev = rows[rows.length - 1];
              rows.push({
                sc_no: sc.sc_no,
                mo_no: mo.mo_no,
                po_no: mo.mo_po,
                wo_no: wo.wo_no,
                wo_greige: wo.wo_greige,
                wo_date: wo.wo_date,
                color: color.color,
                qty: color.qty,
                kartu_proses_no: kp.no,
                panjang_greige: kp.panjang_greige,
  
                // Flag untuk menampilkan satu kali nilai
                showScNo: !prev || prev.sc_no !== sc.sc_no,
                showMoNo: !prev || prev.mo_no !== mo.mo_no,
                showWoNo: !prev || prev.wo_no !== wo.wo_no,
              });
            });
          });
        });
      });
    });
    return rows;
  };
  

  // ✅ Define columns
  const columns = useMemo(() => [
    columnHelper.accessor('sc_no', {
        header: ({ column }) => (
          <div>
            SC No
            <input
              type="text"
              onChange={(e) => column.setFilterValue(e.target.value)}
              placeholder="Filter..."
              style={{ width: '100%' }}
            />
          </div>
        ),
        cell: ({ row }) => row.original.showScNo ? row.original.sc_no : null,
      }),
      columnHelper.accessor('mo_no', {
        header: ({ column }) => (
          <div>
            MO No
            <input
              type="text"
              onChange={(e) => column.setFilterValue(e.target.value)}
              placeholder="Filter..."
              style={{ width: '100%' }}
            />
          </div>
        ),
        cell: ({ row }) => row.original.showMoNo ? row.original.mo_no : null,
      }),
      
    columnHelper.accessor('po_no', {
      header: ({ column }) => (
        <div>
          PO No
          <input
            type="text"
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder="Filter..."
            style={{ width: '100%' }}
          />
        </div>
      ),
    }),
    columnHelper.accessor('wo_no', {
      header: ({ column }) => (
        <div>
          WO No
          <input
            type="text"
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder="Filter..."
            style={{ width: '100%' }}
          />
        </div>
      ),
      cell: ({ row }) => row.original.showWoNo ? row.original.wo_no : null,
    }),
    columnHelper.accessor('wo_greige', {
      header: ({ column }) => (
        <div>
          Greige
          <input
            type="text"
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder="Filter..."
            style={{ width: '100%' }}
          />
        </div>
      ),
    }),
    columnHelper.accessor('wo_date', {
      header: ({ column }) => (
        <div>
          WO Date
          <input
            type="text"
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder="Filter..."
            style={{ width: '100%' }}
          />
        </div>
      ),
    }),
    columnHelper.accessor('color', {
      header: ({ column }) => (
        <div>
          Color
          <input
            type="text"
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder="Filter..."
            style={{ width: '100%' }}
          />
        </div>
      ),
    }),
    columnHelper.accessor('qty', {
      header: ({ column }) => (
        <div>
          Qty
          <input
            type="text"
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder="Filter..."
            style={{ width: '100%' }}
          />
        </div>
      ),
    }),
    columnHelper.accessor('kartu_proses_no', {
      header: ({ column }) => (
        <div>
          Kartu Proses
          <input
            type="text"
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder="Filter..."
            style={{ width: '100%' }}
          />
        </div>
      ),
    }),
    columnHelper.accessor('panjang_greige', {
      header: ({ column }) => (
        <div>
          Panjang Greige
          <input
            type="text"
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder="Filter..."
            style={{ width: '100%' }}
          />
        </div>
      ),
    }),
  ], []);

  const table = useReactTable({
    data: rawData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return isLoading ? (
    <Loading />
  ) : (
    <Container fluid className="p-4">
      <Breadcrumb className="p-2 rounded">
        <div className="white d-flex align-items-center">
          <Breadcrumb.Item className="text-primary-custom text-muted" href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item active className="text-primary-custom">Outstanding</Breadcrumb.Item>
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
                  onChange={({ value }) => setParams({ ...params, customer_id: value })}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3 flex-grow-1">
                <Form.Label>Tanggal Awal</Form.Label>
                <Form.Control type="date" name="start_date" onChange={handleChangeParam} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3 flex-grow-1">
                <Form.Label>Tanggal Akhir</Form.Label>
                <Form.Control type="date" name="end_date" onChange={handleChangeParam} />
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
                      <Spinner animation="border" size="sm" className="text-white" />
                      {" "} Please Wait...
                    </>
                  ) : "Cari"}
                </Button>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Card>

      <div className="py-4">
        <h5 className="p-4 bg-primary-gradient-custom text-white rounded">
          {!rawData.length
            ? 'Tidak Ada Data'
            : `Hasil Untuk ${customerOptions.find(option => option.value === params.customer_id)?.label} dari tanggal ${params.start_date} s/d ${params.end_date}`}
        </h5>

        {error && (
          <Card className="bg-light p-4 mb-3">
            <h5>Errors:</h5>
            {Object.entries(error).map(([key, value]) => (
              <div key={key} className="error-message text-danger">
                {value}
              </div>
            ))}
          </Card>
        )}

        {rawData.length > 0 && (
          <Card className="p-4">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th key={header.id}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      <Notification
        show={notification?.show}
        onHide={handleCloseNotification}
        message={notification?.message}
        variant={notification?.variant}
      />
    </Container>
  );
};

export default Outstanding;

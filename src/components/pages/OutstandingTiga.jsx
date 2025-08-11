import {React, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Container, Breadcrumb, Card, Form, Row, Col, Button,Table, Spinner } from 'react-bootstrap';
import CustomSelect from '../childs/CustomSelect';
import axiosInstance from '../../axiosConfig';
import Notification from '../childs/Notification';
import Loading from '../childs/Loading';
import debounce from 'lodash.debounce';


const Outstanding = () => {

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
        }).finally(() => {
            setIsLoading(false);
        });
    };

    useEffect(() => {
        fetchCustomerOptions();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoadingData(true);
        const formData = new FormData(event.target);
    
        if (params.end_date < params.start_date) {
            setNotification({ show: true, message:"Tanggal akhir harus lebih besar dari tanggal awal" , variant: 'danger' });
            return;
        }

        const lparams = {
            start_date: '2022-08-06',
            end_date: '2025-08-06',
            customer_id: 106
        } 
    
        axiosInstance
            .get("marketing/outstanding", {
                params: params
            })
            .then((response) => {
                console.log(response.data.data.grouped_outstanding_items);
                setData(response.data.data.grouped_outstanding_items);
            })
            .catch((error) => {
                console.log(error);
                setError(error.response?.data?.errors || {});
            }).finally(() => {
                setIsLoadingData(false);
            });
    
        console.log("Data yang dikirim:", params);
    };
    

    const handleCloseNotification = () => {
        setNotification(null);
    };

    useEffect(() => {
        console.log("Error:",error);
        
    }, [error]);

    // const data = [
    //     {
    //         "sc_no": "2408L00041",
    //         "sc_date": "2024-08-07",
    //         "mo_list": [
    //             {
    //                 "mo_no": "M93/2408/L/D-1364",
    //                 "mo_date": "2024-08-08",
    //                 "mo_po": null,
    //                 "wo_list": [
    //                     {
    //                         "wo_no": "D2408/01946L",
    //                         "wo_date": "2024-08-08",
    //                         "wo_greige": "BRISTOL K",
    //                         "wo_colors": [
    //                             {
    //                                 "qty": "3",
    //                                 "color": "COKTU",
    //                                 "kartu_proses": [
    //                                     {
    //                                         "no": "3157/24",
    //                                         "date": "2024-08-08",
    //                                         "berat": "243.1",
    //                                         "lebar": ".",
    //                                         "items": [
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             }
    //                                         ],
    //                                         "panjang_greige": 926
    //                                     }
    //                                 ]
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "wo_no": "D2408/01947L",
    //                         "wo_date": "2024-08-08",
    //                         "wo_greige": "BRISTOL K 01 D2 Y2",
    //                         "wo_colors": [
    //                             {
    //                                 "qty": "2",
    //                                 "color": "COKTU",
    //                                 "kartu_proses": [
    //                                     {
    //                                         "no": "3092/24",
    //                                         "date": "2024-03-21",
    //                                         "berat": "233.8",
    //                                         "lebar": ".",
    //                                         "items": [
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             }
    //                                         ],
    //                                         "panjang_greige": 855
    //                                     },
    //                                     {
    //                                         "no": "3159/24",
    //                                         "date": "2024-08-08",
    //                                         "berat": "238",
    //                                         "lebar": ".",
    //                                         "items": [
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             }
    //                                         ],
    //                                         "panjang_greige": 933
    //                                     }
    //                                 ]
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ]
    //     },
    //     {
    //         "sc_no": "2408L00042",
    //         "sc_date": "2024-08-07",
    //         "mo_list": [
    //             {
    //                 "mo_no": "M93/2408/L/D-1370",
    //                 "mo_date": "2024-08-08",
    //                 "mo_po": null,
    //                 "wo_list": [
    //                     {
    //                         "wo_no": "D2408/01956L",
    //                         "wo_date": "2024-08-08",
    //                         "wo_greige": "JF 03 GAP",
    //                         "wo_colors": [
    //                             {
    //                                 "qty": "1",
    //                                 "color": "MAROON",
    //                                 "kartu_proses": [
    //                                     {
    //                                         "no": "1011/24",
    //                                         "date": "2024-08-10",
    //                                         "berat": "201",
    //                                         "lebar": ".",
    //                                         "items": [
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             }
    //                                         ],
    //                                         "panjang_greige": 657
    //                                     }
    //                                 ]
    //                             },
    //                             {
    //                                 "qty": "1",
    //                                 "color": "HITAM",
    //                                 "kartu_proses": [
    //                                     {
    //                                         "no": "1012/24",
    //                                         "date": "2024-08-10",
    //                                         "berat": "203.2",
    //                                         "lebar": ".",
    //                                         "items": [
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             }
    //                                         ],
    //                                         "panjang_greige": 664
    //                                     }
    //                                 ]
    //                             },
    //                             {
    //                                 "qty": "1",
    //                                 "color": "COKSU",
    //                                 "kartu_proses": [
    //                                     {
    //                                         "no": "1010/24",
    //                                         "date": "2024-08-10",
    //                                         "berat": "198.9",
    //                                         "lebar": ".",
    //                                         "items": [
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             },
    //                                             {
    //                                                 "roll_no": null,
    //                                                 "meter": null
    //                                             }
    //                                         ],
    //                                         "panjang_greige": 650
    //                                     }
    //                                 ]
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ]
    //     }
    // ];
    const handleChangeParam = (event) => {
        const { name, value } = event.target;
        setParams((prevParam) => ({
            ...prevParam,
            [name]: value,
        }));
    };

    const [filters, setFilters] = useState({
        sc_no: '',
        mo_no: '',
        po_no: '', // Tambahan untuk PO No
        wo_no: '',
        color: '',
        kartu_proses: '', // Tambahan untuk Kartu Proses
    });
    
  // Fungsi yang di-debounce, disimpan dengan useCallback
        const debouncedSetFilters = useCallback(
            debounce((name, value) => {
            setFilters(prevFilters => ({
                ...prevFilters,
                [name]: value,
            }));
            }, 0), // Jeda waktu 500ms
            [] // Array dependensi kosong, memastikan fungsi tidak dibuat ulang
        );

        // Fungsi event handler untuk input filter
        const handleFilterChange = (e) => {
            const { name, value } = e.target;
            // Panggil fungsi yang di-debounce
            debouncedSetFilters(name, value);
        };

      const filteredData = useMemo(() => {
        // 1. Jika tidak ada filter yang aktif, kembalikan data asli
        const noFiltersActive = Object.values(filters).every(value => value === '');
        if (noFiltersActive) {
            return data;
        }
    
        // 2. Filter dari level paling dalam (kartu_proses) ke luar
        return data
            .map(sc => {
                // Filter pada level SC
                const scMatch = (sc.sc_no?.toLowerCase() || '').includes(filters.sc_no.toLowerCase());
                if (!scMatch && filters.sc_no !== '') {
                    return null;
                }
    
                const filteredMoList = sc.mo_list
                    .map(mo => {
                        // Filter pada level MO
                        const moMatch = (mo.mo_no?.toLowerCase() || '').includes(filters.mo_no.toLowerCase());
                        const poMatch = (mo.mo_po?.toLowerCase() || '').includes(filters.po_no.toLowerCase());
                        if ((!moMatch && filters.mo_no !== '') || (!poMatch && filters.po_no !== '')) {
                            return null;
                        }
    
                        const filteredWoList = mo.wo_list
                            .map(wo => {
                                // Filter pada level WO
                                const woMatch = (wo.wo_no?.toLowerCase() || '').includes(filters.wo_no.toLowerCase());
                                if (!woMatch && filters.wo_no !== '') {
                                    return null;
                                }
                                
                                const filteredColorList = wo.wo_colors
                                    .map(colorObj => {
                                        // Filter pada level Color
                                        const colorMatch = (colorObj.color?.toLowerCase() || '').includes(filters.color.toLowerCase());
                                        if (!colorMatch && filters.color !== '') {
                                            return null;
                                        }
    
                                        const filteredKpList = colorObj.kartu_proses
                                            .filter(kp => (
                                                (kp.no?.toLowerCase() || '').includes(filters.kartu_proses.toLowerCase())
                                            ));
    
                                        // Hanya kembalikan colorObj jika ada kp yang cocok
                                        if (filteredKpList.length > 0 || filters.kartu_proses === '') {
                                            return { ...colorObj, kartu_proses: filteredKpList };
                                        }
                                        return null;
                                    })
                                    .filter(Boolean); // Menghilangkan elemen null
    
                                // Hanya kembalikan wo jika ada color yang cocok
                                if (filteredColorList.length > 0 || (filters.color === '' && filters.kartu_proses === '')) {
                                    return { ...wo, wo_colors: filteredColorList };
                                }
                                return null;
                            })
                            .filter(Boolean);
    
                        // Hanya kembalikan mo jika ada wo yang cocok
                        if (filteredWoList.length > 0 || (filters.wo_no === '' && filters.color === '' && filters.kartu_proses === '')) {
                            return { ...mo, wo_list: filteredWoList };
                        }
                        return null;
                    })
                    .filter(Boolean);
    
                // Hanya kembalikan sc jika ada mo yang cocok
                if (filteredMoList.length > 0 || (filters.mo_no === '' && filters.po_no === '' && filters.wo_no === '' && filters.color === '' && filters.kartu_proses === '')) {
                    return { ...sc, mo_list: filteredMoList };
                }
                return null;
            })
            .filter(Boolean);
    }, [data, filters]);

    const handleFilter = (name, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value,
        }));
    };

  return ( isLoading ?  <Loading /> :
    <Container fluid className='p-4'>
        <Breadcrumb className='p-2 rounded'>
            <div className="white d-flex align-items-center">
                <Breadcrumb.Item className='text-primary-custom text-muted' href="/">Home</Breadcrumb.Item>
                <Breadcrumb.Item active className='text-primary-custom'>Outstanding</Breadcrumb.Item>
            </div>
        </Breadcrumb>
        <h4 className="text-primary-custom font-italic">Outstanding</h4>
        <Card className='p-4'>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <Form.Group className="mb-3 flex-grow-1">
                            <Form.Label>Customer</Form.Label>
                            <CustomSelect options={customerOptions} name='customer_id' onChange={({ value }) => setParams({ ...params, customer_id: value })}/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3 flex-grow-1">
                            <Form.Label>Tanggal Awal</Form.Label>
                            <Form.Control type="date" name='start_date' onChange={handleChangeParam}/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3 flex-grow-1">
                            <Form.Label>Tanggal Akhir</Form.Label>
                            <Form.Control type="date" name='end_date' onChange={handleChangeParam}/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3 flex-grow-1">
                            <Form.Label></Form.Label>
                            <br />
                            <Button type="submit" className='bg-primary-custom text-white w-100' disabled={isLoadingData}>
                                {isLoadingData ? (
                                    <>
                                        <Spinner animation="border" size="sm" className='text-white' />
                                        {" "} Please Wait..
                                    </>
                                ) : "Cari"}
                            </Button>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        </Card>
        <div className='py-4'>
            <h5 className="p-4 bg-primary-gradient-custom text-white rounded ">
                {filteredData.length === 0 
                    ? 'Tidak Ada Data' 
                    : `Hasil Untuk ${customerOptions.find(option => option.value === params.customer_id)?.label} dari tanggal ${params.start_date} s/d ${params.end_date}`
                }
            </h5>
            
                {error !== null && (    
                    <Card className='bg-light p-4 mb-3'>
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
                    <Button className='bg-primary-custom text-white my-3'>Cari</Button>
                    <Table responsive striped bordered onClick={handleFilter}>
                    <thead>
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
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((sc, scIndex) => {
                        // Calculation logic for rowspan (scRowspan, moRowspan, woRowspan) remains the same
                        const scRowspan = sc.mo_list.reduce((acc, mo) =>
                            acc + mo.wo_list.reduce((woAcc, wo) =>
                            woAcc + wo.wo_colors.reduce((colorAcc, colorObj) =>
                                colorAcc + colorObj.kartu_proses.length, 0), 0), 0);

                        return sc.mo_list.map((mo, moIndex) => {
                            const moRowspan = mo.wo_list.reduce((acc, wo) =>
                            acc + wo.wo_colors.reduce((colorAcc, colorObj) =>
                                colorAcc + colorObj.kartu_proses.length, 0), 0);

                            return mo.wo_list.map((wo, woIndex) => {
                            const woRowspan = wo.wo_colors.reduce((acc, colorObj) =>
                                acc + colorObj.kartu_proses.length, 0);

                            return wo.wo_colors.map((colorObj, colorIndex) => {
                                return colorObj.kartu_proses.map((kp, kpIndex) => (
                                <tr key={`kp-${scIndex}-${moIndex}-${woIndex}-${colorIndex}-${kpIndex}`}>
                                    {moIndex === 0 && woIndex === 0 && colorIndex === 0 && kpIndex === 0 && (
                                    <td rowSpan={scRowspan}>{sc.sc_no}</td>
                                    )}
                                    
                                    {woIndex === 0 && colorIndex === 0 && kpIndex === 0 && (
                                    <>
                                        <td rowSpan={moRowspan}>{mo.mo_no}</td>
                                        <td rowSpan={moRowspan}>{mo.mo_po || '-'}</td>
                                    </>
                                    )}
                                    
                                    {colorIndex === 0 && kpIndex === 0 && (
                                        <>
                                            <td rowSpan={woRowspan}>{wo.wo_no}</td>
                                            <td rowSpan={woRowspan}>{wo.wo_greige}</td>
                                            <td rowSpan={woRowspan}>{new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(wo.wo_date)).split('/').join('-')}</td>
                                        </>
                                    )}
                                    
                                    {kpIndex === 0 && (
                                    <td rowSpan={colorObj.kartu_proses.length}>{colorObj.color}</td>
                                    )}
                                    {kpIndex === 0 && (
                                    <td rowSpan={colorObj.kartu_proses.length}>{colorObj.qty}</td>
                                    )}
                                    <td>{kp.no}</td>
                                    <td>{kp.panjang_greige}</td>
                                    <td>{kp.processes.find(p => p.process_id === 1)?.value ? new Date(kp.processes.find(p => p.process_id === 1).value).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').join('-') : '-'}</td>
                                </tr>
                                ));
                            });
                            });
                        });
                        })}
                        {filteredData.length === 0 && (
                        <tr>
                            <td colSpan="9" className="text-center">No data found</td>
                        </tr>
                        )}
                    </tbody>
                    </Table>
                </>
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


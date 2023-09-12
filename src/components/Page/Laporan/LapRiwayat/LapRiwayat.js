import {BiPrinter, BiRefresh} from "react-icons/bi";
import { AiFillFileExcel } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import ExcelJS from "exceljs"
import {showErrorToast} from "@/utils/toast";
import {filterState} from "@/context/states";
import {Button, DatePicker, Space, Spin, Table} from "antd";
import {CalendarOutlined} from "@ant-design/icons";


export default function LapRiwayat() {
    const [dataHistory, setDataHistory] = useState([]);
    const {RangePicker} = DatePicker;
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData =  () => {
        axios.get(`/api/history?page=1`).then(response=>{
            setDataHistory(response.data);
        }).catch(()=>{
            showErrorToast("Gagal Fetch Data");
        })    .finally(()=>{
            setLoading(false)
        })
    };


    const saveExcel = async (e) => {
        e.preventDefault();
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("My Sheet");
        sheet.properties.defaultRowHeight = 40;
        sheet.getCell('A1:I1').fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor : {argb: '0366fc'}
        }
        sheet.getCell('B1').fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor : {argb: '0366fc'}
        }
        sheet.getCell('C1').fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor : {argb: '0366fc'}
        }
        sheet.getCell('D1').fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor : {argb: '0366fc'}
        }
        sheet.getCell('E1').fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor : {argb: '0366fc'}
        }
        sheet.getCell('F1').fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor : {argb: '0366fc'}
        }
        sheet.getCell('G1').fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor : {argb: '0366fc'}
        }
        sheet.getCell('H1').fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor : {argb: '0366fc'}
        }
        sheet.getCell('I1').fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor : {argb: '0366fc'}
        }
        sheet.getRow(1).font = {
            name: "Comic Sans MS",
            family: 4,
            size: 16,
            bold: true,
            color: {argb: 'FFFFFF'}
        }
        sheet.columns = [
            {
                header: "No",
                key: "no",
                width: 10,
            },
            {
                header: "Kode Pallet",
                key: "id",
                width: 32,
            },
            {
                header: "Customer",
                key: "customer",
                width: 32,
            },
            {
                header: "Vehicle",
                key: "vehicle",
                width: 32,
            },
            {
                header: "Part",
                key: "part",
                width: 32,
            },
            {
                header: "Keluar",
                key: "keluar",
                width: 32,
            },
            {
                header: "Operator Out",
                key: "user_out",
                width: 32,
            },
            {
                header: "Masuk",
                key: "masuk",
                width: 32,
            },
            {
                header: "Operator In",
                key: "user_in",
                width: 32,
            },
        ];
        dataHistory.data.map((item, index) => {
            const keluarDate = item['keluar'] ? dayjs(item['keluar']) : null;
            const masukDate = item['masuk'] ? dayjs(item['masuk']) : null;
            const oneWeekAgo = dayjs().subtract(1, 'week');

            const rowFill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb:
                        masukDate === null && keluarDate.isBefore(oneWeekAgo) ? 'FF0000' : 'FFFFFFFF'
                },
            };

            const row = sheet.addRow({
                no: index + 1,
                id: item.id_part,
                masuk: item['timestamp'] ? dayjs(item['timestamp']).locale('id').format('DD MMMM YYYY HH:mm') : '-',
            });
            row.fill = rowFill
        });
        await workbook.xlsx.writeBuffer().then(data=>{
            const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheet.sheet'})
            const url = window.URL.createObjectURL(blob)
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = 'Lap. Riwayat.xlsx';
            anchor.click();
            window.URL.revokeObjectURL(anchor);
        })
    };

    const onChange = (pagination, filters, sorter, extra) => {
        setLoading(true)
        const keluarStart = (filters?.timestamp && filters?.timestamp[0][0]) || '';
        const keluarEnd = (filters?.timestamp && filters?.timestamp[0][1]) || '';

        const parsedKeluarStart = dayjs(keluarStart);
        const parsedKeluarEnd = dayjs(keluarEnd);

        const formattedKeluarStart = parsedKeluarStart.isValid() ? parsedKeluarStart.format('YYYY-MM-DD') : '';
        const formattedKeluarEnd = parsedKeluarEnd.isValid() ? parsedKeluarEnd.format('YYYY-MM-DD') : '';

        const url = `/api/history?start=${formattedKeluarStart}&end=${formattedKeluarEnd}&page=${pagination.current}&limit=${pagination.pageSize}`;
        axios.get(url)
                     .then(response => {
                         setDataHistory(response.data);
                     })
                     .catch(() => {
                         showErrorToast("Gagal Fetch Data");
                     })
                     .finally(() => {
                         setLoading(false);
                     });

    };

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            width: 100,
            fixed: 'left',
            render: (_, __, index) => (dataHistory.currentPage - 1) * dataHistory.limit + index + 1
        },
        {
            title: 'Kode Part',
            dataIndex: 'id_part',
            onFilter: (value, record) =>
                record['id_part'].toString().toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.id_part.localeCompare(b.id_part),
        },
        {
            title: 'TimeStamp',
            dataIndex: 'timestamp',
            sorter: (a, b) => {
                // Convert the 'keluar' values to Date objects for comparison
                const dateA = a['timestamp'] ? new Date(a['timestamp']) : null;
                const dateB = b['timestamp'] ? new Date(b['timestamp']) : null;
                // Handle cases when one of the dates is null
                if (!dateA && dateB) return -1;
                if (dateA && !dateB) return 1;
                if (!dateA && !dateB) return 0;
                // Compare the dates
                return dateA.getTime() - dateB.getTime();
            },
            filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
                <div
                    style={{
                        padding: 8,
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                >
                    <RangePicker
                        style={{
                            marginBottom: 8,
                            width: "100%",
                        }}
                        value={selectedKeys[0]}
                        onChange={newDateRange => {
                            setSelectedKeys(newDateRange ? [newDateRange] : [])
                        }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            size="small"
                            style={{
                                width: 90,
                            }}
                            onClick={() => {
                                confirm({
                                    closeDropdown: true,
                                });
                            }}
                        >
                            Filter
                        </Button>
                        <Button
                            onClick={() => clearFilters}
                            size="small"
                            style={{
                                width: 90,
                            }}
                        >
                            Reset
                        </Button>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => {
                                close();
                            }}
                        >
                            close
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: filtered => (
                <CalendarOutlined
                    style={{
                        color: filtered ? '#1890ff' : undefined,
                    }}
                />
            ),
            render: (_, record) => {
                return record['timestamp']
                    ? dayjs(record['timestamp']).locale('id').format('DD MMMM YYYY HH:mm')
                    : '-'
            }
        },
    ];


    return (
        <div className={`bg-white h-full flex flex-col`}>
            <div className="w-full bg-[#00B8A7] py-0.5 px-1 text-white flex flex-row">
                <div className="flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#0092A1] hover:cursor-pointer">
                    <BiPrinter size={12} />
                    <p className="text-white font-bold text-sm">Cetak</p>
                </div>
                <div onClick={saveExcel} className="flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#0092A1] hover:cursor-pointer">
                    <AiFillFileExcel size={12} />
                    <p className="text-white font-bold text-sm">Excel</p>
                </div>
                <div onClick={fetchData} className="flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#0092A1] hover:cursor-pointer">
                    <BiRefresh size={12} />
                    <p className="text-white font-bold text-sm">Refresh</p>
                </div>
            </div>
            <div className="w-full bg-white p-2 flex-grow overflow-hidden">
                <Table
                    loading={
                        loading && <Spin tip="Loading..." delay={1500}/>
                    }
                    bordered
                    scroll={{
                        y: "68vh",
                        x: "100vw",
                    }}
                    style={{
                        width: "100%"
                    }}
                    rowKey={'index'}
                    tableLayout={"fixed"}
                    columns={columns}
                    dataSource={dataHistory.data}
                    onChange={onChange}
                    size={'small'}
                    pagination={{
                        total: dataHistory['totalData'],
                        defaultPageSize: 30,
                        hideOnSinglePage: true,
                        pageSizeOptions: [30, 50, 100],
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                    }}/>
            </div>
        </div>
    );
}

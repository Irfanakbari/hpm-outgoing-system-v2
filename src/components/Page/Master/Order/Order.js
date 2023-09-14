import {BiImport, BiRefresh} from "react-icons/bi";
import React, {useEffect, useState} from "react";
import {showErrorToast, showSuccessToast} from "@/utils/toast";
import {dataState, modalState} from "@/context/states";
import {useForm} from "react-hook-form";
import ImportModalLayout from "@/components/Page/Master/Order/ImportModal";
import axios from "axios";
import '@inovua/reactdatagrid-community/index.css'
import {Spin, Table} from "antd";


export default function Order() {
    const {setOrder, listOrder} = dataState()
    const {setModalAdd, setModalDelete, modalImport, setModalImport} = modalState()
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const {
        register,
        handleSubmit,
        reset
    } = useForm()

    useEffect(()=>{
        fetchData()
    },[])

    const fetchData = () => {
        axios.get('/api/orders?page=1').then(response => {
            setOrder(response.data);
        }).catch(()=>{
            showErrorToast("Gagal Fetch Data");
        }).finally(()=>{
            setLoading(false)
        })
    };

    const submitData =  (data) => {
        axios.post('/api/orders',data).then(() =>{
            showSuccessToast("Sukses Simpan Data");
            fetchData()
        }).catch((e)=>{
            showErrorToast(e.response.data.error);
        }).finally(()=>{
            setModalAdd(false)
            reset()
        })
    }

    const submitImport = (data) => {
        const formData = new FormData();
        formData.append("excel_file", data.file[0]); // "excel_file" harus sesuai dengan nama field pada backend yang menerima file Excel
        axios
            .post('/api/orders/import', formData)
            .then(() => {
                showSuccessToast("Sukses Simpan Data");
                fetchData();
            })
            .catch((e) => {
                showErrorToast(e.response.data.error);
            })
            .finally(() => {
                setModalImport(false);
                reset();
            });
    };


    const deleteData = (e) => {
        axios.delete('/api/orders/' + e).then(()=>{
            showSuccessToast("Sukses Hapus Data");
        }).catch(()=>{
            showErrorToast("Gagal Hapus Data");
        }).finally(()=>{
            setModalDelete(false)
            fetchData()
        })
    }

    const onChange = (pagination) => {
        setLoading(true);

        const url = `/api/orders?page=${pagination.current}&limit=${pagination.pageSize}`;
        axios.get(url)
             .then(response => {
                 setOrder(response.data);
             })
             .catch(() => {
                 showErrorToast("Gagal Fetch Data");
             })
             .finally(() => {
                 setLoading(false);
             });

    };

    const handleRowSelection = (selectedRowKeys, selectedRows) => {
        setSelected(selectedRows);
        setSelectedRowKeys(selectedRowKeys);
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            width: 50,
            fixed: 'left',
            render: (_, __, index) => (listOrder.currentPage - 1) * listOrder.limit + index + 1
        },
        {
            title: 'Kode',
            dataIndex: 'kode',
            fixed: 'left',
            width: 300,
            onFilter: (value, record) =>
                record['kode'].toString().toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.kode.localeCompare(b.kode),
        },
        {
            title: 'From',
            dataIndex: 'from',
            width: 100,
            onFilter: (value, record) =>
                record['from'].toString().toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.from.localeCompare(b.from),
        },
        {
            title: 'To 1',
            dataIndex: 'to1',
            width: 100,
            onFilter: (value, record) =>
                record['to1'].toString().toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.to1.localeCompare(b.to1),
        },
        {
            title: 'To 2',
            dataIndex: 'to2',
            width: 100,
            onFilter: (value, record) =>
                record['to2'].toString().toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.to2.localeCompare(b.to2),
        },
        {
            title: 'Supply',
            dataIndex: 'supply',
            width: 100,
            onFilter: (value, record) =>
                record['supply'].toString().toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.supply.localeCompare(b.supply),
        },
        {
            title: 'Next Supply',
            dataIndex: 'next_supply',
            width: 150,
            onFilter: (value, record) =>
                record['next_supply'].toString().toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.next_supply.localeCompare(b.next_supply),
        },
        {
            title: 'M/S ID',
            dataIndex: 'ms_id',
            width: 100,
            onFilter: (value, record) =>
                record['ms_id'].toString().toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.ms_id.localeCompare(b.ms_id),
        },
        {
            title: 'Inventory Category',
            dataIndex: 'inventory_category',
            width: 200,
            onFilter: (value, record) =>
                record['inventory_category'].toString().toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.inventory_category.localeCompare(b.inventory_category),
        },
        {
            title: 'Part Name',
            dataIndex: 'part_name',
            width: 300,
            onFilter: (value, record) =>
                record['part_name'].toString().toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.part_name.localeCompare(b.part_name),
        },
        {
            title: 'Part Color',
            dataIndex: 'part_color',
            width: 150,
            onFilter: (value, record) =>
                record['part_color'].toString().toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.part_color.localeCompare(b.part_color),
        },
        {
            title: 'P/S Code',
            dataIndex: 'ps_code',
            width: 100,
            onFilter: (value, record) =>
                record['ps_code'].toString().toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.ps_code.localeCompare(b.ps_code),
        },
        {
            title: 'Order Class',
            dataIndex: 'order_class',
            width: 150,
            onFilter: (value, record) =>
                record['order_class'].toString().toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.order_class.localeCompare(b.order_class),
        },
        {
            title: 'Production SEQ No',
            dataIndex: 'seq_no',
            width: 300,
            onFilter: (value, record) =>
                record['seq_no'].toString().toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.seq_no.localeCompare(b.seq_no),
        },
        {
            title: 'KD Lot 1',
            dataIndex: 'kd_lot1',
            width: 100,
            onFilter: (value, record) =>
                record['kd_lot1'].toString().toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.kd_lot1.localeCompare(b.kd_lot1),
        },
        {
            title: 'KD Lot 2',
            dataIndex: 'kd_lot2',
            width: 200,
            onFilter: (value, record) =>
                record['kd_lot2'].toString().toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.kd_lot2.localeCompare(b.kd_lot2),
        },
        {
            title: 'Qty',
            dataIndex: 'qty',
            width: 50,
            onFilter: (value, record) =>
                record['qty'].toString().toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.qty.localeCompare(b.qty),
        },
        {
            title: 'Date',
            dataIndex: 'date',
            width: 100,
            onFilter: (value, record) =>
                record['date'].toString().toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.date.localeCompare(b.date),
        },
        {
            title: 'Time',
            dataIndex: 'time',
            width: 100,
            onFilter: (value, record) =>
                record['time'].toString().toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.time.localeCompare(b.time),
        },
        {
            title: 'HNS',
            dataIndex: 'hns',
            width: 100,
            onFilter: (value, record) =>
                record['hns'].toString().toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.hns.localeCompare(b.hns),
        },
        {
            title: 'KD Lot No',
            dataIndex: 'kd_lot_no',
            width: 300,
            onFilter: (value, record) =>
                record['kd_lot_no'].toString().toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.kd_lot_no.localeCompare(b.kd_lot_no),
        },
        {
            title: 'Part Number',
            width: 300,
            dataIndex: 'part_number',
            onFilter: (value, record) =>
                record['part_number'].toString().toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.part_number.localeCompare(b.part_number),
        },
        {
            title: 'Part No',
            dataIndex: 'part_no',
            width: 300,
            onFilter: (value, record) =>
                record['part_no'].toString().toLowerCase().includes(value.toLowerCase()),
            sorter: (a, b) => a.part_no.localeCompare(b.part_no),
        },
    ];


    return(
        <div className={`bg-white h-full flex flex-col`}>
            {/*{modalDelete && (<DeleteModal data={selected} setCloseModal={setModalDelete} action={deleteData} />)}*/}
            {/*{modalAdd && (<AddModalLayout onSubmit={handleSubmit(submitData)} reset={reset} register={register} />)}*/}
            {modalImport && (<ImportModalLayout onSubmit={handleSubmit(submitImport)} reset={reset} register={register} />)}

            <div className="w-full bg-[#00B8A7] py-0.5 px-1 text-white flex flex-row">
                {/*<div*/}
                {/*    onClick={()=> setModalAdd(true)}*/}
                {/*    className={`flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#0092A1] hover:cursor-pointer`}>*/}
                {/*    <BiPlusMedical size={12} />*/}
                {/*    <p className={`text-white font-bold text-sm`}>Baru</p>*/}
                {/*</div>*/}
                <div
                    onClick={()=> setModalImport(true)}
                    className={`flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#0092A1] hover:cursor-pointer`}>
                    <BiImport size={12} />
                    <p className={`text-white font-bold text-sm`}>Impor Excel</p>
                </div>
                {/*<div*/}
                {/*    onClick={()=>setModalDelete(true)}*/}
                {/*    className={`flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#0092A1] hover:cursor-pointer`}>*/}
                {/*    <BsFillTrashFill size={12} />*/}
                {/*    <p className={`text-white font-bold text-sm`}>Hapus</p>*/}
                {/*</div>*/}
                <div
                    onClick={()=> fetchData()}
                    className={`flex-row flex items-center gap-1 px-3 py-1 hover:bg-[#0092A1] hover:cursor-pointer`}>
                    <BiRefresh size={12} />
                    <p className={`text-white font-bold text-sm`}>Refresh</p>
                </div>
            </div>
            <div className="w-full bg-white p-2 flex-grow overflow-hidden">
                <Table
                    loading={
                        loading && <Spin tip="Loading..." delay={1500}/>
                    }
                    rowSelection={{
                        // checkStrictly:true,
                        selectedRowKeys,
                        onChange: handleRowSelection,
                        preserveSelectedRowKeys: true
                    }}
                    bordered
                    scroll={{
                        y: "68vh",
                        x: "100vw",
                    }}
                    style={{
                        width: "100%"
                    }}
                    rowKey={'kode'}
                    tableLayout={"fixed"}
                    columns={columns}
                    dataSource={listOrder.data}
                    onChange={onChange}
                    size={'small'}
                    pagination={{
                        total: listOrder['totalData'],
                        defaultPageSize: 50,
                        hideOnSinglePage: true,
                        pageSizeOptions: [50, 150, 300],
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                    }}
                />
            </div>
        </div>
    )
}
import History from "@/models/History";
import checkCookieMiddleware from "@/pages/api/middleware";
import {Op} from "sequelize";
import connection from "@/config/database";
import Order from "@/models/Order";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            const {  start, end, search} = req.query;
            try {
                let page = parseInt(req.query.page) || 1; // Halaman saat ini (default: 1)
                let limit = parseInt(req.query.limit) || 30; // Batasan data per halaman (default: 10)
                // Menghitung offset berdasarkan halaman dan batasan data
                let offset = (page - 1) * limit;

                let histories;
                let whereClause = {}; // Inisialisasi objek kosong untuk kondisi where
                if (search) {
                    page = 1;
                    limit = 30;
                    offset = 0;
                    whereClause = {
                        ...whereClause,
                        'barcode_pcc':  search.toString()
                    }
                }
                if (start && end) {
                    const startDate = new Date(start);
                    startDate.setHours(0, 0, 0, 0); // Set start time to 00:00:00
                    const endDate = new Date(end);
                    endDate.setHours(23, 59, 59, 999); // Set end time to 23:59:59.999

                    whereClause = {
                        ...whereClause,
                        timestamp: {
                            [Op.between]: [startDate.toISOString(), endDate.toISOString()],
                        },
                    };
                } else if (start) {
                    const startDate = new Date(start);
                    startDate.setHours(0, 0, 0, 0); // Set start time to 00:00:00

                    whereClause = {
                        ...whereClause,
                        timestamp: {
                            [Op.gte]: startDate.toISOString(),
                        },
                    };
                } else if (end) {
                    const endDate = new Date(end);
                    endDate.setHours(23, 59, 59, 999); // Set end time to 23:59:59.999

                    whereClause = {
                        ...whereClause,
                        timestamp: {
                            [Op.lte]: endDate.toISOString(),
                        },
                    };
                }

                let queryOptions = {}
                if (parseInt(req.query.page)){
                    queryOptions = {
                        ...queryOptions,
                        where: whereClause,
                        limit: limit,
                        offset: offset,
                    }
                } else {
                    queryOptions = {
                        ...queryOptions,
                        where: whereClause,
                    }
                }

                histories = await History.findAndCountAll({
                    ...queryOptions,
                    order :[['timestamp', 'DESC']]
                });

                const totalData = histories.count;

                res.status(200).json({
                    ok: true,
                    data: histories.rows,
                    totalData,
                    limit: limit,
                    currentPage: page,
                });
            } catch (e) {
                res.status(500).json({
                    ok: false,
                    data: "Internal Server Error",
                });
            }
            break;
        case 'POST':
            try {
                const { id_part, pcc } = req.body;
                const {username} = req.user

                await connection.transaction(async (t) => {
                    const isThere = await Order.findByPk(pcc);

                    if (!isThere) {
                        return  res.status(400).json({
                            ok: false,
                            data: "Kode PCC Tidak Ditemukan"
                        });
                    }

                    const hist = await History.findAll({
                        where: {
                            barcode_pcc : pcc,
                            status: 'BERHASIL'
                        }
                    })

                    if (hist.length > 0) {
                            return res.status(400).json({
                                ok: false,
                                data: "Kode PCC Ini Sudah Di Input"
                            });
                    }

                    await History.create({
                        id_part,
                        operator: username,
                        barcode_pcc: pcc,
                        status: 'BERHASIL'
                    },{transaction: t})

                    return res.status(201).json({
                        ok: true,
                        data: "Sukses"
                    });
                })
            } catch (e) {
                res.status(500).json({
                    ok: false,
                    data: "Internal Server Error"
                });
            }
            break;

    }
}

const protectedAPIHandler = checkCookieMiddleware(handler);

export default protectedAPIHandler;

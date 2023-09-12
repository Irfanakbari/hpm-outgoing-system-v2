import History from "@/models/History";
import checkCookieMiddleware from "@/pages/api/middleware";
import {Op} from "sequelize";
import Part from "@/models/Part";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            const {  start, end, search} = req.query;
            try {
                const page = parseInt(req.query.page) || 1; // Halaman saat ini (default: 1)
                const limit = parseInt(req.query.limit) || 30; // Batasan data per halaman (default: 10)
                // Menghitung offset berdasarkan halaman dan batasan data
                const offset = (page - 1) * limit;

                let histories;
                let whereClause = {}; // Inisialisasi objek kosong untuk kondisi where
                if (search) {
                    whereClause = {
                        'id_part': {
                            [Op.substring]: search.toString()
                        }
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

                histories = await History.findAndCountAll({
                    where: whereClause,
                    limit: limit,
                    offset: offset,
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
                console.log(e.message);
                res.status(500).json({
                    ok: false,
                    data: "Internal Server Error",
                });
            }
            break;
        case 'POST':
            try {
                const { id_part } = req.body;
                await History.create(
                    {
                        id_part
                    },
                );

                res.status(201).json({
                    ok: true,
                    data: "Sukses"
                });
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

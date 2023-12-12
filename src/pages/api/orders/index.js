import checkCookieMiddleware from "@/pages/api/middleware";
import Order from "@/models/Order";
import {Op} from "sequelize";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const {search} = req.query;
                let page = parseInt(req.query.page) || 1; // Halaman saat ini (default: 1)
                let limit = parseInt(req.query.limit) || 50; // Batasan data per halaman (default: 10)
                // Menghitung offset berdasarkan halaman dan batasan data
                let offset = (page - 1) * limit;
                let whereClause = {}; // Inisialisasi objek kosong untuk kondisi where
                if (search) {
                    page = 1;
                    limit = 30;
                    offset = 0;
                    whereClause = {
                        ...whereClause,
                        'kode': {
                            [Op.contains]: search.toString()
                        }
                    }
                }

                const orders = await Order.findAndCountAll({
                    where: whereClause,
                    limit: limit,
                    offset: offset,
                });
                const totalData = orders.count;

                res.status(200).json({
                    ok: true,
                    data:orders.rows,
                    limit: 0,
                    totalData,
                    currentPage: 0,
                });
            } catch (e) {
                res.status(500).json({
                    ok: false,
                    data: "Internal Server Error"
                });
            }
            break;
        // case 'POST':
        //     const { id_part } = req.body;
        //     try {
        //         await Part.create({
        //             id_part,
        //         });
        //         res.status(200).json({ success: true });
        //     } catch (error) {
        //         if (error.name === 'SequelizeUniqueConstraintError') {
        //             const field = error.errors[0].path;
        //             const message = `Duplikat data pada kolom ${field}`;
        //             res.status(400).json({ success: false, error: message });
        //         } else {
        //             res.status(500).json({ success: false, error: error.message });
        //         }
        //     }
        //     break;
    }
}

const protectedAPIHandler = checkCookieMiddleware(handler);

export default protectedAPIHandler;

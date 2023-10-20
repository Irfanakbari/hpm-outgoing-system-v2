import checkCookieMiddleware from "@/pages/api/middleware";
import Order from "@/models/Order";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                // const page = parseInt(req.query.page) || 1; // Halaman saat ini (default: 1)
                // const limit = parseInt(req.query.limit) || 50; // Batasan data per halaman (default: 10)
                // // Menghitung offset berdasarkan halaman dan batasan data
                // const offset = (page - 1) * limit;

                const orders = await Order.findAll({
                    // limit: limit,
                    // offset: offset,
                });
                // const totalData = orders.count;

                res.status(200).json({
                    ok: true,
                    data:orders,
                    limit: 0,
                    // totalData,
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

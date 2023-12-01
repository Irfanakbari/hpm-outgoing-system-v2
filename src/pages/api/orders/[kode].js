import checkCookieMiddleware from "@/pages/api/middleware";
import Order from "@/models/Order";

async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            try {
                const orderId = req.query.kode; 
                const orderDetail = await Order.findByPk(orderId, {
                    attributes: ['part_no','part_name']
                });
                res.status(200).json({
                    ok: true,
                    data: orderDetail.dataValues
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

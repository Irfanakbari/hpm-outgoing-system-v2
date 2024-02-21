import History from "@/models/History";
import checkCookieMiddleware from "@/pages/api/middleware";
import connection from "@/config/database";
import Order from "@/models/Order";

async function handler(req, res) {
    switch (req.method) {
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

                    await History.create({
                        id_part: isThere.part_no,
                        barcode_pcc: pcc,
                        operator: username,
                        status: 'GAGAL'
                    },{transaction: t})

                    return res.status(201).json({
                        ok: true,
                        data: "Sukses"
                    });
                })
            } catch (e) {
                res.status(500).json({
                    ok: false,
                    data: "Gagal Mencatat Log"
                });
            }
            break;

    }
}

const protectedAPIHandler = checkCookieMiddleware(handler);

export default protectedAPIHandler;

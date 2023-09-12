import multer from "multer"; // Library untuk mengelola unggahan file
import xlsx from 'xlsx';
import Order from "@/models/Order";

const storage = multer.memoryStorage()
const upload = multer({storage: storage});

async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    upload.single("excel_file")(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ error: "Error uploading file" });
        }

        try {
            const { buffer } = req.file; // Pisahkan file dan field lainnya

            const workbook = xlsx.read(buffer, { type: 'buffer' });
            const firstSheet = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheet];
            const data = xlsx.utils.sheet_to_json(worksheet);

            const createdData = [];

            await Order.destroy({
                where: {},
                truncate: false
            });

            data.forEach((rowData, index) => {
                createdData.push({
                    kode: rowData['Barcode'],
                    from: rowData['FROM'],
                    to1: rowData['TO 1'],
                    to2: rowData['TO 2'],
                    supply: rowData['Supply Address'],
                    next_supply: rowData['Next Supply Address'],
                    ms_id: rowData['M/S ID'],
                    inventory_category: rowData['Inventory Category'],
                    part_name: rowData['Part Name'],
                    part_color: rowData['Part Color Code'],
                    ps_code: rowData['P/S Code'],
                    order_class: rowData['Order Class'],
                    seq_no: rowData['Production SEQ No'],
                    kd_lot1: rowData['KD Lot No 1'],
                    kd_lot2: rowData['KD Lot No 2'],
                    qty: rowData['Qty'],
                    date: rowData['Date :'],
                    time: rowData['Time :'],
                    hns: rowData['HNS'],
                    kd_lot_no: rowData['KD Lot No'],
                    part_number: rowData['Part Number'],
                    part_no: rowData['Part No'],
                })
            });

            await Order.bulkCreate(createdData)

            return res.status(200).json({ message: "Data berhasil disimpan" });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ error: "Gagal menyimpan data" });
        }
    });
}

export default handler;

export const config = {
    api: {
        bodyParser: false,
        responseLimit: false,
    },

}


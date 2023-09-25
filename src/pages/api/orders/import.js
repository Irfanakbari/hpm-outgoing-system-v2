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
                    part_no: rowData['Part No'],
                    part_name: rowData['Part Name'],
                    part_color: rowData['Part Color Code :'],
                    qty: rowData['Qty'],
                    to1: rowData['TO 1'],
                    to2: rowData['TO 2'],
                    date_local: rowData['Date Local'],
                    time_local: rowData['Time Local'],
                    date_export: rowData['Date Export'],
                    time_export: rowData['Time Export'],
                    weekly: rowData['Weekly'],
                    type_part: rowData['Tipe Part'],
                    kd_lot_no: rowData['KD Lot No'],
                    seq_no: rowData['Production SEQ No'],
                    date: rowData['Date :'],
                    time: rowData['Time :'],
                })
            });
            await Order.bulkCreate(createdData)

            return res.status(200).json({ message: "Data berhasil disimpan" });
        } catch (error) {
            console.log(error);
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


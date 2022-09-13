export default async function handler(req, res) {
    const body = req.body
    if (req.method === "POST") {
    } else {
        try {
            return res.status(200).json(newEntry, { success: true })
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error creating question", success: false })
        } return res.status(405).json({
            message: "Method not allowed",
            success: false
        })
    }
}
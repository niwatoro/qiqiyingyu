import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export default async function handler(req, res) {
    if (req.method === "POST") {
        return await createWord(req, res)
    } else {
        return res.status(405).json({
            message: "Method not allowed",
            success: false
        })
    }
}

async function createWord(req, res) {
    const body = req.body
    try {
        const newEntry = await prisma.word.create({
            data: {
                word: body.word,
                date: new Date()
            }
        })
        return res.status(200).json(newEntry, { success: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error creating question", success: false })
    }
}
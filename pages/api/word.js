import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export default async function handler(req, res) {
    const body = req.body
    if (req.method === "POST") {
        switch (body.action) {
            case "create":
                return await createWord(req, res)
            case "read":
                return await readWord(req, res)
            case "getall":
                return await getAllWords(req, res)
            case "delete":
                return await deleteWord(req, res)
            case "update":
                return await updateWord(req, res)
            case "answer":
                return await answerWord(req, res)
            default:
                return res.status(404).json({
                    message: "Action not acceptable",
                    success: false
                })
        }
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

async function readWord(req, res) {
    const body = req.body
    try {
        const word = await prisma.word.findUnique({
            where: {
                word: body.word
            }
        })
        return res.status(200).json(word, { success: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error creating question", success: false })
    }
}

async function getAllWords(req, res) {
    try {
        const words = await prisma.word.findMany()
        return res.status(200).json(words === null ? [] : words, { success: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error creating question", success: false })
    }
}

async function deleteWord(req, res) {
    const body = req.body
    try {
        const word = await prisma.word.delete({
            where: {
                word: body.word
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error creating question", success: false })
    }
}

async function updateWord(req, res) {
    const body = req.body
    try {
        const word = await prisma.word.update({
            where: {
                word: body.word
            },
            data: {
                word: body.updated
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error creating question", success: false })
    }
}

async function answerWord(req, res) {
    const body = req.body
    try {
        const word = await prisma.word.update({
            where: {
                word: body.word
            },
            data: {
                correct: body.correct,
                total: body.total,
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error creating question", success: false })
    }
}
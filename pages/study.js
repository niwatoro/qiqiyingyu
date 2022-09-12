import React, { Component, useEffect, useState } from "react"
import {
    Box,
    Spinner,
    Center,
    IconButton,
    Text,
    Input,
    VStack,
    Radio,
    RadioGroup,
    Button,
    Heading
} from "@chakra-ui/react"
import {
    ArrowRightIcon,
    ArrowLeftIcon,
    CheckIcon,
    CloseIcon,
    ArrowBackIcon,
    ArrowForwardIcon,
    SpinnerIcon,
} from "@chakra-ui/icons"
import { BsArrowRepeat } from "react-icons/bs"
import NextLink from "next/link"
import { Speaker } from "../components/components"

export default function Study() {
    const [loadQuiz, setLoad] = useState(false)
    const [genre, setGenre] = useState(null)
    if (loadQuiz) {
        return <Quiz genre={genre} setLoad={() => setLoad(false)} />
    } else {
        return <SelectGenre setGenre={(genre) => {
            setLoad(true)
            setGenre(genre)
        }} />
    }
}

class SelectGenre extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            genres: null,
            setGenre: props.setGenre
        }
    }

    componentDidMount = () => {
        this.InitializePage()
    }

    InitializePage = async () => {
        this.setState({
            loading: true
        })
        const response = await fetch("/api/word", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                "action": "getgenres"
            })
        })
        const data = await response.json()
        this.setState({
            genres: data
        })
        this.setState({
            loading: false
        })
    }

    render() {
        const loading = this.state.loading
        if (loading) {
            return (
                <Center>
                    <Spinner />
                </Center>
            )
        }

        const genres = this.state.genres
        if (!genres) {
            return <Box>No data</Box>
        }
        const setGenre = this.state.setGenre

        return (
            <Box>
                <NextLink href="/" passHref>
                    <IconButton icon={<ArrowBackIcon />} />
                </NextLink>
                <Center>
                    <VStack>
                        <Heading>选择分类</Heading>
                        {genres.map((elem, idx) =>
                            <Button key={idx} onClick={() => setGenre(elem.genre)}>{elem.genre}</Button>)}
                    </VStack>
                </Center>
            </Box>)
    }
}

class Quiz extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            idx: 0,
            words: [],
            answer: "",
            message: "",
            answered: false,
            correct: 0,
            finished: false,
            genre: props.genre,
            setLoad: props.setLoad
        }
    }

    componentDidMount() {
        this.InitializePage()
    }

    InitializePage = async () => {
        const response = await fetch("/api/word", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                "action": "getwordsbygenre",
                "genre": this.state.genre
            })
        })
        const data = await response.json()
        console.log(data)
        this.setState({
            words: data.words
        })

        this.setState({
            isLoading: false
        })
    }

    render() {
        if (this.state.isLoading) {
            return (
                <Center>
                    <Spinner />
                </Center>
            )
        }

        const words = this.state.words
        if (words.length === 0) {
            return <Box>No data</Box>
        }

        const idx = this.state.idx
        const maxIdx = this.state.words.length - 1
        const word = words[idx].word
        const answer = this.state.answer
        const message = this.state.message
        const answered = this.state.answered
        const correct = this.state.correct
        const finished = this.state.finished

        return (
            <Box>
                <NextLink href="/" passHref>
                    <IconButton icon={<ArrowBackIcon />} />
                </NextLink>
                <IconButton icon={<BsArrowRepeat />} onClick={this.state.setLoad} />
                <VStack>
                    <Text>No. {idx + 1} / {maxIdx + 1}</Text>
                    <Speaker word={word} />
                    <Input value={answer} width={300} onChange={(e) => this.setState({ answer: e.target.value })} />
                    {answered
                        ? (
                            finished
                                ? <IconButton icon={<SpinnerIcon />} onClick={() => {
                                    this.setState({
                                        idx: 0,
                                        finished: false,
                                        correct: 0,
                                        answer: "",
                                        message: "",
                                    })
                                }} />
                                : <IconButton icon={<ArrowForwardIcon />} onClick={() => {
                                    if (idx + 1 > maxIdx) {
                                        this.setState({
                                            message: String(correct) + "/" + String(maxIdx + 1),
                                            finished: true
                                        })
                                    } else {
                                        this.setState({
                                            idx: idx + 1,
                                            answer: "",
                                            message: "",
                                            answered: false,
                                        })
                                    }
                                }} />
                        )
                        : <IconButton icon={<CheckIcon />} onClick={async () => {
                            if (answer.toLowerCase().replace(" ", "") === word.toLowerCase().replace(" ", "")) {
                                this.setState({
                                    message: "Correct!",
                                    correct: correct + 1
                                })
                                await fetch("/api/word", {
                                    method: "POST",
                                    headers: { "content-type": "application/json" },
                                    body: JSON.stringify({
                                        "action": "answer",
                                        "correct": words[idx].correct + 1,
                                        "total": words[idx].total + 1
                                    })
                                })
                            } else {
                                this.setState({ message: "Wrong... " + word })
                            }
                            this.setState({
                                answered: true,
                            })
                        }} />
                    }
                    <Text>{message}</Text>
                </VStack>
            </Box>
        )
    }
}

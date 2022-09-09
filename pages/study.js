import React, { Component } from "react"
import {
    Box,
    Spinner,
    Center,
    IconButton,
    Text,
    Input,
    VStack,
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
import { HiSpeakerphone } from "react-icons/hi"
import NextLink from "next/link"
import { useSpeechSynthesis } from "react-speech-kit"

export default class Study extends Component {
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
                "action": "getall"
            })
        })
        const data = await response.json()
        this.setState({
            words: data
        })
        this.setState({
            isLoading: false
        })
    }

    render() {
        const isLoading = this.state.isLoading
        if (isLoading) {
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
                <VStack>
                    <Text>No. {idx+1}</Text>
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
                        : <IconButton icon={<CheckIcon />} onClick={() => {
                            if (answer.toLowerCase().replace(" ", "") === word.toLowerCase().replace(" ", "")) {
                                this.setState({
                                    message: "Correct!",
                                    correct: correct + 1
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

function Speaker({ word }) {
    const { speak } = useSpeechSynthesis()

    function speakWord() {
        speak({ text: word })
    }

    return (
        <IconButton icon={<HiSpeakerphone />} onClick={speakWord} />
    )
}
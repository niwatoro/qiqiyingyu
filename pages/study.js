import React, { Component } from "react"
import {
    Box,
    Spinner,
    Center,
    IconButton,
    Text,
} from "@chakra-ui/react"
import {
    ArrowRightIcon,
    ArrowLeftIcon,
    CheckIcon,
    CloseIcon,
    ArrowBackIcon,
} from "@chakra-ui/icons"
import { HiSpeakerWave } from "react-icons/hi"
import NextLink from "next/link"
import { useSpeechSynthesis } from "react-speech-kit"

export default class Study extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            idx: 0,
            words: []
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
        const maxIdx = this.state.words.length
        const word = words[idx]

        return (
            <Box>
                <NextLink href="/" passHref>
                    <IconButton icon={<ArrowBackIcon />} />
                </NextLink>
                <Center>
                    <Text>{word.word}</Text>
                </Center>
                <IconButton icon={<HiSpeakerWave />} />
                <Center>
                    <IconButton icon={<CheckIcon />} />
                    <IconButton icon={<CloseIcon />} />
                </Center>
            </Box>
        )
    }
}
import React, { Component } from "react"
import {
    Box,
    Button,
    Center,
    IconButton
} from "@chakra-ui/react"
import {
    GiBrain,
    GiSpellBook,
} from "react-icons/gi"
import NextLink from "next/link"

export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <Box>
                <Center>
                    <NextLink href="/study" passHref>
                        <IconButton
                        margin={1}
                        width="100px"
                        height="100px"
                        fontSize="6xl"
                            icon={<GiBrain />} />
                    </NextLink>
                    <NextLink href="/review" passHref>
                        <IconButton
                        margin={1}
                        width="100px"
                        height="100px"
                        fontSize="6xl"
                        icon={<GiSpellBook />} />
                    </NextLink>
                </Center>
            </Box>
        )
    }
}
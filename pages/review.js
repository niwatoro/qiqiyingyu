import React, { Component } from "react";
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Center,
    Spinner,
    Button,
    IconButton,
    Text,
    Flex,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Heading,
} from "@chakra-ui/react"
import {
    AddIcon,
    DeleteIcon,
    EditIcon,
    ArrowBackIcon
} from "@chakra-ui/icons"
import NextLink from "next/link"


export default class Review extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            words: [],
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

        return (
            <Box>
                <NextLink href="/" passHref>
                    <IconButton icon={<ArrowBackIcon />} />
                </NextLink>
                <TableContainer>
                    <Table>
                        <TableCaption placement="top">
                            <Center>
                                <Flex>
                                    <Heading marginRight={2}>词汇表</Heading>
                                    <AddWordButton reloadPage={this.InitializePage} />
                                </Flex>
                            </Center>
                        </TableCaption>
                        <Thead>
                            <Tr>
                                <Th></Th>
                                <Th>词汇</Th>
                                <Th>创建日期</Th>
                                <Th>熟记度</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {words.map((elem, idx) => {
                                console.log(elem.date)
                                return (
                                <Tr key={idx}>
                                    <Td><EditWordButton word={elem.word} /></Td>
                                    <Td>{elem.word}</Td>
                                    <Td>{elem.date.toString().split("T")[0]}</Td>
                                    <Td>{elem.stage}</Td>
                                    <Td><DeleteAlertDialog word={elem.word} /></Td>
                                </Tr>
                                )})}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        )
    }
}

function AddWordButton({ reloadPage }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    async function AddWord() {
        await fetch("/api/word", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                "action": "create",
                "word": initialRef.current.value
            })
        })
        onClose()
        reloadPage()
    }

    return (
        <Box>
            <IconButton
                icon={<AddIcon />}
                onClick={onOpen}
                ref={finalRef} />
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>添加单词</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>输入单词</FormLabel>
                            <Input ref={initialRef} placeholder="输入单词" />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button marginRight={1} onClick={AddWord}>保存</Button>
                        <Button onClick={onClose}>关闭</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>)
}

function EditWordButton({ word }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    async function EditWord() {
        onClose()
        await fetch("/api/word", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                "action": "update",
                "word": word,
                "updated": initialRef.current.value,
            })
        })
    }

    return (
        <Box>
            <IconButton
                icon={<EditIcon />}
                onClick={onOpen}
                ref={finalRef} />
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>编辑单词</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>输入单词</FormLabel>
                            <Input ref={initialRef} placeholder="输入单词" defaultValue={word} />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button marginRight={1} onClick={EditWord}>保存</Button>
                        <Button onClick={onClose}>关闭</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>)
}

function DeleteAlertDialog({ word }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()
    async function DeleteWord() {
        onClose()
        await fetch("/api/word", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                "action": "delete",
                "word": word
            })
        })
    }

    return (
        <Box>
            <IconButton icon={<DeleteIcon />} onClick={onOpen} />
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}>
                <AlertDialogOverlay />
                <AlertDialogContent>
                    <AlertDialogHeader>删掉单词</AlertDialogHeader>
                    <AlertDialogBody>
                        你真的删掉{word}吗？(｀；ω；´)
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button colorScheme="red" marginRight={1} onClick={DeleteWord}>删掉</Button>
                        <Button ref={cancelRef} onClick={onClose}>返回</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Box>
    )
}
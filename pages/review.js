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
    Icon,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
} from "@chakra-ui/react"
import {
    AddIcon,
    DeleteIcon,
    EditIcon,
    ArrowBackIcon,
    ChevronDownIcon
} from "@chakra-ui/icons"
import {
    AiFillFire,
    AiOutlineFire,
} from "react-icons/ai"
import NextLink from "next/link"
import { Speaker } from "../components/components";


export default class Review extends Component {
    constructor(props) {
        super(props)
        this.state = {
            words: [],
            isLoading: true,
            genres: [],
        }
    }

    componentDidMount = () => {
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

        const response_ = await fetch("/api/word", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                "action": "getgenres"
            })
        })
        const data_ = await response_.json()
        this.setState({
            genres: data_
        })

        this.setState({
            words: data,
            isLoading: false,
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
            return (
                <Box>No data</Box>
            )
        }
        const genres = this.state.genres
        console.log(genres)

        return (
            <Box>
                <NextLink href="/" passHref>
                    <IconButton icon={<ArrowBackIcon />} />
                </NextLink>
                <TableContainer>
                    <Table width={"100vw"}>
                        <TableCaption placement="top">
                            <Center>
                                <Flex>
                                    <Heading marginRight={2}>?????????</Heading>
                                    <AddWordButton />
                                </Flex>
                            </Center>
                        </TableCaption>
                        <Thead>
                            <Tr>
                                <Th></Th>
                                <Th>??????</Th>
                                <Th>??????</Th>
                                <Th>?????????</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {words.map((elem, idx) => {
                                return (
                                    <Tr key={elem.id}>
                                        <Td><EditWordButton word={elem.word} /></Td>
                                        <Td>{elem.word}<Speaker word={elem.word} /></Td>
                                        <Td>
                                            <Menu>
                                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>{elem.genre}</MenuButton>
                                                <MenuList>
                                                    {genres.map((elem1, idx1) =>
                                                        <MenuItem
                                                            key={idx1}
                                                            onClick={async () => {
                                                                await fetch("/api/word", {
                                                                    method: "POST",
                                                                    headers: { "content-type": "application/json" },
                                                                    body: JSON.stringify({
                                                                        "action": "updategenre",
                                                                        "word": elem.word,
                                                                        "updated": elem1.genre,
                                                                    })
                                                                })
                                                                window.location.reload()
                                                            }}>
                                                            {elem1.genre}
                                                        </MenuItem>)}
                                                    <AddGenreMenuItem
                                                        idx={genres.length}
                                                        word={elem.word}
                                                        genre={elem.genre}
                                                        reload={() => this.setState({ isLoading: true })} />
                                                </MenuList>
                                            </Menu>
                                        </Td>
                                        <Td>{
                                            <Flex>{
                                                Array(5).fill(0).map((elem2, idx2) => {
                                                    if (idx <= elem.stage) {
                                                        return <AiFillFire key={idx2} />
                                                    } else {
                                                        return <AiOutlineFire key={idx2} />
                                                    }
                                                })
                                            }</Flex>
                                        }</Td>
                                        <Td><DeleteAlertDialog word={elem.word} /></Td>
                                    </Tr>
                                )
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        )
    }
}

function AddWordButton() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    async function AddWord() {
        onClose()
        await fetch("/api/word", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                "action": "create",
                "word": initialRef.current.value,
                "genre": finalRef.current.value
            })
        })
        window.location.reload()
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
                    <ModalHeader>????????????</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>????????????</FormLabel>
                            <Input ref={initialRef} placeholder="????????????" />
                            <FormLabel marginTop={3}>????????????</FormLabel>
                            <Input ref={finalRef} placeholder="????????????" />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button marginRight={1} onClick={AddWord}>??????</Button>
                        <Button onClick={onClose}>??????</Button>
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
        window.location.reload()
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
                    <ModalHeader>????????????</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>????????????</FormLabel>
                            <Input ref={initialRef} placeholder="????????????" defaultValue={word} />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button marginRight={1} onClick={EditWord}>??????</Button>
                        <Button onClick={onClose}>??????</Button>
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
        window.location.reload()
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
                    <AlertDialogHeader>????????????</AlertDialogHeader>
                    <AlertDialogBody>
                        ???????????????{word}??????(?????????????)
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button colorScheme="red" marginRight={1} onClick={DeleteWord}>??????</Button>
                        <Button ref={cancelRef} onClick={onClose}>??????</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Box>
    )
}


function AddGenreMenuItem({ word, genre, idx }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    async function AddGenre() {
        onClose()
        await fetch("/api/word", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                "action": "updategenre",
                "word": word,
                "updated": initialRef.current.value,
            })
        })
        window.location.reload()
    }

    return (
        <MenuItem onClick={onOpen} key={idx}>
            <Text
                as="b"
                ref={finalRef}>????????????</Text>
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>????????????</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>????????????</FormLabel>
                            <Input ref={initialRef} placeholder="????????????" defaultValue={genre} />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button marginRight={1} onClick={AddGenre}>??????</Button>
                        <Button onClick={onClose}>??????</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </MenuItem>)
}

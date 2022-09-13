import { useSpeechSynthesis } from "react-speech-kit"
import { HiSpeakerphone } from "react-icons/hi"
import { IconButton } from "@chakra-ui/react"

export function Speaker({ word }) {
    const { speak } = useSpeechSynthesis()

    function speakWord() {
        speak({ text: word,lang:"en-US" })
    }

    return (
        <IconButton icon={<HiSpeakerphone />} onClick={speakWord} />
    )
}
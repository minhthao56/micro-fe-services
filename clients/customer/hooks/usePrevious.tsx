import { useRef } from "react"

export function usePrevious(value: any) {
    const currentRef = useRef(value)
    const previousRef = useRef()
    console.log("value", value);
    if (currentRef.current !== value) {
        previousRef.current = currentRef.current
        currentRef.current = value
    }
    return previousRef.current
}
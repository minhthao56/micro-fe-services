import {useTheme} from "next-themes";
import { useEffect, useState } from "react";

export function useThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [value, setValue] = useState(false)
  
  const onValueChange = (value: boolean) => {
    if (value) {
      setTheme("light")
    }else{
      setTheme("dark")
    }
  }

  useEffect(() => {
    if (theme === "light") {
      setValue(true)
    }else{
      setValue(false)
    }
  }, [theme])

  return { onValueChange, value }

}
import { FaPhoneVolume } from "react-icons/fa6";
import { IconContext } from "react-icons";

import Loading from "../components/Loading";

export default function FullLoadingPage() {
  return (
    <div
      className="w-full h-screen flex justify-center items-center flex-col">
      <IconContext.Provider value={{ size: "2em" }}>
        <FaPhoneVolume />
      </IconContext.Provider>
      <br/>
      <Loading size="sm"/>
    </div>
  )
}

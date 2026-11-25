import { useNavigate } from "react-router-dom"
import { LogoutButton } from "./LogoutButton"
import { useState, useEffect } from "react"
import axios from "axios"

export const Appbar = () => {
    const navigate = useNavigate()

    const greetings = ["Hello", "Hola", "Namaste", "Bonjour", "Ciao", "Hello"]
    const [index, setIndex] = useState(0)

    useEffect(() => {
        if (index === greetings.length - 1) return

        const timer = setTimeout(() => {
            setIndex(index + 1)
        }, 1000)

        return () => clearTimeout(timer)
    }, [index])

    const [firstName, setFirstName] = useState("")

    useEffect(() => {
        const getUserDetails = async() => {
            try{
                const response = await axios.get("http://localhost:3000/api/v1/user/me", {
                    headers : {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    } 
                })
                setFirstName(response.data.firstName)
            } catch(err){
                console.error("Failed to fetch User Details: ", err)
            }
        }
        getUserDetails()
    }, [])

    


    return <div className="shadow h-14 flex justify-between">
        <div className="flex flex-col justify-center h-full ml-4">
            PayTM App
        </div>
        <div className="flex">
            <div className="flex flex-col justify-center h-full mr-4">
                <div
                    key={greetings[index]}
                    className="animate-[fadeIn_0.4s_ease-in-out]"
                >
                    {greetings[index]}
                </div>
            </div>
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl ">
                    {firstName[0]}
                </div>
            </div>
            <div className="flex justify-center h-10 mt-2 mr-2">
                <LogoutButton/>
            </div>
        </div>
    </div>
}
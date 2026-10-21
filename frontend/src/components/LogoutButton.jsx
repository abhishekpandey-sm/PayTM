
import { useNavigate } from "react-router-dom"

export const LogoutButton = () => {
    const navigate = useNavigate()

    return (
        <button
            onClick={() => {
                localStorage.removeItem("token")
                navigate("/signin")
            }}
            className="border border-red-300 text-red-500 rounded-md px-3 py-1 hover:bg-red-50"
        >
            Logout ↗
        </button>
    )
}

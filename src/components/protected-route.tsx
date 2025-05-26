import { Navigate } from "react-router-dom"
import { auth } from "../firebase"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // 로그인이 필요한 화면 판단
  const user = auth.currentUser

  // 비로그인이면 로그인 화면으로
  if (user === null) {
    return <Navigate to="/login" />
  }
  return children
}

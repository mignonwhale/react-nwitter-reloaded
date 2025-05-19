import { useState } from "react"
import { Form, Input, Wrapper } from "./auth-components"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "../firebase"
import { useNavigate } from "react-router-dom"

export default function ResetPassword() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false) // 서브밋 시 true 서버 응답 후 false
  const [email, setEmail] = useState("")

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e
    setEmail(value)
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      await sendPasswordResetEmail(auth, email)
      navigate("/login")
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Wrapper>
      <Form onSubmit={onSubmit}>
        <Input name="email" type="email" value={email} placeholder="email" onChange={onChange} />
        <Input type="submit" value={isLoading ? "Sending..." : "Send Email"} />
      </Form>
    </Wrapper>
  )
}

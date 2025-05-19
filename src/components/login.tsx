import { signInWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"
import { auth } from "../firebase"
import { Link, useNavigate } from "react-router-dom"
import { FirebaseError } from "firebase/app"
import { Error, Form, Input, Switcher, Title, Wrapper } from "./auth-components"

export default function Login() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false) // 서브밋 시 true 서버 응답 후 false
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e
    if (name === "email") {
      setEmail(value)
    } else if (name === "password") {
      setPassword(value)
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    try {
      setIsLoading(true)

      // firebase 로그인
      await signInWithEmailAndPassword(auth, email, password)

      // 다하면 홈으로
      navigate("/")
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message)
      }
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Wrapper>
      <Title>Log into ❌</Title>
      <Form onSubmit={onSubmit}>
        <Input name="email" type="email" value={email} placeholder="email" onChange={onChange} />
        <Input name="password" type="password" value={password} placeholder="password" onChange={onChange} />
        <Input type="submit" value={isLoading ? "Loading..." : "Log In"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Don't have an account? <Link to="/create-account">Create Account</Link>
      </Switcher>
    </Wrapper>
  )
}

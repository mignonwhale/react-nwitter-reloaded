import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { useState } from "react"
import { auth } from "../firebase"
import { Link, useNavigate } from "react-router-dom"
import { FirebaseError } from "firebase/app"
import { Error, Form, Input, Switcher, Title, Wrapper } from "./auth-components"
import GithubButton from "./github-btn"

export default function CreateAccount() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false) // 서브밋 시 true 서버 응답 후 false
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e
    if (name === "name") {
      setName(value)
    } else if (name === "email") {
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

      // firebase에 계정생성
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      console.log(credential)

      // 프로필 업데이트
      await updateProfile(credential.user, { displayName: name })

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
      <Title>Join ❌</Title>
      <Form onSubmit={onSubmit}>
        <Input name="name" type="text" value={name} placeholder="name" onChange={onChange} />
        <Input name="email" type="email" value={email} placeholder="email" onChange={onChange} />
        <Input name="password" type="password" value={password} placeholder="password" onChange={onChange} />
        <Input type="submit" value={isLoading ? "Loading..." : "Create Account"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Aleady have an account? <Link to="/login">Log in</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  )
}

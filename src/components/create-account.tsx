import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { useState } from "react"
import styled from "styled-components"
import { auth } from "../firebase"
import { useNavigate } from "react-router-dom"

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0px;
`
const Title = styled.h1`
  font-size: 42px;
`
const Form = styled.form`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`
const Input = styled.input`
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  width: 100%;
  font-size: 16px;
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`
const Error = styled.span`
  font-weight: 600;
  color: tomato;
`

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
    try {
      setIsLoading(true)

      // firebase에 계정생성
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      console.log(credential)

      // 프로필 업데이트
      await updateProfile(credential.user, { displayName: name })

      // 다하면 홈으로
      navigate("/")
    } catch (error) {
      // setError
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Wrapper>
      <Title>Log into ❌</Title>
      <Form onSubmit={onSubmit}>
        <Input name="name" type="text" value={name} placeholder="name" onChange={onChange} />
        <Input name="email" type="email" value={email} placeholder="email" onChange={onChange} />
        <Input name="password" type="password" value={password} placeholder="password" onChange={onChange} />
        <Input type="submit" value={isLoading ? "Loading..." : "Create Account"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
    </Wrapper>
  )
}

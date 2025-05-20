import React, { useState } from "react"
import styled from "styled-components"
import { auth, db, storage } from "../firebase"
import { addDoc, collection, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`
const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`
// input의 디자인은 변경이 어려우므로 label로 묶어서 디자인을 변경하고 input type=file 기능을 공유한다.
const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`
const AttachFileInput = styled.input`
  display: none;
`
const PostButton = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`

export default function PostTweetForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [tweet, setTweet] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value)
  }
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    if (files && files.length === 1) {
      setFile(files[0])
    }
  }
  const onsubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const user = auth.currentUser
    if (!user || isLoading || tweet === "" || tweet.length > 180) {
      return
    }
    try {
      setIsLoading(true)

      // 데이터 생성
      // db : firestore 객체?
      // tweets: collection 명 = 테이블명?
      // {} : 문서 = 데이터
      const doc = await addDoc(collection(db, "tweets"), {
        tweet,
        createdAt: Date.now(),
        username: user.displayName,
        userId: user.uid,
      })

      // 이미지 파일 생성
      if (file) {
        // Storage에 업로드할 경로
        const locationRef = ref(storage, `/tweets/${user.uid}-${user.displayName}/${doc.id}`)

        const result = await uploadBytes(locationRef, file)

        const url = await getDownloadURL(result.ref)

        await updateDoc(doc, {
          image: url,
        })
      }

      setTweet("")
      setFile(null)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Form onSubmit={onsubmit}>
      <TextArea required rows={5} maxLength={180} value={tweet} onChange={onChange} placeholder="What is happening?!" />
      <AttachFileButton htmlFor="file">{file ? "Image added ✅" : "Add Image"}</AttachFileButton>
      <AttachFileInput onChange={onFileChange} id="file" type="file" accept="image/*" />
      <PostButton type="submit" value={isLoading ? "Posting..." : "Post Tweet"} />
    </Form>
  )
}

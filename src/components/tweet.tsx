import { deleteDoc, doc, updateDoc } from "firebase/firestore"
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"
import React, { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { auth, db, storage } from "../firebase"
import type { ITweet } from "./timeline"
import { getMultiFactorResolver } from "firebase/auth"

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgb(255, 255, 255, 0.5);
  border-radius: 15px;
`
const Column = styled.div`
  &.image-column {
    place-self: end;
  }
`
const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`
const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`
const Image = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`

const Button = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  &.edit {
    background-color: #1d9bf0;
    margin-left: 10px;
  }
  &.saveImage {
    background-color: black;
    color: #1d9bf0;
    border: 1px solid;
  }
  &.saveTweet {
    background-color: #1d9bf0;
  }
`

const EditRow = styled.div`
  grid-column: 1 / -1; // 기본 2열그리드이자만 이 행은 1열로 보이도록 조정
  display: flex;
  align-items: center;
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
  margin-top: 20px;
  margin-left: 10px;
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
  border-radius: 5px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;
`
const AttachFileInput = styled.input`
  display: none;
`

const EditButton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-left: 10px;
`

export default function Tweet({ username, image, tweet, userId, id }: ITweet) {
  const user = auth.currentUser
  const [isEditing, setIsEditing] = useState(false)
  const [newTweet, setNewTweet] = useState(tweet)
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

  const deletTweet = async () => {
    const ok = confirm("Are you sure to delete this tweet?")
    if (!ok || user?.uid !== userId) {
      return
    }
    try {
      // tweet 삭제
      await deleteDoc(doc(db, "tweets", id))

      // 이미지 삭제
      if (image) {
        const imageRef = ref(storage, `tweets/${user.uid}/${id}`)
        await deleteObject(imageRef)
      }
    } catch (error) {
      console.log(error)
    } finally {
    }
  }
  const editTweetForm = () => {
    setIsEditing(true)
  }
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e.target.value)

    setNewTweet(e.target.value)
  }

  const saveImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const user = auth.currentUser
    const { files } = e.target

    if (!user || !files || !confirm("Are you sure to change your image?")) {
      e.target.value = ""
      return
    }

    try {
      if (files && files.length === 1) {
        // 새파일 업로드
        // Storage에 업로드할 경로
        const locationRef = ref(storage, `/tweets/${user.uid}/${id}`)
        const result = await uploadBytes(locationRef, files[0])
        const url = await getDownloadURL(result.ref)

        // 이미 url 변경
        const editRef = doc(db, "tweets", id)
        await updateDoc(editRef, {
          image: url,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
  const saveTweet = async () => {
    console.log(newTweet)

    if (!newTweet || user?.uid !== userId) {
      return
    }

    try {
      const editRef = doc(db, "tweets", id)
      await updateDoc(editRef, {
        tweet: newTweet,
        updatedAT: Date.now(),
      })
      setIsEditing(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (isEditing && textAreaRef.current) {
      textAreaRef.current.focus()
    }
  }, [isEditing])

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        {user?.uid === userId ? <Button onClick={deletTweet}>delete</Button> : null}
        {user?.uid === userId ? (
          <Button className="edit" onClick={editTweetForm}>
            edit
          </Button>
        ) : null}
      </Column>
      <Column className="image-column">{image ? <Image src={image} /> : null}</Column>
      {isEditing ? (
        <EditRow>
          <TextArea ref={textAreaRef} required rows={5} maxLength={180} value={newTweet} onChange={onChange} />
          <EditButton>
            <AttachFileButton className="saveImage" htmlFor="nweFile">
              {image ? "update image" : "post image"}
            </AttachFileButton>
            <AttachFileInput onChange={saveImage} id="nweFile" type="file" accept="image/*" />
            <Button className="saveTweet" onClick={saveTweet}>
              update tweet
            </Button>
          </EditButton>
        </EditRow>
      ) : null}
    </Wrapper>
  )
}

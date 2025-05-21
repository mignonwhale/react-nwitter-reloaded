import styled from "styled-components"
import type { ITweet } from "./timeline"
import { auth, db, storage } from "../firebase"
import { deleteDoc, doc, updateDoc } from "firebase/firestore"
import { deleteObject, ref } from "firebase/storage"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import PostTweetForm from "./post-tweet-form"

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgb(255, 255, 255, 0.5);
  border-radius: 15px;
`
const Column = styled.div`
  &:last-child {
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
  margin-right: 10px;
  cursor: pointer;
  &.edit {
    background-color: #1d9bf0;
  }
  &.save {
    background-color: #1d9bf0;
    margin: 10px;
  }
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

export default function Tweet({ username, image, tweet, userId, id }: ITweet) {
  const user = auth.currentUser
  const [isEditing, setIsEditing] = useState(false)
  const [newTweet, setNewTweet] = useState(tweet)
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
    setNewTweet(e.target.value)
  }
  const saveTweet = async () => {
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
        {isEditing ? (
          <>
            <TextArea required rows={5} maxLength={180} value={newTweet} onChange={onChange} />
            <Button className="save" onClick={saveTweet}>
              save
            </Button>
          </>
        ) : null}
      </Column>
      <Column>{image ? <Image src={image} /> : null}</Column>
    </Wrapper>
  )
}

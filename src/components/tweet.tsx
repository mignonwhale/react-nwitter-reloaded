import styled from "styled-components"
import type { ITweet } from "./timeline"
import { auth, db, storage } from "../firebase"
import { deleteDoc, doc } from "firebase/firestore"
import { deleteObject, ref } from "firebase/storage"

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

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`

export default function Tweet({ username, image, tweet, userId, id }: ITweet) {
  const user = auth.currentUser
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
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        {user?.uid === userId ? <DeleteButton onClick={deletTweet}>delete</DeleteButton> : null}
      </Column>
      <Column>{image ? <Image src={image} /> : null}</Column>
    </Wrapper>
  )
}

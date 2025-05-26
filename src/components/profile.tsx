import { updateProfile } from "firebase/auth"
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import type React from "react"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { auth, db, storage } from "../firebase"
import type { ITweet } from "./timeline"
import Tweet from "./tweet"

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`

const AvatarUpload = styled.label`
  width: 100px;
  height: 100px;
  overflow: hidden;
  border: 1px solid #1d9bf0;
  border-radius: 50%;
`
const AvatarImg = styled.img`
  width: 100%;
`
const AvatarInput = styled.input`
  display: none;
`

const Tweets = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const NameEdit = styled.div`
  display: flex;
`
const NameInput = styled.input`
  background-color: black;
  border: 1px solid white;
  color: white;
`
const NameInputButton = styled.div`
  width: 20px;
  height: 20px;
  margin-left: 5px;
`

const Name = styled.span`
  font-weight: 600;
  font-size: 22px;
`

export default function Profile() {
  const user = auth.currentUser

  const [avatar, setAvatar] = useState(user?.photoURL)
  const [tweets, setTweets] = useState<ITweet[]>([])
  const [newName, setNewName] = useState("")
  const [isEditing, setIsEditing] = useState(!user?.displayName)

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target

    if (!user) {
      return
    }
    if (files && files.length === 1) {
      const file = files[0]
      const locationRef = ref(storage, `/avatars/${user.uid}`)
      await uploadBytes(locationRef, file)
      const url = await getDownloadURL(locationRef)
      setAvatar(url)

      // firebase에서 제공하는 프로필에 업데이트
      await updateProfile(user, {
        photoURL: url,
      })
    }
  }

  const onClick = () => {
    setIsEditing(true)
  }

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setNewName(newName)
  }

  const onClickNameButton = async () => {
    if (!user || !newName) return
    try {
      await updateProfile(user, { displayName: newName })
      setIsEditing(false)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchTweets = async () => {
    const myTweetQuery = query(collection(db, "tweets"), where("userId", "==", user?.uid), orderBy("createdAt", "desc"), limit(25))
    const snapshot = await getDocs(myTweetQuery)
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, image } = doc.data()
      return {
        tweet,
        createdAt,
        userId,
        username,
        image,
        id: doc.id,
      }
    })
    setTweets(tweets)
  }
  useEffect(() => {
    fetchTweets()
  }, [])

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
            <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput id="avatar" type="file" accept="image/*" onChange={onChange} />
      {isEditing ? (
        <NameEdit>
          <NameInput type="text" value={newName} onChange={onChangeName} />
          <NameInputButton onClick={onClickNameButton}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </NameInputButton>
        </NameEdit>
      ) : (
        <Name onClick={onClick}>{user?.displayName ?? "Anonymous"}</Name>
      )}
      <Tweets>
        {tweets.map((tweet) => {
          return <Tweet key={tweet.id} {...tweet} />
        })}
      </Tweets>
    </Wrapper>
  )
}

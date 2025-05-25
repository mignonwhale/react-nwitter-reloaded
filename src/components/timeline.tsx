import { collection, limit, onSnapshot, orderBy, query, type Unsubscribe } from "firebase/firestore"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { db } from "../firebase"
import Tweet from "./tweet"

export interface ITweet {
  id: string
  tweet: string
  createdAt: number
  userId: string
  username: string
  image?: string
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  /* overflow-y: scroll; */
`
export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([])

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null // 이벤트 제거 시 사용
    const fetchTweets = async () => {
      const tweetQuery = query(collection(db, "tweets"), orderBy("createdAt", "desc"), limit(25))

      // 목록 조회
      // const snapshot = await getDocs(tweetQuery)
      // const tweets = snapshot.docs.map((doc) => {
      //   const { tweet, createdAt, userId, username, image } = doc.data()
      //   return {
      //     tweet,
      //     createdAt,
      //     userId,
      //     username,
      //     image,
      //     id: doc.id,
      //   }
      // })

      // 실시간 변경사항 반환
      unsubscribe = await onSnapshot(tweetQuery, (snapshot) => {
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
      })
    }
    fetchTweets()
    return () => {
      // 컴포넌트 제거 시 이벤트도 제거
      unsubscribe && unsubscribe()
    }
  }, [])

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  )
}

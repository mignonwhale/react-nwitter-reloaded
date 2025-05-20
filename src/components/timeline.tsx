import { collection, getDocs, orderBy, query } from "firebase/firestore"
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

const Wrapper = styled.div``
export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([])
  const fetchTweets = async () => {
    const tweetQuery = query(collection(db, "tweets"), orderBy("createdAt", "desc"))
    const snapshot = await getDocs(tweetQuery)
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
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  )
}

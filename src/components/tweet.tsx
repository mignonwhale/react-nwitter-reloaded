import styled from "styled-components"
import type { ITweet } from "./timeline"

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgb(255, 255, 255, 0.5);
`
const Column = styled.div``
const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
  color: white;
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

export default function Tweet({ username, image, tweet }: ITweet) {
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
      </Column>
      {image ? (
        <Column>
          <Image src={image} />
        </Column>
      ) : null}
    </Wrapper>
  )
}

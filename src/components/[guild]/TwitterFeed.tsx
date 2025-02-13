import {
  Box,
  Button,
  HStack,
  Icon,
  Img,
  ScaleFade,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react"
import ColorCard from "components/common/ColorCard"
import Link from "components/common/Link"
import { TwitterLogo } from "phosphor-react"
import { useEffect, useState } from "react"

type Props = {
  hashtag: string
}

const TwitterFeed = ({ hashtag }: Props): JSX.Element => {
  const [loading, setLoading] = useState(true)
  const [tweetsData, setTweetsData] = useState(null)

  useEffect(() => {
    fetch(`/api/twitterFeed/${hashtag}`)
      .then((rawResponse) => rawResponse.json())
      .then((response) => {
        setTweetsData(response)
        setLoading(false)
      })
      .catch(console.error)
  }, [])

  if (loading)
    return (
      <HStack alignItems="center" justifyContent="center">
        <Spinner mx="auto" />
      </HStack>
    )

  if (!tweetsData?.length)
    return (
      <ColorCard color="TWITTER.500">
        <Text as="span" color="gray.400">
          {`It seems like there aren't any tweets with the #${hashtag} hashtag yet`}
        </Text>
      </ColorCard>
    )

  return (
    <ScaleFade in={tweetsData?.length}>
      <ColorCard color="TWITTER.500">
        <Box
          position="relative"
          maxHeight="sm"
          overflowX="hidden"
          overflowY="auto"
          className="custom-scrollbar"
        >
          <VStack width="full" spacing={0}>
            {tweetsData.map((tweet) => (
              <HStack
                key={tweet.id}
                py={4}
                width="full"
                borderBottomWidth={1}
                borderBottomColor="gray.600"
                spacing={4}
                alignItems="start"
              >
                <Img
                  src={tweet.user.profile_image_url}
                  boxSize={12}
                  rounded="full"
                />
                <VStack alignItems="start" spacing={1}>
                  <HStack spacing={2}>
                    <Text as="span" fontWeight="bold">
                      <Link
                        href={`https://twitter.com/${tweet.user.username}`}
                        target="_blank"
                      >
                        @{tweet.user.username}
                      </Link>
                    </Text>
                    <Text as="span" color="gray.400">
                      ·
                    </Text>
                    <Text as="span" color="gray.400" fontSize="sm">
                      {tweet.created_at}
                    </Text>
                  </HStack>
                  <Text wordBreak="break-word" color="gray.300">
                    {tweet.tweetAsArray
                      ? tweet.tweetAsArray.map(
                          (section, index) =>
                            (index % 2 === 0 && (
                              <Text
                                // eslint-disable-next-line react/no-array-index-key
                                key={index}
                                as="span"
                                dangerouslySetInnerHTML={{ __html: section }}
                              />
                            )) || (
                              <Link
                                // eslint-disable-next-line react/no-array-index-key
                                key={index}
                                href={`https://twitter.com/hashtag/${section.replace(
                                  "#",
                                  ""
                                )}`}
                                target="_blank"
                                _hover={{
                                  textDecoration: "underline",
                                  textDecorationColor: "TWITTER.500",
                                }}
                              >
                                <Text as="span" color="TWITTER.500">
                                  {section}
                                </Text>
                              </Link>
                            )
                        )
                      : tweet.text}
                  </Text>
                  {tweet.img && <Img src={tweet.img} rounded="lg" />}
                </VStack>
              </HStack>
            ))}

            <Box pt={6} pb={2}>
              <a
                href={`https://twitter.com/hashtag/${hashtag}`}
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  maxWidth="full"
                  fontSize="sm"
                  leftIcon={<Icon as={TwitterLogo} />}
                >
                  {`Read more #${hashtag} Tweets`}
                </Button>
              </a>
            </Box>
          </VStack>
        </Box>
      </ColorCard>
    </ScaleFade>
  )
}

export default TwitterFeed

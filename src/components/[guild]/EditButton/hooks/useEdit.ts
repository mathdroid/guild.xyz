import useShowErrorToast from "components/create-guild/hooks/useShowErrorToast"
import { useGuild } from "components/[guild]/Context"
import usePersonalSign from "hooks/usePersonalSign"
import useSubmit from "hooks/useSubmit"
import useToast from "hooks/useToast"
import { useSWRConfig } from "swr"

type Data = {
  themeMode: string
  themeColor: string
}

const useEdit = (onClose: () => void) => {
  const { mutate } = useSWRConfig()
  const toast = useToast()
  const showErrorToast = useShowErrorToast()
  const { addressSignedMessage } = usePersonalSign()
  const { id } = useGuild()

  const submit = (data: Data) =>
    fetch(`${process.env.NEXT_PUBLIC_API}/community/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addressSignedMessage, ...data }),
    })

  return useSubmit<Data, any>(submit, {
    onSuccess: () => {
      toast({
        title: `Guild successfully updated!`,
        status: "success",
        duration: 4000,
      })
      onClose()
      // temporary until there's no SWR for single guild data
      mutate("guilds")
    },
    onError: (error) => {
      if (!error) return
      if (error instanceof Error) showErrorToast(error.message)
      else showErrorToast(error.errors)
    },
  })
}

export default useEdit

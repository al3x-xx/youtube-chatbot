# Simple YouTube ChatBot
```javascript
import { ytChatBot } from "youtube-chatbot"

const bot = new ytChatBot({
    streamId: "", // value after watch?v=
    cookies: {
        SID: "",
        HSID: "",
        SSID: "",
        APISID: "",
        SAPISID: "",
        LOGIN_INFO: ""
    }
})

bot.update.message(async (message) => {
    if (message.message.text === "!stop") {
        await bot.chat.sendMessage("stopped")
        await bot.update.stop()
    }
})

bot.update.end(() => {
    console.log("stream end")
})

bot.update.start()
```
```typescript
interface ytMessage {
    message: {
        text: string,
        emoji: string
    },
    authorName: string,
    authorPhoto: string,
    authorBadges: {
        isOwner: boolean,
        isModerator: boolean, 
        isVerified: boolean
    },
    authorExternalChannelId: string,
    timeStamp: number
}
```
import { ytRequest } from "./request.js"
import { ytChat } from "./chat.js"
import { ytChatUpdate } from "./update.js"

export class ytChatBot {
    public readonly chat: ytChat
    public readonly update: ytChatUpdate

    public constructor(options: any) {
        const ytReq = new ytRequest(options.cookies)

        this.chat = new ytChat(ytReq, options.streamId)
        this.update = new ytChatUpdate(this.chat)
    }
}
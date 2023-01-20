import { ytRequest } from "./request.js"
import { ytChat } from "./chat.js"
import { ytChatUpdate } from "./update.js"

export class ytChatBot {
    readonly chat: ytChat
    readonly update: ytChatUpdate

    constructor(options: any) {
        const ytReq: ytRequest = new ytRequest(options.cookies)

        this.chat = new ytChat(ytReq, options.streamId)
        this.update = new ytChatUpdate(this.chat)
    }
}
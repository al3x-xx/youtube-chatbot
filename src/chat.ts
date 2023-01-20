import { ytRequest } from "./request.js"
import { ytChatOptions, ytMessage } from "./interface.js"
import { ytChatMessageParse } from "./message-parse.js"

export class ytChat extends ytChatMessageParse {
    private chatOptions: ytChatOptions

    constructor(private readonly req: ytRequest, private readonly streamId: string) {
        super()
    }

    async processChat(options: ytChatOptions): Promise<[boolean, undefined | ytMessage[]]> {
        const liveChat: any | undefined = await this.getLiveChat(options)
        if (!liveChat || liveChat?.error) return [!liveChat?.error, undefined]
        options.continuation = liveChat.continuationContents?.liveChatContinuation.continuations[0].invalidationContinuationData.continuation
        return [true, this.parseMessage(liveChat)]
    }

    async sendMessage(message: string): Promise<void> {
        if (!this.chatOptions || !this.chatOptions?.params) await this.getChatOptions()

        await this.req.requestAPI("send_message", {
            context: {
                client: {
                    clientName: "WEB",
                    clientVersion: this.chatOptions.clientVersion
                }
            },
            params: this.chatOptions.params,
            richMessage: {
                textSegments: [
                    {
                        text: message
                    }
                ]
            }
        })
    }

    async getChatOptions(): Promise<undefined | ytChatOptions> {
        const res: string = await this.req.requestGet(`/watch?v=${this.streamId}`)

        const continuation: RegExpExecArray = /"continuation":"(.+?)"/.exec(res)
        if (!continuation) return undefined

        this.chatOptions = {
            clientVersion: /"clientVersion":"(.+?)"/.exec(res)[1],
            continuation: continuation[1],
            params: await this.getParamsSendMessage(continuation[1])
        }

        return await this.getLiveChat(this.chatOptions).then(r => {
            return {
                clientVersion: this.chatOptions.clientVersion,
                continuation: r.continuationContents?.liveChatContinuation.continuations[0].invalidationContinuationData.continuation
            }
        })
    }

    private async getLiveChat(options: ytChatOptions): Promise<any | undefined> {
        return await this.req.requestAPI("get_live_chat", {
            context: {
                client: {
                    clientName: "WEB",
                    clientVersion: options.clientVersion
                }
            },
            continuation: options.continuation
        })
    }

    private async getParamsSendMessage(continuation: string): Promise<string> {
        return await this.req.requestGet(`/live_chat?continuation=${continuation}`).then(r => {
            const res: RegExpExecArray = /"sendLiveChatMessageEndpoint":{"params":"(.+?)"/.exec(r)
            return res ? res[1] : ""
        })
    }
}
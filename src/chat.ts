import { ytRequest } from "./request.js"
import { ytChatOptions, ytMessage } from "./interface.js"
import { ytChatMessageParse } from "./message-parse.js"

export class ytChat extends ytChatMessageParse {
    private chatOptions: ytChatOptions

    public constructor(private req: ytRequest, private streamId: string) {
        super()
    }

    public processChat = async (options: ytChatOptions): Promise<[boolean | undefined, ytMessage[] | undefined]> => {
        const liveChat = await this.getLiveChat(options)
        if (!liveChat || liveChat?.error) return [!liveChat?.error, undefined]
        options.continuation = liveChat.continuationContents?.liveChatContinuation.continuations[0].invalidationContinuationData.continuation
        return [true, this.parseMessage(liveChat)]
    }

    public sendMessage = async (message: string): Promise<void> => {
        if (!this.chatOptions || !this.chatOptions?.params) {
            await this.getChatOptions()
        }

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

    public getChatOptions = async (): Promise<ytChatOptions | undefined> => {
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

    private getLiveChat = async (options: ytChatOptions): Promise<any> => {
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

    private getParamsSendMessage = async (continuation: string): Promise<string> => {
        return await this.req.requestGet(`/live_chat?continuation=${continuation}`).then(r => {
            const res: RegExpExecArray = /"sendLiveChatMessageEndpoint":{"params":"(.+?)"/.exec(r)
            return res ? res[1] : ""
        })
    }
}
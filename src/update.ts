import { setIntervalAsync, clearIntervalAsync } from "set-interval-async"

import { ytChat } from "./chat.js"
import { ytChatOptions, ytMessage } from "./interface.js"

export class ytChatUpdate {
    private messageFunc: (message: ytMessage) => void
    private endFunc: () => void

    private timer: any

    constructor(private readonly chat: ytChat) {}

    message(f: typeof this.messageFunc): void {
        this.messageFunc = f
    }

    end(f: typeof this.endFunc): void {
        this.endFunc = f
    }

    async start(): Promise<void> {
	if (!this.messageFunc) return
        const options: undefined | ytChatOptions = await this.chat.getChatOptions()
        if (!options) return
        this.timer = setIntervalAsync(async (): Promise<void> => {
            const [status, message] = await this.chat.processChat(options)
            if (status) {
                if (message) {
                    for (const buf of message) {
                        this.messageFunc(buf)
                    }
                }
            } else if (this.endFunc) {
                this.stop()
                this.endFunc()
            }
        }, 1000)
    }

    async stop(): Promise<void> {
        await clearIntervalAsync(this.timer)
    }
}
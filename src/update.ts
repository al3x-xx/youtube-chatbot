import { setIntervalAsync, clearIntervalAsync } from "set-interval-async"

import { ytChat } from "./chat.js"
import { ytMessage } from "./interface.js"

export class ytChatUpdate {
    private messageFunc: (message: ytMessage) => void
    private endFunc: () => void

    private timer: any

    public constructor(private readonly chat: ytChat) {}

    public message = (f: (message: ytMessage) => void): void => {
        this.messageFunc = f
    }

    public end = (f: () => void): void => {
        this.endFunc = f
    }

    public start = async (): Promise<void> => {
	if (!this.messageFunc) return
        const options = await this.chat.getChatOptions()
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

    public stop = async (): Promise<void> => {
        await clearIntervalAsync(this.timer)
    }
}

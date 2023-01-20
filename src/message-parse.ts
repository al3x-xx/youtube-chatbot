import { ytMessageRuns, ytAuthorBadges, ytMessage } from "./interface.js"

export class ytChatMessageParse {
    private parseMessageRuns(messageRuns: any[]): ytMessageRuns {
        let ret: ytMessageRuns = { text: "", emoji: "" }
        for (const buf of messageRuns) {
            if (buf?.text) {
                ret.text += buf.text
            } else if (buf?.emoji && buf.emoji.shortcuts) {
                ret.emoji += buf.emoji.shortcuts[0]
            }
        }
        return ret
    }

    private parseAuthorBadges(authorBadges: any[]): ytAuthorBadges {
        let ret: ytAuthorBadges = { isOwner: false, isModerator: false, isVerified: false }
        if (!authorBadges) return ret
        for (const buf of authorBadges) {
            switch (buf.liveChatAuthorBadgeRenderer.icon?.iconType) {
                case "OWNER":
                    ret.isOwner = true
                    break
                case "MODERATOR":
                    ret.isModerator = true
                    break
                case "VERIFIED": ret.isVerified = true
            }
        }
        return ret
    }

    protected parseMessage(liveChat: any): undefined | ytMessage[] {
        const actions: any[] = liveChat.continuationContents.liveChatContinuation.actions
        if (!actions) return undefined

        let ret: ytMessage[] = []

        for (const buf of actions) {
            if (!buf?.addChatItemAction) continue

            const messageRender: any = buf.addChatItemAction.item.liveChatTextMessageRenderer

            ret.push({
                message: this.parseMessageRuns(messageRender.message.runs),
                authorName: messageRender.authorName.simpleText,
                authorPhoto: messageRender.authorPhoto.thumbnails[0].url.split("=", 1)[0],
                authorBadges: this.parseAuthorBadges(messageRender.authorBadges),
                authorExternalChannelId: messageRender.authorExternalChannelId,
                timeStamp: messageRender.timestampUsec
            })
        }
        return ret
    }
}
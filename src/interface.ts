/*export interface ytCookie {
    readonly SID: string,
    readonly HSID: string,
    readonly SSID: string,
    readonly APISID: string,
    readonly SAPISID: string,
    readonly LOGIN_INFO: string
}*/

export interface ytChatOptions {
    readonly clientVersion: string,
    continuation: string,
    readonly params?: string
}

export interface ytMessageRuns {
    text: string,
    emoji: string
}

export interface ytAuthorBadges {
    isOwner: boolean,
    isModerator: boolean, 
    isVerified: boolean
}

export interface ytMessage {
    readonly message: ytMessageRuns,
    readonly authorName: string,
    readonly authorPhoto: string,
    readonly authorBadges: ytAuthorBadges
    readonly authorExternalChannelId: string,
    readonly timeStamp: number
}
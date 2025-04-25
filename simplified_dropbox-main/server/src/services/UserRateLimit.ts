export type Bucket = {
    user: string;
    token: number;
    lastAccessTime: number;
};

class RateLimitService {
    private static userTokenMap = new Map<string, Bucket>();
    private static windowSize = 5 * 1000; // 5 seconds = 1 token for upload and download
    private static tokenPerWindow = 1;

    public static allowUser(username: string | undefined): boolean {
        console.log(`allowUser called for userName = ${username}`);
        if (!username) return false;

        const currentTime = Date.now();
        let bucket = this.userTokenMap.get(username);

        if (!bucket) {
            bucket = {
                user: username,
                token: this.tokenPerWindow - 1,
                lastAccessTime: currentTime,
            };
            this.userTokenMap.set(username, bucket);
            return true;
        }

        const timeDifference = currentTime - bucket.lastAccessTime;

        if (timeDifference >= this.windowSize) {
            bucket.token = this.tokenPerWindow - 1;
            bucket.lastAccessTime = currentTime;
            this.userTokenMap.set(username, bucket);
            return true;
        }

        if (bucket.token > 0) {
            bucket.token -= 1;
            this.userTokenMap.set(username, bucket);
            return true;
        }

        console.log(`${username} has exhausted their rate limit`);
        console.log(`${username} token left = ${JSON.stringify(bucket)}`);
        return false;
    }
}

export default RateLimitService;

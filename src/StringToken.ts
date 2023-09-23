class StringToken {
    private index:number
    private tokens:string
    constructor(stringTokens: string,) {
        this.tokens = stringTokens
        this.index = 0
    }
    static new(stringTokens: string,) {
        return new this(stringTokens,)
    }
    // 是否还有token可以递归
    hasLoopToken(): boolean {
        return this.index < this.tokens.length
    }
    // 获取当前 index 下的值并且 index+1
    getToken() {
        let value = this.tokens[this.index]
        this.index += 1
        return value
    }
    // 查看上一个 token 的值
    peekPreToken() {
        return this.tokens[this.index - 2]
    } 
    // 查看下一个 token 的值
    peekNextToken() {
        return this.tokens[this.index]
    }
    peekIndex() {
        return this.index
    }
    // index 跳步骤
    stepIndex(step: number) {
        return this.index + step
    }
    // 切割
    sliceToken(startIndex: number, endIndex: number,) {
        return this.tokens.slice(startIndex, endIndex)
    }
}
export default StringToken
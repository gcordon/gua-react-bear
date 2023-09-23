class WellToken {
    public wellIndexs: number[]
    public wellTags: string[]
    constructor() {
        // 数组长度为单独，代表开始#号，双数代表结束#号
        this.wellIndexs = [
            // 1, 5      //  存的值为数字下标 index   这里的 1 表示#号开始 5 表示#号结束
        ]
        this.wellTags = []
    }
    static new() {
        return new this()
    }
    addWellTags(tag: string) {
        this.wellTags.push(tag)
    }
    getWellTags() {
        return this.wellTags
    }
    isWellFh = (value: string,) => {
        return value === '#'
    }
    isEmpty = (value: string | undefined | null): boolean => {
        console.log("🚀 ~ 井号类 ~ App ~ value:", value)
        // let s1 = value
        // let hasEmpty = false
        // let index = 0
        // while (index < s1.length) {
        //     if (s1[index] === '') {
                
        //     }
        // }
        // return hasEmpty
        if (!value) {
            return false
        }
        return value.includes(' ')
    }
    // 获取标签数组值
    getWeellTag(): string[] {
        return this.wellTags
    }
    // 是否有井号标识存在
    hasWell(): boolean {
        return this.wellIndexs.length > 0
    }
    // 单数 1 3 5 ...
    is单数Well(): boolean {
        return this.wellIndexs.length % 2 === 1
    }
    // 双数 2 4 6 ...
    is双数Well(): boolean {
        return this.wellIndexs.length % 2 === 0
    }
    // 是否存在一组 tag 了
    isOneTag() {
        return this.wellIndexs.length >= 2
    }
}

export default WellToken
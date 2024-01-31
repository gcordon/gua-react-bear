// 1 记录下拉切换 2 激活元素
export class ClassnamsToggleHistory {
    // 单例
    static __instanceof
    static new(...args) {
        if (!this.__instanceof) {
            this.__instanceof = new this(...args)
        }
        return this.__instanceof
    }
    constructor(...args) {
        this.testData()
    }
    // 数据测试
    testData() {
        let es = [
            ['["gua1"]', null,],
            ['["gua1","gua2"]', null,],
            ['["gua1","gua2","gua3"]', null,],
            ['["lin1"]', null,],
        ]
        this.#openHistory = es
        this.#activeHistory = [es[1]]
    }
    // 点击箭头 “开启” 的历史 target
    #openHistory = [
        // 有0或多个
        // [ targetValueName, elementDOM, ],  // 格式 第一个参数用于操作查询，第二个参数只用于debug【记住不能在代码中使用】
       
    ]
    // 当前点击的激活
    #activeHistory = [
        // 只可能有0或1个
        // [ targetValueName, elementDOM, ],  // 格式 第一个参数用于操作查询，第二个参数只用于debug【记住不能在代码中使用】
    ]
    e1(name) {
        return document.querySelector(name)
    }
    es(name) {
        return document.querySelectorAll(name)
    }
    // 展开下拉过的ul元素
    async showUlDoms() {
        console.log("🚀 ~ ClassnamsToggleHistory ~ forawait ~ this.#openHistory:", this.#openHistory)
        //  循环也可以用于同步遍历器。
        for await(let arr of this.#openHistory) {
            let targetValue = arr[0]
            let el = this.e1(`.tag__parent[data-tag-value='${targetValue}']`)
            //  查询不到，说明元素的被【删除】或【名字改变了】所以直接跳过就好了
            if (!el) {
                continue //跳过当前迭代的剩余代码，直接进入下一次迭代。
            }
            el
                .nextElementSibling // // [子下拉dom ul] 相邻的下一个兄弟dom ul
                .classList
                .add('tag__children--active')
        }
    }
    // 高亮当前选中的行
    async activeDom() {
        let targetValue = this.#activeHistory
        // 移除所有激活的
        let allEl = this.es('.tag__parent')
        for await(const el of allEl) {
            el.classList.remove('tag__parent--active')
        }
        if (targetValue.length) {
            // 高亮选中的激活
            let el = this.e1(`[data-tag-value='${targetValue[0][0]}`)
            if (el === null) {
                return
            }
            el.classList.add('tag__parent--active')
        }
    }
    // 
    async toggleDom() {
        this.activeDom()
        this.showUlDoms()
    }
    #ulActiveDoms
    #activeCurrent
    async searchActiveDom() {
        this.#ulActiveDoms = this.es('.tag__children--active')   //    已经展开下拉的ul
        this.#activeCurrent = this.e1('.tag__parent--active')     //    点击高亮的
    }
    // 保存ul激活历史操作
    async saveUlHistorys() {
        // 清除历史
        this.#openHistory = []

        for await(let el of this.#ulActiveDoms) {
            let targetValue = el
                        .previousElementSibling // 上一个兄弟组件
                        .dataset.tagValue  // ！！严格查询，应该有这个标识才是我们希望的
            if (!targetValue) {
                console.error('!出错，查询上一个兄弟dom失败');
                return
            }
            let element = this.e1(`[data-tag-value='${targetValue}`)
            this.#openHistory.push(
                [targetValue, element, ]
            )
        }
    }
    // 保存ul激活历史操作
    async saveActiveHistorys() {
        // 清除历史
        this.#activeHistory = []

        // 未选中任何需要激活的
        if (this.#activeCurrent === null) {
            console.error('!出错 未查询到当前激活的元素')
            return
        }

        let targetValue = this.#activeCurrent.dataset.tagValue  // ！！严格查询，应该有这个标识才是我们希望的
        let element = this.e1(`[data-tag-value='${targetValue}`)
        if (targetValue && element) {
            this.#activeHistory = [
                [targetValue, element,],
            ]
        }
    }
    async saveDomHisotrys() {
        await this.saveUlHistorys()
        await this.saveActiveHistorys()
    }
    async logData() {
        console.log("🚀 ~ saveElement ~ this.#openHistory:", this.#openHistory)
        console.log("🚀 ~ saveElement ~ this.#activeHistory:", this.#activeHistory)
        // 这里没有返回任何东西，但是使用了 async 语法 会返回 resolve
    }
}
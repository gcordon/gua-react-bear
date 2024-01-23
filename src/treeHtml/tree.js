// 2 个数组 比较是否相等
const arrEqualChck = (a1, a2) => {
    // 长度判断
    if (a1.length !== a2.length) {
        return false
    }
    // 每个值对比
    let eq = true
    for (let i = 0; i < a1.length; i++) {
        const v1 = a1[i]
        const v2 = a2[i]
        if (v1 !== v2) {
            // 终止所有判断
            eq = false
            break
        }
    }
    return eq
}

window.clickTagHistory = [
]
const addHistory = (arrValue) => {
    window.clickTagHistory.push(arrValue) 
}
const arrowCheck = (arrValue) => {
    // 如果历史记录是空的，把当前箭头点击的加入点击的历史记录中
    if (window.clickTagHistory.length === 0) {
        addHistory(arrValue)
        return true
    }


    let lastValue = window.clickTagHistory.at(-1)
    let newValue = arrValue

    // console.log("🚀 ~ arrowCheck ~ lastValue和newValue:", lastValue, newValue)
    
    
    // 新值 一定小于 旧值 长度
    if (newValue.length >= lastValue.length) {
        // 如  新是[22,11]   旧是[11]
        console.log('新值大于旧值了')
        return false
    }
    
    // console.log("🚀 ~ arrowCheck ~ lastValue:", lastValue)
    // console.log("🚀 ~ arrowCheck ~ newValue:", newValue)

    // 获取俩个数组中长度最短的一个
    // 如 新是[55, 44]     旧是[33,22,11]    返回 false  不同级 切换
    // 如 新是[55, 44,]    旧是[55, 44, 33]  返回 true   同一级 切换
    let bigMinLength = Math.min(lastValue.length, newValue.length)
    lastValue = lastValue.slice(0, bigMinLength,)
    newValue = newValue.slice(0, bigMinLength,)

    // 比较 2个 数组内的值
    let b = arrEqualChck(lastValue, newValue,)
    return b
}
const diagnosis = (a, b, c, ) => {
    let status = b === c 
    console.log(`auto test------`)
    console.log(`auto test:  历史点击记录:  `, JSON.stringify(window.clickTagHistory))
    console.log(`auto test:  测试数据:       ${a}-----`)
    console.log(`auto test:  测试结果:       测试${status ? '成功': '失败'}`)
    console.log(`auto test------`)

    if (!status) {
        throw Error('diagnosis 测试失败')
    }
    console.log(``)
}
// 自动化测试
const historyAutoTest = () => {
    const testClick12 = [
        // 第三次点击 - 1    高亮
        [
            '父标签1', 
        ],
        // 第三次点击 - 2   不高亮
        [
            '父标签1', '父标签2', '父标签3',
        ],
    ]
    // 第三次点击 的测试数据
    const testClick3 = [
        // 第一次点击
        [
            '父标签1',
        ],
        true,
        // 第二次点击 
        [
            '父标签1', '父标签2', 
            // '父标签3',  
        ],
        true,
        [
            '父标签1', '父标签2', '父标签3',
        ],
        false,
        [
            '父标签1', '父标签2', '父标签3', '父标签4',
        ],
        false,
        [
            '其他标签1', '其他标签2',
        ],
        false,
        [
            '其他标签1',
        ],
        false,
        [
            '其他标签1', '其他标签2', '其他标签3',
        ],
        false,
        [
            '父标签1',
        ],
        true,
    ]
    // console.log(`log 调试数据: `, arrEqualChck([11,2], [11]) );
    // 点击标签的历史记录
  
    // 测试相关
    window.clickTagHistory = [
        ...testClick12,
    ]
    for (let index = 0; index < testClick3.length; index += 2) {
        const e = testClick3[index]
        const status = testClick3[index+1]
        diagnosis(e, arrowCheck(e), status)
    }
}
// historyAutoTest()

const treeToggle = (callback,) => {
    const tagParents = document.querySelectorAll('.tag__parent')
    // 清除所有的高亮
    const clearAllParentActive = () => {
        tagParents.forEach(value => {
            value.classList.remove('tag__parent--active')
        })
    }
    tagParents.forEach(element => {
        let 向下捕获 = true
        // 注意这里不能用箭头函数作为回调，如果是箭头函数的话，指向的就是 Foreach 中的东西的，
        // 否则，this获取的就是window
        element.addEventListener('click', function(currentClickElement) {
            /**
             // TIP:
             this 获取到的是整体
             currentClickElement 获取到的是整体内捕获到的，如 左侧的箭头或井号符号 与 右侧的文字
             */

            let target = currentClickElement.target
            let { tagType, } = target.dataset

            // 点击的元素是最高的父元素
            let click整体 = target === this
            // 左侧区域
            // let click整体内的箭头 = tagType === '还没写'
            let click整体内的箭头的箭头符号 = tagType === 'tagArrow'
            let click整体内的箭头的井号符号 = tagType === 'tagCode'
            // 右侧区域
            let click整体内的文字 = tagType === 'tagName'


            // 获取当前点击的标签标识
            let tagValue = this.dataset.tagValue  // 获取到是一个字符串数组，用eval可以转换为真正的js数组形式
                tagValue = eval(tagValue) // 返回一个数组


            const activeCurrentClick = () => {
                // 让其他的所有 父标签 高亮取消
                clearAllParentActive()
                // 给当前点击的元素 增加高亮
                this.classList.add('tag__parent--active')
            }

            const activeAndCallback = () => {
                activeCurrentClick()
                callback && callback(tagValue)
            }

            // 如果点击的是箭头，让箭头旋转，并且让子标签展开
            if (click整体内的箭头的箭头符号) {
                // 旋转箭头
                target.classList.toggle('tag__parent__arrow--active')
                // 子标签展开
                let childrenTag = this.nextElementSibling
                childrenTag.classList.toggle("tag__children--active")
                
                // 点击文字判断
                // 每一次点击都记录
                // 点击箭头判断
                // 如果当前点击的和历史记录的最后一个值相等，激活为当前点击箭头的
                // console.log(`log 调试数据: 箭头点击判断`, arrowCheck(tagValue));
                let 高亮 = arrowCheck(tagValue)
                console.log("🚀 ~ element.addEventListener ~ 高亮:", 高亮)
                if (高亮) {
                    activeAndCallback()
                }
                console.log('点击整体的箭头位置');
            }

            console.log('click tagValue', tagValue)
            // console.log('点击整体的文字位置')
            // addHistory(tagValue)

            // 左侧区域
            // 点击 1文字 2整体位置 3箭头中的井号 都高亮回调并且添加历史
            // 右侧
            if (click整体内的文字) {
                activeAndCallback()
                addHistory(tagValue)
                console.log('click整体内的文字')
            }
            if (click整体) {
                activeAndCallback()
                addHistory(tagValue)
                console.log('click整体')
            }
            if (click整体内的箭头的井号符号) {
                activeAndCallback()
                addHistory(tagValue)
                console.log('click整体内的箭头的井号符号')
            }

            console.log(`window.clickTagHistory: `, window.clickTagHistory)
        }, 向下捕获)
    })
}

module.exports = {
    treeToggle,
}
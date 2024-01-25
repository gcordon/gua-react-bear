
// 1 记录下拉切换 2 激活元素
class ToggleActiveHostory {
    
}
// 二维数组存储的格式是 [[targetValue, domElement,],]
// 点击箭头 “开启” 的历史 target
var openDomTargetHistorys = [
    ['["gua1"]', null,],
    ['["gua1","gua2"]', null,],
    ['["gua1","gua2","gua3"]', null,],
    ['["lin1"]', null,],
]
// 点击箭头 “关闭” 的历史DOM
var closeDomTargetHistorys = [
    // ['["gua1"]', null,],
    // ['["gua1","gua2"]', null,],
    // ['["gua1","gua2","gua3"]', null,],
]
// 当前激活的下拉DOM
// 数组长度只可能 =0 或 =1
var activeDomTargetHistoryValue = [
    [openDomTargetHistorys[0][0], null,],
]

var resetTargetList = () => {
    openDomTargetHistorys = []
    closeDomTargetHistorys = []
    activeDomTargetHistoryValue = []
}
var debugModel = 1
if (debugModel === 0) {
    resetTargetList()
}
/**
 * 
 * @param {*} changeTargetValue2Arr 保存的是 [[targetValue标识, dom元素(只是为了debug容易查看)目前情况下不需要用到,]]
 * @param {*} changeType           add 增加 |  remove 移除
 */
var changeDomHistoryList = (changeTargetValue2Arr, changeType,) => {
    return new Promise((resolve, reject) => {
        for (var arr of changeTargetValue2Arr) {
            var targetValue = arr[0]
            let el = document.querySelector(`.tag__parent[data-tag-value='${targetValue}']`)
            // let el = document.querySelector(`[data-tag-value='${targetValue}']`)
            if (!el) {
                console.error('展示元素 —— 查询不到元素 err', el, arr, changeTargetValue2Arr, )
                continue //跳过当前迭代的剩余代码，直接进入下一次迭代。
            }
            // console.log("🚀 ~ el:", el)
                el
                .nextElementSibling // // [子下拉dom ul] 相邻的下一个兄弟dom ul
                .classList[changeType]('tag__children--active')
        }
        resolve({})
    })
}
/**
 * 内容激活的时候
 * @param {*} targetValue 
 */
var changeDomTargetActive = (targetValue,) => {
    // 移除所有激活的
    let allEl = document.querySelectorAll('.tag__parent')
    for (const el of allEl) {
        el.classList.remove('tag__parent--active')
    }
    if (targetValue.length) {
        // 高亮选中的激活
        let el = document.querySelector(`[data-tag-value='${targetValue[0][0]}`)
        if (el === null) {
            return
        }
        el.classList.add('tag__parent--active')
    }
}
const changeTypes = {
    '添加类名': 'add',
    '移除类名': 'remove',
}
var execClassToggle = async () => {
    // 注意执行顺序   先执行 add 再执行 remove
    await changeDomHistoryList(openDomTargetHistorys, changeTypes.添加类名)
    // changeDomHistoryList(closeDomTargetHistorys, changeTypes.移除类名) 
    changeDomTargetActive(activeDomTargetHistoryValue)
    // TODO 这里可以移除     开启关闭和激活的历史，方便 debug
    // resetTargetList()
}
/**
 * 
 * @returns 返回一个闭包
 */
var saveToggleTargetHistory = () => {
    // 1 先获取DOM元素
    // 2 更新 tags 渲染最新的 dom
    // 3 抓取当前闭包的数据，重新存储
    // var closeElements = document.querySelectorAll('.tag__children:not(.tag__children--active)') //  默认未展开下拉的
    var toggleList =      document.querySelectorAll('.tag__children--active')   //    已经展开下拉的
    var activeCurrent =   document.querySelector('.tag__parent--active')     //    点击高亮的
    return {
        saveElement() {
            openDomTargetHistorys = []

            for (var el of toggleList) {
                var targetValue = el
                            .previousElementSibling // 上一个兄弟组件
                            .dataset.tagValue  // ！！严格查询，应该有这个标识才是我们希望的
                if (!targetValue) {
                    console.error('!出错，查询上一个兄弟dom失败');
                    return
                }
                var element = document.querySelector(`[data-tag-value='${targetValue}`)
                openDomTargetHistorys.push([targetValue, element, ])
            }
        },
        // 添加为当前点击高亮的 dom 与 标识
        saveActive() {
            activeDomTargetHistoryValue = []
            
            // 未选中任何需要激活的
            if (activeCurrent === null) {
                return
            }

            console.log("🚀 ~ saveActive ~ activeCurrent:", activeCurrent)
            var targetValue = activeCurrent
                                .dataset.tagValue  // ！！严格查询，应该有这个标识才是我们希望的
            var element = document.querySelector(`[data-tag-value='${targetValue}`)
            if (targetValue && element) {
                activeDomTargetHistoryValue = [
                    [targetValue, element,],
                ]
            }
        },
        logData() {
            console.log("🚀 ~ saveElement ~ openDomTargetHistorys:", openDomTargetHistorys)
            console.log("🚀 ~ saveElement ~ activeDomTargetHistoryValue:", activeDomTargetHistoryValue)
        }
    }
}



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
    execClassToggle()

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
                console.log(`高亮当前点击的元素`, this.dataset.tagValue, tagValue)
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
                console.log('点击整体的箭头位置', this.dataset.tagValue, tagValue)
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
    saveToggleTargetHistory,
}
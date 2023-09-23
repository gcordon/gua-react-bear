import React, { useEffect, useState, CSSProperties, ReactNode, useRef, } from 'react'
import toast, { Toaster } from 'react-hot-toast'

import WellToken from './WellToken'
import StringToken from './StringToken'

import './App.css'
import { createAndAppendDom } from './domUtils'

// onInput(event: 用在这里) 
type DOMEventType = {
    input: React.ChangeEvent<HTMLInputElement>,
}

// specialProp 是自定义的，extends 是继承 button dom 元素的属性，如果传递的是 button标签中间的元素，则是 props.children
// enum 枚举的意思
enum ButtonSize {
    default = 'default', 
    small = 'small',
    large2 = 'large2',
}
// interface 接口的意思
interface ButtonEmbellishProps { // 修饰
    size: ButtonSize,
}
interface ButtonProps extends React.ComponentPropsWithRef<'button'>, ButtonEmbellishProps   {
    specialProp?: string,
    mRef?: React.Ref<HTMLButtonElement> | null,
}
const ButtonDefaultProps = {
    size: ButtonSize.small,
}
// https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase
const ButtonWidget = (props: ButtonProps, ): JSX.Element => {
    const { specialProp, mRef, ...extendAttrbutes } = props
    // 样式
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const styles: CSSProperties | undefined = props.style
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const size = props.size
    
    return <button ref={mRef} {...extendAttrbutes}/>
}
ButtonWidget.defaultProps = ButtonDefaultProps


// 列表渲染
//  T 表示泛型
interface ListWidgetProps<T> {
    items: T[];
    renderItem: (item: T, index: number,) => ReactNode,
    // 这里的item类型为any，其实应该是items T，但是我不知道怎么写 - -。
    clickItem?: (item: any) => void,
}
// 这里的 T后面一定要带个逗号 , 不然会报错，😒无语 
// 使用例子： <ListWidgetModel items={['a', 'b', ]}>    T 推到会是 string 类型
const ListWidgetModel = <T,>(props: ListWidgetProps<T>): JSX.Element => {
    const ps:ListWidgetProps<T> = props
    const [state, setState] = useState<T[]>([])

    useEffect(() => {
        console.log('复制当前数据 state =', state)
        return () => {}
    }, [state,])

    return (
        <>
            <h1>列表</h1>
            <div>
                {ps.items.map(ps.renderItem)}
                <ButtonWidget onClick={() => {
                    ps.clickItem && ps.clickItem(ps.items)
                    setState(ps.items)
                }}>复制当前数据</ButtonWidget>
            </div>
        </>
    )
}


 // 获取 dom event value
 const getInputValue = (event: DOMEventType['input']) => {
    const target: HTMLInputElement = event.target
    const value = target.value
    return {target, value}
}


// 睡眠函数
enum sleepSatus {
    success =  'success',
    error =  'error',
}
type sleepReturn = Promise<object>
const sleepTool = (time: number, status: sleepSatus,): sleepReturn => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (status === sleepSatus.success) {
                resolve({})
            } else {
                reject({})
            }
        }, time)

    })
}

// 加载组件 https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks
const useLoading = () => {
    const [loadingStatus, setLoading] = useState(false)
    const loadingFetch = (fetchResult: Promise<any>) => {
        // 加载速度马上为loaidng状态
        setLoading(true)

        // 这里等待promise的返回，无论成功或失败，都让 loading 取消
        fetchResult.finally(() => {
            setLoading(false)
        })
    }

    // as const 的意思，是表示 ** as const， ** 的内容变成 const loadingStatus = ?? vey，
    // 对外之后，就无法改成这个值
    /**
        const arr = [1, 2] as const
        arr[0] = 3  // 会提示  无法为“0”赋值，因为它是只读属性。
     */
    return [loadingStatus, loadingFetch,] as const
}



const App = () => {
    // 类型校验
    interface IList {
        // id
        id: number,
        // 标题
        title: string
        // 内容
        content: string | null,
        // 是否已删除
        deleted: boolean,

        // 创建时间
        createTime?: string,
        // 更新时间
        updateTime?: string | null,
        // 标签 二维数组
        tags: string[][], 
        test: boolean,
    }
    // Pick == 选择，这里筛选了是否已删除的字段
    const DefaultIList: Pick<IList, 'deleted' | 'tags' | 'test'> = {
        deleted: false,
        tags: [],
        test: false,
    }
    // 默认值， 用于调试
    const defaultList: Array<IList> = [
        {
            ...DefaultIList,
            id: 1,
            title: '默认title-1',
            content: '默认content-1',
            tags: [
                ['lin_1','lin_11','lin_111',],
                ['lin___1','lin___11','lin___111',],
            ],
            deleted: true,
            test: true,
        },
        {
            ...DefaultIList,
            id: 2,
            title: '默认title-2',
            content: '默认content-2',
            tags: [
                ['lin_1','lin_11','lin_111','lin_1111',],
                ['lin___1','lin___11','lin___111','lin___1111',],
            ],
            test: true,
        },
        {
            ...DefaultIList,
            id: 3,
            title: '默认title-2',
            content: ' #gua1/gua2# #gua1# #gua2#  #gua2/gua3# #gua2/gua3/gua4# ',
        },
    ]
    // 默认编辑中的
    const defaultEditor = defaultList[0]
    const [list, setList] = useState<IList[]>(defaultList)
    const [title, setTitle] = useState<string>('呀哈哈')
    const [searchInput, setSearchInput] = useState<string>(defaultEditor.title)
    const [editor, setEditor] = useState<IList | null>(defaultEditor)
    // DOM 
    const searchButtonRef = useRef<HTMLButtonElement>(null)
    // 加载
    const [loadingStatus, loadingFetch, ] = useLoading()

    // 自动点击搜索按钮
    const testAutoClickSearch = () => {
        let b  = searchButtonRef.current
        if (b === null) {
            return
        }
        b.click()
    }
    
    // 编辑标题
    const onTitleInput = (event: DOMEventType['input']): void => {
        let { value } = getInputValue(event)
        setTitle(value)
    }
    // 搜索input
    const onSearchInput = (event: DOMEventType['input']): void => {
        let { value, target, } = getInputValue(event)
        setSearchInput(value)
        let 是否热查询 = target.dataset.hot
        if (是否热查询) {
            onSearchButton()
        }
    }

    // 转成为字符串json
    const toString = <T,>(value: T): string => {
        return JSON.stringify(value)
    }
    // 把字符串转换成真实数据
    // interface ie {
    //     length: number,
    // }
    // <T extend ie> 需要有 length 的属性方法
    const toParse = <T,>(value: string,): T => {
        try {
            return JSON.parse(value)
        } catch (error) {
            // 如果调用了  toParse('abc') 那么这个 T 就是 string 类型 ，反之 123 就是 number ；类型
            return value as T
        }
    }


    // 
    interface handleTypeValue {
        注释: string,
        type: string,
    }
    const handleType = new Map<string, handleTypeValue>()
    handleType.set('search', {注释: '搜索', type: 'search',})
    const handleSetList = (newList: IList[], handleTypes: handleTypeValue,) => {
        const 注释 = handleTypes.注释
        console.log(`🚀 ~ setList操作: 注释:${注释} \n旧值:${toString<object>(list)} \n新值:${toString<object>(newList)}`)
        setList(newList)
    }



    // 搜索button点击搜索内容
    const onSearchButton = async() => {
        clearEditor()     
        // 过滤
        let filteredList = defaultList.filter(v => {
            // string includes  方法是区别大小写的，解决方法就是，双边都变成小写
            let a = v.title.toLowerCase()
            let b = searchInput.toLocaleLowerCase()
            let c = a.includes(b)
            return c
        })
        let sl = sleepTool(500, sleepSatus.success)
        loadingFetch(sl)
        await sl
        // setList(filteredList)
        handleSetList(filteredList, handleType.get('search') as handleTypeValue,)
    }
    
    // 保存
    const onAdd = (event: React.MouseEvent<HTMLButtonElement>): void => {
        let value: IList = {
            ...DefaultIList,
            id: list.length + 1,
            title: `${title} + ${new Date().getTime()}`,
            content: null,
        }
        //
        setList([...list, value])
        toast('保存成功', {
            icon: '👏',
            iconTheme: {
                primary: '#000',
                secondary: '#fff',
            },
        })
    }

    // 
    interface IFindList  {
        findIndex: number,
        isfined: boolean,
    }
    // 判断id是否存在
    const findList = (id: number): IFindList => {
        let fd: IFindList = {
            findIndex: -9999,
            isfined: false,
        }

        let findIndex = list.findIndex(e => e.id === id)
        fd.findIndex = findIndex

        if (findIndex === -1) {
            toast.error(`${id} 不存在`)
        } else {
            fd.isfined = true
        }
        
        return fd
    }

    // 深拷贝列表
    const cloneList = (): IList[] => {
        let l = structuredClone(list)
        return l
    }

    // 清除正在编辑的东西
    const clearEditor = () => {
        setEditor(null)           
    }



    // 判断目前是否有正在编辑中的
    const hasEditoring = (): boolean => {
        return editor !== null
    }

    // 如果 当前删除 和 当前编辑中的 相同，编辑中的变为null
    const 如果正在操作的id和编辑中相同进行处理 = (changeId: number,) => {
        if (hasEditoring()) {
            let xt = changeId === editor!.id
            if (xt) {
                clearEditor()       
            }
        }
    }

    // 池底删除
    const onDelete = (id: number): void => {
        let {isfined, findIndex,} = findList(id)
        if (!isfined) {
            return
        }

        let l = cloneList()
        // splice 会 返回被删除的值
        let deleteValue = l.splice(findIndex, 1,)
        setList(l)

        如果正在操作的id和编辑中相同进行处理(deleteValue[0].id )
    }
    
    // 放到回收站
    const onToRecycleBin = (id: number): void => {
        let {isfined, findIndex,} = findList(id)
        if (!isfined) {
            return
        }

        let l = cloneList()
        // splice 会 返回被删除的值
        l[findIndex].deleted = !l[findIndex].deleted
        setList(l)

        如果正在操作的id和编辑中相同进行处理(l[findIndex].id)
    }

    // 修改单个标题
    const onSetTitle = (event: DOMEventType['input'],): void => {
        if (editor === null) {
            toast.error(`无编辑中的`)
            return
        }
        
        let newTitle = event.target.value

        let id = editor.id
        let {isfined, findIndex,} = findList(id)
        if (!isfined) {
            return
        }
        let l = cloneList()
        l[findIndex].title = newTitle
        // 保存 当前编辑中的
        setEditor(l[findIndex])
        // 重新调整list
        setList(l)
    }

    // 监听列表 增 删 改 查 的状态
    useEffect(() => {
        console.log('list变化了：', list)
        return () => {}
    }, [list,])


    // 树点击展开和缩放
    const toggleTree = () => {
        var toggler = document.getElementsByClassName("caret")
        var i
        for (i = 0; i < toggler.length; i++) {
            toggler[i].addEventListener("click", function (this: any, ...args: any[]) {
                console.log('this===',this)
                this.parentElement.querySelector(".nested").classList.toggle("active")
                this.classList.toggle("caret-down")
            })
        }
    }


    // 创建侧边栏 dom
    // 接受的参数格式是 {a: b: { c: {}, }, }
    const createTreeDom = (tree: object,) => {
        // 递归生成 dom 
        const loopCreateDomElement = (parentObject: object | any, parentName: string,): string => {
            let childrenObject = parentObject[parentName]
            let childrenKeys = Object.keys(childrenObject)

            // 如果没有子节点了，只返回  父节点 了，并且类名不是下拉的形式
            if (childrenKeys.length === 0) {
                return `
                    <li>
                        <span class="到底了">${parentName}</span>
                    </li>
                `
            }

            // 生成 子节点
            let childrenTemplate = ``
            for (const key of childrenKeys) {
                childrenTemplate += `
                    ${loopCreateDomElement(childrenObject, key)}
                `
            }
            let createChildrenDomElement = () => {
                let html = ``
                if (childrenTemplate.length) {
                    html = `
                        <ul class="nested">
                            ${childrenTemplate}
                        </ul>
                    `
                }
                return html
            }

            // 生成 父节点
            let createParentDomElement = () => {
                return `
                    <span class="caret">${parentName}</span>
                `
            }

            // 最终的节点
            let allHtml = `
                <li>
                    ${createParentDomElement() }
                    ${createChildrenDomElement() }
                </li>
            `

            // 生成的html dom如下
            /**
                <li>
                    <span class="caret">Beverages1</span>
                    <ul class="nested">
                        <li>Water</li>
                        <li>Coffee</li>
                        <li>
                            <span class="caret">Tea</span>
                            <ul class="nested">
                                继续当前的html
                            </ul>
                        </li>
                    </ul>
                </li>

                <li>
                    <span class="caret">只有一级</span>
                </li>
             */
            return allHtml
        }

        // 生成侧边栏
        let treeHtml = `<ul id="myUL">`
        for (const iterator of Object.keys(tree)) {
            treeHtml += loopCreateDomElement(tree, iterator)
        }
        treeHtml += '</ul>'
        return treeHtml
    }


    // 创建 对象的 key 如 a.b.c.d.e........
    const appendKey = (tree: object | any, keys: Array<string>) => {
        // tree 是对象 tree = { a: {}}
        // keys 数组存放的是对象 key 如  a.b.c.e 
        const key = keys.shift() // 移除数组的首个值，并且返回这个值
        if (key === undefined) {
            // console.log(`appendKey 到底了`)
            return
        }

        // tree 是对象  keys是数组，存放的是 tree 下的key.key.key的值
        // 1. 获取 keys 的首值，并且移除掉，拿到的值 复制给 变量为 key 的值中
        // 2. 根据拿到的 key 去 tree对象中判断，是否存在
        //    如果  存在，拿到这个值 loopTree = tree[key] 当前下一个递归的tree值 appendKey(loopTree, keys)
        //    如果不存在，tree[key] = {} 生成一个新的对象 ，之后根据上面的存在的情况继续写

        let loopTree = tree[key]
        // 1.不存在
        if (loopTree === undefined) {
            tree[key] = {}
            loopTree = tree[key]
        }
        // 2.存在
        appendKey(loopTree, keys)
    }

    // 字符串tag转换成数组tag
    const stringTagToArrayTag = (stringTag: string, ): string[] | never => {
        // 固定格式为： '#test1/test2#'
        let s1 = stringTag
        let startIs井号 = s1.startsWith('#')
        let endIs井号 = s1.endsWith('#')
        let s2 = s1.slice(1, -1).split('/') // 剔除 前后的 #号 , 再以 斜杆 分割
        if (!startIs井号) {
            throw new Error('stringTagToArrayTag errror 1')
        }
        if (!endIs井号) {
            throw new Error('stringTagToArrayTag errror 2')
        }
        console.log("🚀 ~ setTimeout ~ s1:", s2, startIs井号, endIs井号)
        // 将数组中的值，都变为字符串
        s2.map(element => element = element.toString())
        return s2
    }


    const tag字符串切割 = (tokens: string,): string[] => {
        // #test1/test2# jifjdisf
        // #test1# 123
        // #test1#123
        // #lin1/lin2# 999 #lin1/lin2/lin3#
        // 需要记录一个 index 值
        // 需要一个可以查看当前index值的上一个值是什么，与下一个值是什么的函数
        // 第一个#号 后面至少一定要有字符   第二个井号 前面至少一定要有字符
        let token = StringToken.new(tokens)
        let well = WellToken.new()
        while(token.hasLoopToken()) {
            let v = token.getToken()
            // 如果 值是 井号 塞入 井号下标数组
            // 如果 井号下标数组长度存在
                // 如果是单数，说明正在开始
                // 如果是双数，说明已经结束了
                // 切割 单独的下标到双数的下标 (并且内容区间不能有空格)

            /**
            没空格#test1#没空格
            没空格#test1#空格

            没空格#test1#空格#test2#没空格
            没空格#test1#空格#test2#空格
             */

            // 第一种
            // wellIndex 长度 === 0
            // 是#号，并且下一个字符不是空格，为第一个 标签 wellIndexs
            // wellIndex 长度 大于 1
            // 是#号，并且上一个字符不是空格，为第二个 标签 wellIndexs
            // 切割 wellIndex[0] 到 wellIndex[1] 之间的内容, push 到 wellTags 中 
            if (well.isWellFh(v)) {
                if (well.is双数Well()) {
                    // ’ #a‘ 当前查询到#号，前一个字符必须空格，第二字符是#号，第三个字符不能是空格
                    let current = well.isWellFh(v)
                    let next = token.peekNextToken()
                    let nextIsEmpty = well.isEmpty(next)
                    let pre = token.peekPreToken()
                    let preIsEmpty = well.isEmpty(pre)
                    
                    if (preIsEmpty && current && !nextIsEmpty) {
                        console.log('成功1')
                        let index = token.stepIndex(-1)
                        well.wellIndexs.push(index)
                    }
                } else if (well.is单数Well()) {
                    // // ’a# ‘ 当前查询到#号，前一个字符必须不空格，第二字符是#号，第三个字符必须是空格
                    let current = well.isWellFh(v)
                    let next = token.peekNextToken()
                    let nextIsEmpty = well.isEmpty(next)
                    let pre = token.peekPreToken()
                    let preIsEmpty = well.isEmpty(pre)
                    
                    if (!preIsEmpty && current && nextIsEmpty) {
                        console.log('成功2')
                        let index = token.peekIndex()
                        well.wellIndexs.push(index)

                        console.log("🚀 ~ App ~ well.wellIndexs:", well.wellIndexs)
                        let w = well.wellIndexs
                        let s = token.sliceToken(w.at(-2) as number, w.at(-1) as number,)
                        well.addWellTags(s)
                    }
                }
            }
        }
        return well.getWellTags()
    }

    // 接收的数组如  '#3d/4g#'  返回的应该是 ['3d', '4g',]
    const 去除前后井号并以斜杠切割转为数组 = (values: string): string[] => {
        // 移除前后的 # 号
        let tag = values.slice(1, -1)
        let arrayTag = tag.split('/')
        return arrayTag
    }

    const 根据内容生成标签二维数组 = (content: string | null): Array<Array<string>> => {
        console.log("🚀 ~ App ~ content:", content)
        if (content === null) {
            return [[]]
        }
        
        let q1 = tag字符串切割(content)
        let tagArrr = []
        for (const value of q1) {
            let s = 去除前后井号并以斜杠切割转为数组(value)
            tagArrr.push(s)
        }
        let cloneTagArr = structuredClone(tagArrr)
        return cloneTagArr
    }

    // 接受的值是一个二维数组
    const 传入二维数组生成树对象 = (tagArrr: Array<Array<string>>) => {
        let cloneTagArr = structuredClone(tagArrr)
        let tagTree = {}
        for (const value of cloneTagArr) {
            appendKey(tagTree, value,)
        }
        console.log("🚀 ~ setTimeout ~ tagTree:", tagTree)
        let html = createTreeDom(tagTree)
        createAndAppendDom('id-标签树', html)
    }

    
    // 渲染列表的tags标签
    const renderListTags = () => {
        const filter = defaultList.filter(v => !v.test)
        filter.map(e => {
            e.tags = 根据内容生成标签二维数组(e.content)
            return e
        })
        console.log("🚀 ~ renderListTags ~ filter:", filter)
        for (const o of filter) {
            传入二维数组生成树对象(o.tags)
        }

        // 测试数据
        // const allTags = defaultList.filter(v => v.test).map(e => e.tags)
        // const tree = {}
        // for (const t of allTags) {
        //     for (const e of t) {
        //         appendKey(tree, e)
        //     }
        // }
        // createTreeDom(tree)
    }
    
    setTimeout(() => {
        // __testModel()
        renderListTags()
        toggleTree()
    }, 0);


    useEffect(()=>{
        // 测试，自动点击搜索按钮
        // testAutoClickSearch()
    }, [])

    const listTypeFilter = (title: string, filedList: Array<IList>, ): JSX.Element => {
        return (
            <>
                <h1>{title}</h1>

                <h2>{loadingStatus && '加载中.....'}</h2>
                
                {!loadingStatus && filedList.map((item) => {
                    let id = item.id
                    let hasEditor = editor?.id === id
                    return (
                        <div key={id}>
                            <div>
                                标题: {item.title}
                                <ButtonWidget onClick={() => { setEditor(item,) }}>编辑</ButtonWidget>
                                <ButtonWidget onClick={() => { onDelete(id,) }}>池底删除</ButtonWidget>
                                <ButtonWidget onClick={() => { onToRecycleBin(id,) }}>放到回收站</ButtonWidget>
                                {hasEditor && '当时是编辑中的~'}
                            </div>
                        </div>
                    )
                })}
            </>
        )
    }


    return (
        <div className='app'>
            <ButtonWidget onClick={() => { window.location.reload() }}>刷新页面</ButtonWidget>

            {/* 添加 */}
            <h1>添加</h1>
            <div className='aritdardar'>
                <label>标题</label>
                <input onInput={onTitleInput} autoFocus value={title} />
            </div>
            <button onClick={onAdd}>添加</button>

            {/*  搜索    */}
            <h1>搜索</h1>
            <div>
                <input onInput={onSearchInput} data-hot="1" value={searchInput}/>
                <ButtonWidget size={ButtonSize.default} mRef={searchButtonRef} onClick={onSearchButton} >
                    🔍
                </ButtonWidget>
            </div>

            {/* 列表 */}
            {/* <h1>列表</h1>
            <h2>{loadingStatus && '加载中.....'}</h2>
            {!loadingStatus && list.filter(e => e.deleted === false).map((item) => {
                let id = item.id
                let hasEditor = editor?.id === id
                return (
                    <div key={id}>
                        <div>
                            标题: {item.title}
                            <ButtonWidget onClick={() => { setEditor(item,) }}>编辑</ButtonWidget>
                            <ButtonWidget onClick={() => { onDelete(id,) }}>池底删除</ButtonWidget>
                            <ButtonWidget onClick={() => { onToRecycleBin(id,) }}>放到回收站</ButtonWidget>
                            {hasEditor && '当时是编辑中的~'}
                        </div>
                    </div>
                )
            })} */}

            {listTypeFilter('回收站', list.filter(e => e.deleted === true), )}
            {listTypeFilter('所有笔记', list.filter(e => e.deleted === false), )}

            {/* 编辑中的 */}
            <h1>编辑中的</h1>
            {
                hasEditoring() && (
                    <>
                        <input 
                            // ! 是操作符。它告诉编译器属性已设置（不是 null 或 undefined ），即使TypeScript的分析无法检测到。
                            value={editor!.title} // 这里的 ! 符号表示 肯定不会是 null 因为有函数提前判断了，但是ts不知道， 所以我们只能用特殊语法让ts知道
                            onChange={(event: DOMEventType['input']) => {
                                onSetTitle(event,)
                            }}  
                        />
                    </>
                )
            }

            {/* silidar 侧边栏 */}



            {/* <ListWidgetModel 
                items={list}
                renderItem={(item, index,) => (
                    <div key={index}>
                        🐷：<span>{item.title}</span>🐯：
                        <span>{item.content}</span>
                    </div>
                )}
            /> */}
            <Toaster />
        </div>
    )
}
export default App

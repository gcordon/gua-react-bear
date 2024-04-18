import React, { 
    useEffect, // https://zh-hans.react.dev/reference/react/useEffect
    useState,
    CSSProperties,
    ReactNode,
    useRef, 
    createElement, 
    useId,
} from 'react'
import toast, { Toaster } from 'react-hot-toast'


import { ThemeContext } from './theme-context'

import WellToken from './WellToken'
import StringToken from './StringToken'

import './App.css'
import './treeHtml/tree.css'
import { createAndAppendDom } from './domUtils'
import { treeToggle, } from './treeHtml/tree'
import { ClassnamsToggleHistory, } from './treeHtml/historyTree.js'

import { useLoadingHook, } from './hooks/mainHooks'
import { hocLoading } from './hoc/hocLoading'
import { createPortal } from 'react-dom'

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
    __des: '注释',
}
// https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase
// 这里加了 typeof 是让更好代码有更好的智能提示
const ButtonWidget = (props: ButtonProps & typeof ButtonDefaultProps): JSX.Element => {
    const { specialProp, mRef, ...extendAttrbutes } = props
    // 样式
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const styles: CSSProperties | undefined = props.style
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const size = props.size
    
    return <button  ref={mRef} {...extendAttrbutes}/>
}
ButtonWidget.defaultProps = ButtonDefaultProps

https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/default_props
type PermissionsButtonWidgetProps<T> = T extends
    | React.ComponentType<infer P>
    | React.Component<infer P>
    ? React.JSX.LibraryManagedAttributes<T, P>
    : never;
const PermissionsButtonWidget = (props: PermissionsButtonWidgetProps<typeof ButtonWidget>) => {
    // typeof 继承，并且让有提示
    console.log('调试===', props.size)
    return <button style={{ color: 'blue',}}>
        按钮{props.size}
    </button>
}


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



interface TimeProps { // 修饰
    renderContent: any,
}
const GetCurrentTime = (props: TimeProps, ): JSX.Element => {
    return (
        <div>
            {props.renderContent('2024-2-1!!快过年了')}
        </div>
    )
}
const CurstomTimeStyle = (time: number) => {
    return <span style={{color: 'red'}}>{time}</span>
}
const ShowCurrentTime = () => {
    return <>
        <GetCurrentTime 
            renderContent={(time: number) => {
                return CurstomTimeStyle(time)
            }}
        />
        <GetCurrentTime 
            renderContent={(time: number) => {
                return <span style={{color: 'blue'}}>{time}...</span>
            }}
        />
    </>
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
    const DefaultIList: Pick<IList, 'deleted' | 'tags' | 'test'> = { // https://typescript.xiniushu.com/zh/reference/utility-types.html
        deleted: false,
        tags: [],
        test: false, // 如果是true的，表示是测试，是用于标签html的东西
    }
    // 默认值， 用于调试
    const defaultList: Array<IList> = [
        {
            ...DefaultIList,
            id: 1,
            title: '默认title-1',
            content: '默认content-1',
            // 生成的内容标签
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
            // 生成的内容标签
            tags: [
                ['lin_1','lin_11','lin_111','lin_1111',],
                ['lin___1','lin___11','lin___111','lin___1111',],
            ],
            test: true,
        },
        {
            ...DefaultIList,
            id: 3,
            title: '默认title-3',
            // content: ' #gua1/gua2# #gua1# #gua2#  #gua2/gua3# #gua2/gua3/gua4# ',
            // content: ' #gua1/gua2/gua3# ',
            content: ' #gua1/gua2/gua3/gua4# ',
        },
        {
            ...DefaultIList,
            id: 4,
            title: '默认title-4',
            content: ' #lin1/lin2/lin3/lin4# ',
        },
        {
            ...DefaultIList,
            id: 5,
            title: '默认title-5',
            content: ' #tt1# ',
        },
    ]
    // 默认编辑中的
    const defaultEditor = defaultList[2]
    const [list, setList] = useState<IList[]>(defaultList)
    const [title, setTitle] = useState<string>('呀哈哈')
    const [searchInput, setSearchInput] = useState<string>(defaultEditor.title)
    const [editor, setEditor] = useState<IList | null>(defaultEditor)
    // DOM 
    const searchButtonRef = useRef<HTMLButtonElement>(null)
    // 加载
    const [loadingStatus, loadingFetch, ] = useLoadingHook()

    /**
     * 自动化操作
     */
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

    // 转成为字符串对象
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
    const onSetTitle = (event: DOMEventType['input'], changeKey: 'title' | 'content',): void => {
        if (editor === null) {
            toast.error(`无编辑中的`)
            return
        }
        
        let newValue = event.target.value

        let id = editor.id
        let {isfined, findIndex,} = findList(id)
        if (!isfined) {
            return
        }
        let l = cloneList()
        l[findIndex][changeKey] = newValue
        // 保存 当前编辑中的
        setEditor(l[findIndex])
        // 重新调整list
        setList(l)
    }

    const createListTagsAndReloadClick = async () => {
        // 保存toggle历史记录
        console.log('list变化了：', list)
        let sl = ClassnamsToggleHistory.new()
        await sl.searchActiveDom()
        renderListTags() // TODO 这里感觉也可以用 await 语法一下
        await sl.saveDomHisotrys()
        await sl.logData()
        treeToggle((value: string,) => {
            console.log('点击的标签是', value);
        })
    }

    // 监听列表 增 删 改 查 的状态
    useEffect(() => {
        // 测试，自动点击搜索按钮
        // testAutoClickSearch()
        // __testModel()
        createListTagsAndReloadClick()
        return () => {}
    }, [list,])

    // 创建侧边栏 dom
    // 接受的参数格式是 {a: b: { c: {}, }, }
    const createTreeDom = (tree: object,) => {
        // 递归生成 dom 
        const loopCreateDomElement = (parentObject: object | any, parentName: string, index: number, historicalNames: Array<string>, ): string => {
            historicalNames.push(parentName)
            // 生成最终 节点
            const createAllDomElemn = (html: string) => {
                // 最终的节点
                let allHtml = `
                    <li>
                        ${html}
                    </li>
                ` 
                return allHtml
            }
            // 生成 父节点
            interface icp {
                notChildren: boolean,
            }
            const createParentDomElement = (o: icp,) => {
                // 距离左边的间距
                const style = `--left-size: ${index * 100}px;`
                const isHidden = o.notChildren ? 'hidden' : ''
                return `
                    <div class="tag__parent " style="${style}" data-tag-value=${JSON.stringify(historicalNames)}>
                        <div class="tag__parent__embellish">
                            <span ${isHidden} class="tag__parent__arrow" data-tag-type="tagArrow"></span>
                            <span class="tag__parent__code" data-tag-type="tagCode">#</span>
                        </div>
                        <span class="tag__parent__name" data-tag-type="tagName">${parentName}</span>
                    </div>
                `
            }

            let childrenObject = parentObject[parentName]
            let childrenKeys = Object.keys(childrenObject)

            // 如果没有子节点了，只返回  父节点 了，并且类名不是下拉的形式
            if (childrenKeys.length === 0) {
                return createAllDomElemn(`
                    ${createParentDomElement({notChildren:true,})}
                `)
            }

            // 生成 子节点
            let createChildrenDomElement = () => {
                index++
                let childrenTemplate = ``
                for (const key of childrenKeys) {
                    childrenTemplate += `
                        ${loopCreateDomElement(childrenObject, key, index, historicalNames,)}
                    `
                }
                // 
                let html = `
                    <ul class="tag__children tag__children--default">
                        ${childrenTemplate}
                    </ul>
                `
                return html
            }

            let allHtml = createAllDomElemn(`
                ${createParentDomElement({notChildren:false,})}
                ${createChildrenDomElement()}
            `)

            // 生成的html dom -》 参考 tree/tree.html 文件
            return allHtml
        }
        // 生成侧边栏
        let rooHtml = ``
        let rootChildrenHtml = ``
        for (const iterator of Object.keys(tree)) {
            rootChildrenHtml += loopCreateDomElement(tree, iterator, 0, [])
        }
        rooHtml = `
            <ul id="id-tree">
                ${rootChildrenHtml}
            </ul>
        `
        return rooHtml
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
            let value = token.getToken()
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
            if (well.isWellFh(value)) {
                if (well.is双数Well()) {
                    // ’ #a‘ 当前查询到#号，前一个字符必须空格，第二字符是#号，第三个字符不能是空格
                    let current = well.isWellFh(value)
                    let next = token.peekNextToken()
                    let nextIsEmpty = well.isEmpty(next)
                    let pre = token.peekPreToken()
                    let preIsEmpty = well.isEmpty(pre)
                    
                    if (preIsEmpty && current && !nextIsEmpty) {
                        console.log('双数检测到(0开始) # 号 成功1')
                        let index = token.stepIndex(-1)
                        well.wellIndexs.push(index) // TODO 这里不应该暴露出来，应该让类暴露一个函数进行操作
                    }
                } else if (well.is单数Well()) {
                    // // ’a# ‘ 当前查询到#号，前一个字符必须不空格，第二字符是#号，第三个字符必须是空格
                    let current = well.isWellFh(value)
                    let next = token.peekNextToken()
                    let nextIsEmpty = well.isEmpty(next)
                    let pre = token.peekPreToken()
                    let preIsEmpty = well.isEmpty(pre)
                    
                    if (!preIsEmpty && current && nextIsEmpty) {
                        console.log('单数检测到(1开始) # 号 成功2')
                        let index = token.peekIndex()
                        well.wellIndexs.push(index) // TODO 这里不应该暴露出来，应该让类暴露一个函数进行操作

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
        // console.log("🚀 ~ App ~ html:", html)
        createAndAppendDom('id-标签树', html)
    }

    
    // 渲染列表的tags标签
    const renderListTags = () => {
        // let arr = cloneList()
        let arr = list
        const filter = arr.filter(v => !v.test) // 返回新数组、浅拷贝、后续的修改不会修改到拷贝前的元素
        filter.map(e => {
            e.tags = 根据内容生成标签二维数组(e.content)
            return e
        })
        console.log("🚀 ~ renderListTags ~ filter:", filter)
        let allTags = []
        for (const o of filter) {
            allTags.push(...o.tags)
        }
        传入二维数组生成树对象(allTags)
        console.log("🚀 ~ renderListTags ~ allTags:", allTags)

        // 测试数据
        // const allTags = arr.filter(v => v.test).map(e => e.tags)
        // const tree = {}
        // for (const t of allTags) {
        //     for (const e of t) {
        //         appendKey(tree, e)
        //     }
        // }
        // createTreeDom(tree)
    }
    

    // useEffect(()=>{
    //     // 测试，自动点击搜索按钮
    //     // testAutoClickSearch()
    //     // __testModel()
    //     createListTagsAndReloadClick()
    // }, [])
    interface asj {
        title: string, 
        filedList: Array<IList>, 
    }
    const listTypeFilter = (filterProps: asj): JSX.Element => {
        return (
            <>
                {/* <h2>
                    {
                        loadingStatus 
                        && <div className="loader"></div>
                    }
                </h2> */}
                <h1>{filterProps.title}</h1>
                
                {!loadingStatus && filterProps.filedList.map((item) => {
                    let id = item.id
                    let hasEditor = editor?.id === id
                    return (
                        <div key={id}>
                            <div style={{ border: '1px solid black' }} onClick={() => { setEditor(item,) }}>
                                <ButtonWidget onClick={() => { setEditor(item,) }}>编辑</ButtonWidget>
                                <ButtonWidget onClick={() => { onDelete(id,) }}>池底删除</ButtonWidget>
                                <ButtonWidget onClick={() => { onToRecycleBin(id,) }}>放到回收站</ButtonWidget>
                                😄标题: {item.title} 😄
                                内容: {item.content}
                                {hasEditor && <span style={{ color: 'red' }}>'当时是编辑中的~'</span>}
                                <PermissionsButtonWidget
                                    size={ButtonSize.large2}
                                ></PermissionsButtonWidget>
                            </div>
                        </div>
                    )
                })}
            </>
        )
    }

    const useHocLoading = hocLoading(listTypeFilter, () => {
        return <span>所有笔记</span>
    },)


    const updateTipText = (text: string,) => {
        // https://react.dev/reference/react/createElement
        return createElement( // 生成一个 jsx
            'p', // type
            {className: 'update__tip__text'}, // props
            text, // children 1
            createElement('span', null, '!!'), // children 2
            '..!', // children 3 
        )
    }

    console.log('调试===useId', useId())

    const { theme, toggle, dark } = React.useContext(ThemeContext)
    
    return (
        <div className='app'>
            {
                // https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/portals
                // https://refine.dev/blog/react-createportal/#use-cases-of-the-createportal-api
                // 嵌套到dom外，主要用于dialog相关的使用
                createPortal(
                    <div style={{display: 'none'}}>dialog modle</div>,
                    document.body,
                )
            }
             <div style={{ backgroundColor: theme.backgroundColor, color: theme.color, }} onClick={toggle}>
                当前主题： dart ? {dark ? '是' : '否'} 点我切换主题
            </div>
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
            <ShowCurrentTime></ShowCurrentTime>
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

            {/* {listTypeFilter({title: '回收站', filedList: list.filter(e => e.deleted === true), })} */}
            {/* {listTypeFilter({title: '所有笔记', filedList: list.filter(e => e.deleted === false), })} */}

            {/* 高阶函数使用 */}
            {/* 写法1 创建变量并且使用hoc函数后使用 */}
            {   
                useHocLoading
                (
                    loadingStatus, 
                    {
                        title: '所有笔记',
                        filedList: list.filter(e => e.deleted === false),
                    }, 
                )
            }
            {/* 写法2 直接使用hoc函数使用 */}
            {   
                hocLoading(listTypeFilter, () => {
                    return <span>回收站</span>
                },)
                (
                    loadingStatus, 
                    {
                        title: '回收站',
                        filedList: list.filter(e => e.deleted === true),
                    }, 
                )
            }

            

            {/* 编辑中的 */}
            <h1>{ updateTipText(`编辑中的`) }</h1>
            {
                hasEditoring() && (
                    <>
                    <div 
                        placeholder=" "
                        className="notranslate" 
                        spellCheck="true" // 启用了拼写检查
                        contentEditable="true" // 可以被用户直接编辑，就像一个文本框一样。
                        style={{
                            border: "2px solid black",
                            padding: "10px 20px",
                        }}
                    >
                        123
                    </div>
                        <input
                            style={{'width': '300px',}}
                            value={editor!.content || ''}
                            onChange={(event: DOMEventType['input']) => {
                                onSetTitle(event, 'content')
                            }}  
                        />
                        <input 
                            // ! 是操作符。它告诉编译器属性已设置（不是 null 或 undefined ），即使TypeScript的分析无法检测到。
                            value={editor!.title} // 这里的 ! 符号表示 肯定不会是 null 因为有函数提前判断了，但是ts不知道， 所以我们只能用特殊语法让ts知道
                            onChange={(event: DOMEventType['input']) => {
                                onSetTitle(event, 'title')
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

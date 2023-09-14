import React, { useEffect, useState, CSSProperties, ReactNode, useRef, } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import './App.css'

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
        id: number,
        title: string
        content: string | null
    }
    // 默认值， 用于调试
    const defaultList: Array<IList> = [
        {
            id: 1,
            title: '默认title-1',
            content: '默认content-1',
        },
        {
            id: 2,
            title: '默认title-2',
            content: '默认content-2',
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

    // 判断目前是否有正在编辑中的
    const hasEditoring = (): boolean => {
        return editor !== null
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

    // 删除
    const onDelete = (id: number): void => {
        let {isfined, findIndex,} = findList(id)
        if (!isfined) {
            return
        }

        let l = cloneList()
        // splice 会 返回被删除的值
        let deleteValue = l.splice(findIndex, 1,)
        setList(l)

        // 如果 当前删除 和 当前编辑中的 相同，编辑中的变为null
        if (hasEditoring()) {
            let xt = deleteValue[0].id === editor!.id
            if (xt) {
                clearEditor()       
            }
        }
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
        // console.log('list变化了：', list)
        return () => {}
    }, [list,])

    // 创建侧边栏 dom
    const createTreeDom = (tree: Object,) => {
        // 递归生成 dom 
        const loopCreateDomElement = (parentObject: Object | any, parentName: string,): string => {
            let childrenObject = parentObject[parentName]
            let childrenKeys = Object.keys(childrenObject)

            // 如果没有子节点了，只返回  父节点 了，并且类名不是下拉的形式
            if (childrenKeys.length === 0) {
                return `
                    <span class="到底了">${parentName}</span>
                `
            }

            // 生成 子节点
            let childrenTemplate = ``
            for (const key of childrenKeys) {
                childrenTemplate += `
                    <li>
                        ${loopCreateDomElement(childrenObject, key)}
                    </li>
                `
            }
            let createChildrenElement = () => {
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
            let createParentTemplate = () => {
                return `
                    <span class="caret">${parentName}</span>
                `
            }

            // 最终的节点
            let allHtml = `
                <li>
                    ${createParentTemplate() }
                    ${createChildrenElement() }
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
        document.querySelector('.app')?.insertAdjacentHTML('beforebegin', treeHtml)
    }



    const appendKey = (tree: Object | any, keys: Array<string>) => {
        // tree 是对象 tree = { a: {}}
        // keys 数组存放的是对象 key 如  a.b.c.e 
        const key = keys.shift() // 移除数组的首个值，并且返回这个值
        if (key === undefined) {
            console.log('到底了');
            return
        }

        // tree 是对象  keys是数组，存放的是 tree 下的key.key.key的值
        // 1. 获取 keys 的首值，并且移除掉，拿到的值 复制给 变量为 key 的值中
        // 2. 根据拿到的 key 去 tree对象中判断，是否存在
        //    如果  存在，拿到这个值 loopTree = tree[key] 当前下一个递归的tree值 appendKey(loopTree, keys)
        //    如果不存在，tree[key] = {} 生成一个新的对象 ，之后根据上面的存在的情况继续写

        let loopTree = tree[key]
        // 2.不存在
        if (loopTree === undefined) {
            tree[key] = {}
            loopTree = tree[key]
        }
        // 2.存在
        appendKey(loopTree, keys)
    }

    setTimeout(() => {
        // 侧边栏树结构
        var tree = {
            test1: {
                test2: {
                    test3: {
                        test4: {

                        },
                    },
                    test33: {

                    },
                },
            },
            test11: {
                test22: {
                    // test33: {

                    // },
                }
            },
            test3: {

            }
        }

        let tree2 = {
            test2: {},
            test22: {},
        }
        appendKey(tree2, ['test2','test3','test4',],)
        appendKey(tree2, ['test22','test33','test44',],)
        createTreeDom(tree2)

        // 树点击展开和缩放
        var toggler = document.getElementsByClassName("caret");
        var i;
        for (i = 0; i < toggler.length; i++) {
            toggler[i].addEventListener("click", function (this: any, ...args: any[]) {
                console.log('this===',this);
                this.parentElement.querySelector(".nested").classList.toggle("active");
                this.classList.toggle("caret-down");
            });
        }
    }, 0)

    // const createTree = () => {
    //     let o = {
    //         test1: {}
    //     }
    //     appendKey(o, ['test1','test3','test3',],)
    //     appendKey(o, ['test1','test3','test3',],)
    //     console.log('o====', toString(o))
    // }
    // createTree()


    useEffect(()=>{
        // testAutoClickSearch()
    }, [])


    return (
        <div className='app'>
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
            <h1>列表</h1>
            <h2>{loadingStatus && '加载中.....'}</h2>
            {!loadingStatus && list.map((item) => {
                let id = item.id
                let hasEditor = editor?.id === id
                return (
                    <div key={id}>
                        <div>
                            标题: {item.title}
                            <ButtonWidget onClick={() => { setEditor(item,) }}>编辑</ButtonWidget>
                            <ButtonWidget onClick={() => { onDelete(id,) }}>删除</ButtonWidget>
                            {hasEditor && '当时是编辑中的~'}
                        </div>
                    </div>
                )
            })}

            {/* 编辑中的 */}
            <h1>编辑中的</h1>
            {
                editor !== null && (
                    <>
                        <input 
                            value={editor.title}
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

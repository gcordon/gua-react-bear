import { useState } from "react"

// 加载组件 https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks
const useLoadingHook = () => {
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

export {
    useLoadingHook,
}
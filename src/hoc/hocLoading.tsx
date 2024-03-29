// HOC高阶组件 （High Order Component）
// 官方解释: 
//      接受 React 组件作为输入，输出一个新的 React 组件，
//      不是组件，是增强函数
//      主要作用是代码复用，操作状态和参数
//      通过被包裹的 React 组件来操作 props
// 个人理解: 就是返回一个闭包函数
// 参考文档 
// https://juejin.cn/post/7220677873584734268#heading-1
// https://tsejx.github.io/react-guidebook/foundation/advanced-guides/high-order-component/


// 当前HOC做的事情
// 创建一个函数，接收一个参数 1react组件--最后展示的组件
// 返回一个函数，接收二个参数 1正在加载中 2ajax数据
//     函数内的判断
//      如果是正在加载中，展示 加载中的文字提示
//      否则展示 1react组件 且把 2ajax数据传递回去
// export const hocLoading = (RenderContent: React.ComponentType<any>) => {
//     const withLoadingContent = (isLoading: boolean, title: any, filedList: any,) => {
//         if (isLoading === true) {
//             return <h1>~~ hoc loading ~~</h1>
//         } else {
//             return <RenderContent title={title} filedList={filedList} />
//         }
//     }LoadingContent()
//     return withLoadingContent
// }

export const hocLoading = (RenderContent: React.ComponentType<any>, LoadingContent: React.ComponentType<any>) => {
    const withLoadingContent = (isLoading: boolean, props: any) => {
        if (isLoading === true) {
            return <h1>~~ <LoadingContent /> hoc loading ~~</h1>
        } else {
            return <RenderContent {...props} />
        }
    }
    return withLoadingContent
}
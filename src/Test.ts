
// // 测试 dom 树生成
// const __tetCreateTreeDom = () => {
//     console.log(
//         "%c--------- __tetCreateTreeDom log start --------",
//         "color:red;background-color: yellow"
//     )
//     let o = {
//         a: {
//             b: {
//                 c: {
//                     d: {},
//                 },
//                 cc: {},
//             },
//         },
//         a2: {},
//         a3: {
//             b3: {},
//         },
//     }

//     let stringJSON = JSON.stringify(o, null, 4)
//     console.log("test 入参 json ==\n", stringJSON)
//     let html = createTreeDom(o)
//     let div = document.createElement("div")
//     div.innerHTML = html
//     // 让输出dom树格式，方便查看
//     console.dirxml("test 出参 html ==\n", div)
//     // html 格式化网站 https://www.freeformatter.com/html-formatter.html#before-output

//     console.log(
//         "%c--------- __tetCreateTreeDom log end --------",
//         "color:red;background-color: yellow"
//     )
// }
// // 测试 object 生成
// const __testAppendKey = () => {
//     console.log(
//         "%c--------- __testAppendKey log start --------",
//         "color:red;background-color: black"
//     )
//     let o = {
//         __a__1: {},
//     }
//     console.log("test 出参 json ==\n", JSON.stringify(o, null, 4))
//     let keys = [
//         "__a__1",
//         "__a__2",
//         "__a__3",
//         // '__b__1','__b__2','__b__3',
//     ]
//     let o2 = structuredClone(o)
//     appendKey(o2, keys)
//     console.log("test 出参 json ==\n", JSON.stringify(o2, null, 4))

//     console.log(
//         "%c--------- __testAppendKey log end --------",
//         "color:red;background-color: black"
//     )
// }
// // 测试 tag 生成
// const __test根据内容生成标签二维数组 = () => {
//     console.log(
//         "%c--------- __test根据内容生成标签二维数组 log start --------",
//         "color:red;background-color: orange"
//     )

//     let str = ` #t1/t2# #t1# #t1/t2/t3# #t4# `
//     let arr = 根据内容生成标签二维数组(str)
//     console.log("test 出参 str ==\n", JSON.stringify(str, null, 4))
//     console.log("test 出参 json ==\n", JSON.stringify(arr, null, 4))

//     console.log(
//         "%c--------- __test根据内容生成标签二维数组 log end --------",
//         "color:red;background-color: orange"
//     )
// }
// const __test内容生成标签二维数组与二维数组生成对象与对象生成标签插入html中 =
//     () => {
//         // 内容生成标签二维数组
//         let str = " #a1/a2#  #a1/a2/a39# #11# #32/3233# "
//         let 二维数组 = 根据内容生成标签二维数组(str)
//         // 二维数组生成对象
//         let o = {}
//         let o2 = structuredClone(o)
//         for (const arr of 二维数组) {
//             appendKey(o2, arr)
//         }
//         // 对象生成标签插入html中
//         let html = createTreeDom(o2)
//         createAndAppendDom("id-林", html)
//     }
// // 测试模块
// const __testModel = () => {
//     __tetCreateTreeDom()
//     __testAppendKey()
//     __test根据内容生成标签二维数组()
//     __test内容生成标签二维数组与二维数组生成对象与对象生成标签插入html中()
// }
export default {}
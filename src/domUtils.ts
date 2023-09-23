const createAndAppendDom = (idName: string, html: string) => {
    let div = document.createElement('div')
    div.setAttribute('id', idName)
    let el = document.querySelector('#'+idName)
    if (el) {
        el.remove()
    }
    div.innerHTML = `
        <h1>id: ${idName}</h1>
    `
    div.insertAdjacentHTML('beforeend', html)
    let body = document.querySelector('body')
    body!.appendChild(div) 
}

export {
    createAndAppendDom,
}
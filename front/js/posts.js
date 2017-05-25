fetch('/api/firstGroupPosts', {
    credentials: 'same-origin'
}).then(response => {
    return response.json().then(data => {
        createTitle(data.groups);
        createPosts(data.wall);
    });
}).catch(() => {
    console.log('Error')
});

function createTitle(data) {
    const parentElement = document.getElementById('postsWrapper');
    let title = document.createElement('h2');
    title.innerHTML = data[0].name;
    parentElement.appendChild(title);
}

function createPosts(data) {
    const elements = data.slice(1, data.length);
    const parentElement = document.getElementById('postsWrapper');

    Array.prototype.forEach.call(elements, function(el) {
        let newChild = document.createElement('div');
        let childContetn = '';
        newChild.setAttribute('class', 'post');
        childContetn += `<p>${el.text}</p>`;
        if (el.attachments) {

            Array.prototype.forEach.call(el.attachments, function(item){
                if (item.type === 'photo'){
                    childContetn +=  `<div class='image'><img src='${item.photo.src}' width='200'></div>`;
                }
                if (item.type === 'doc'){
                    childContetn +=  `<a href='${item.doc.url}'>Ссылка</a>`;
                }
                if (item.type === 'link'){
                    childContetn +=  `<a href='${item.link.url}'>${item.link.title}</a>`;
                }
            })
        }
        newChild.innerHTML = childContetn;
        parentElement.appendChild(newChild);
    });
}

import axios from 'axios';
import '../css/style.css';

function createTitle(data) {
  const parentElement = document.getElementById('postsWrapper');
  const title = document.createElement('h2');
  title.innerHTML = data[0].name;
  parentElement.appendChild(title);
}

function createPosts(data) {
  const elements = data.slice(1, data.length);
  const parentElement = document.getElementById('postsWrapper');

  Array.prototype.forEach.call(elements, (el) => {
    const newChild = document.createElement('div');
    let childContent = '';
    newChild.setAttribute('class', 'post');
    childContent += `<p>${el.text}</p>`;
    if (el.attachments) {
      Array.prototype.forEach.call(el.attachments, (item) => {
        if (item.type === 'photo') {
          childContent += `<div class='image'><img src='${item.photo.src}' width='200'></div>`;
        }
        if (item.type === 'doc') {
          childContent += `<a href='${item.doc.url}'>Ссылка</a>`;
        }
        if (item.type === 'link') {
          childContent += `<a href='${item.link.url}'>${item.link.title}</a>`;
        }
      });
    }
    newChild.innerHTML = childContent;
    parentElement.appendChild(newChild);
  });
}

axios({
  url: '/api/firstGroupPosts',
}).then((response) => {
  const { groups, wall } = response.data;

  createTitle(groups);
  createPosts(wall);
});

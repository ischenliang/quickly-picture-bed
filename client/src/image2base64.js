var template = "<p class=\"wrapper-title\">图片base64编码</p><div class=\"file-wrapper\"><span>点击上传图片，支持拖拽上传</span> <input type=\"file\" class=\"upload\"></div><div class=\"preview-wrapper\"><div class=\"preview-item\"><p class=\"wrapper-title\">DataUri</p><textarea id=\"preview-uri\" cols=\"30\" rows=\"6\"></textarea></div><div class=\"preview-item\"><p class=\"wrapper-title\">DataBase64</p><textarea id=\"preview-base64\" cols=\"30\" rows=\"6\"></textarea></div><div class=\"preview-item\"><p class=\"wrapper-title\">CSS</p><textarea id=\"preview-css\" cols=\"30\" rows=\"6\"></textarea></div><div class=\"preview-item\"><p class=\"wrapper-title\">HTML</p><textarea id=\"preview-html\" cols=\"30\" rows=\"6\"></textarea></div><div class=\"preview-item\"><p class=\"wrapper-title\">HTML</p><img id=\"preview-img\"></div></div>";

var css = "*{-webkit-box-sizing:border-box;box-sizing:border-box}.wrapper{padding:20px;width:100%}.file-wrapper{border:1px dashed #ddd;border-radius:8px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;height:150px;width:100%;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;cursor:pointer}.file-wrapper input,.preview-wrapper{display:none}.wrapper-title{font-size:18px;font-weight:700;margin:0 0 10px}.preview-item{margin-top:25px}.preview-item textarea{border:1px solid #ddd;border-radius:4px;display:block;font-size:13px;line-height:1.5;padding:3px 5px;width:100%}.preview-item img{-webkit-box-shadow:0 0 4px #ccc;box-shadow:0 0 4px #ccc;width:100%}";

// @ts-ignore
class Image2Base64 extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        // 1、创建shadow dom
        const shadow = this.attachShadow({ mode: 'open' });
        // 2、创建元素
        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'wrapper');
        wrapper.innerHTML = template;
        const style = document.createElement('style');
        style.textContent = css;
        // 3、监听事件
        const fileWrapper = wrapper.querySelector('.file-wrapper');
        const input = wrapper.querySelector('.upload');
        fileWrapper.addEventListener('click', () => {
            input.click();
        });
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                const previewWrapper = wrapper.querySelector('.preview-wrapper');
                const previewUri = wrapper.querySelector('#preview-uri');
                const previewBase64 = wrapper.querySelector('#preview-base64');
                const previewCss = wrapper.querySelector('#preview-css');
                const previewHtml = wrapper.querySelector('#preview-html');
                const previewImg = wrapper.querySelector('#preview-img');
                previewWrapper.style.display = 'block';
                const result = reader.result;
                // 不需要base64前缀时
                previewUri.textContent = result.replace(/^data:.+;base64,/, '');
                previewBase64.textContent = result;
                previewCss.textContent = `div.image {\n\twidth: 1920px;\n\theight: 320px;\n\tbackground-image: url(${result});\n}`;
                previewHtml.textContent = `<img width="1920" height="931" src="${result}">`;
                previewImg.setAttribute('src', result);
            };
            reader.readAsDataURL(file);
        });
        shadow.appendChild(style);
        shadow.appendChild(wrapper);
    }
}
var index = {
    name: 'image-to-base64',
    handler: Image2Base64
};

export { index as default };
//# sourceMappingURL=index.js.map

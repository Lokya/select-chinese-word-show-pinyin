
/**
 * background.js
 * 后台脚本请求
 * @date: 2020-08-13
 * @author: lokya
 * @version: 1.0.0
*/

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // 使用formData提交
  const formData = new FormData();
  formData.append([request.data.key], request.data.value);
  if (request.type == 'POST') {
    fetch(request.url, {
      method: 'POST',
      body: formData,
    }).then(response => {
        if (response.status === 200) return response.json()
        else if (response.status === 401) {
          return Promise.resolve(response.status)
        }
      })
      .then(text => {
        sendResponse(text)
      })
      .catch(error => console.error('error', error))
    return true
  }
})

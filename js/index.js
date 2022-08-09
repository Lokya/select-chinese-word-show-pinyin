/**
 * select-chinese-word-show-pinyin
 * 划词显示文字拼音
 * @date: 2020-08-13
 * @author: lokya
 * @version: 1.0.0
*/
let isSelecting = false; // 是否选中状态
let startPosition = {}; // 开始位置
let endPosition = {}; // 结束位置
const baseSize = 14; // 基本大小
let fontSize = baseSize; // 默认文字大小
const queryUrl = 'https://pinyin.miaochaxun.com/?a=ajax'; // 请求接口
const pinyinId = '__pin_yin__'; // 覆盖div的id

document.addEventListener("mouseup", getText, true); // 鼠标点击按下监听事件
document.addEventListener("mousedown", setStartPosition, true); // 鼠标点击抬起监听事件

/**
 * 设置开始位置
 * @param {Object} ev event
 */
function setStartPosition (ev) {
  const e = ev || window.event;
  startPosition.x = e.clientX || 0;
  startPosition.y = e.clientY || 0;
  removeToolTipCover();
}

/**
 * 设置结束位置
 * @param {Object} ev event
 */
function setEndPosition (ev) {
  const e = ev || window.event;
  endPosition.x = e.clientX || 0;
  endPosition.y = e.clientY || 0;
}

/**
 * 是否是中文
 * @param {String} temp 字符串
 */
function isChinese(temp){
  const re=/[^\u4e00-\u9fa5]/;
  if (re.test(temp)) {
    return false;
  } else {
    return true;
  }
}

/**
 * 添加tooTip
 */
function addToolTipCover () {
  // 进行计算是否滑动宽度小于fontSize
  const width = Math.abs(startPosition.x - endPosition.x) < fontSize ? fontSize : Math.abs(startPosition.x - endPosition.x);
  // 对left进行计算
  let left;
  if(startPosition.x > endPosition.x) {
    left = startPosition.x - endPosition.x > fontSize ? endPosition.x : startPosition.x - fontSize;
  } else if(startPosition.x < endPosition.x){
    left = startPosition.x;
  } else {
    left = 0
  }
  const top = startPosition.y
  const toolTip = `<span id="${pinyinId}" style="position: absolute; width:${width}px; height: ${fontSize}px; left:${left}px;top:${top - fontSize / 2}px; z-index: 9999999999"></span>`
  $('body').append(toolTip);
}

/**
 * 删除toolTip
 */
function removeToolTipCover() {
  if($(`#${pinyinId}`))
    $(`#${pinyinId}`).remove();
}

/**
 * 获取文本
 * @param {Object} e event
 */
function getText(e) {
  const selection = window.getSelection && window.getSelection();
  const text = selection.toString();
  const parentElement = selection.extentNode && selection.extentNode.parentElement;
  if( parentElement && window.getComputedStyle) {
    const fontSizeStr = (window.getComputedStyle(parentElement) && window.getComputedStyle(parentElement).fontSize) || baseSize;
    fontSize = parseFloat(fontSizeStr)
  }
  if(text.length === 1 && !isSelecting) {
    isSelecting = true;
    if(isChinese(text)) {
      setEndPosition(e);
      addToolTipCover();
      sendQueryMessage({
        key: 'content',
        value: text
      })
    }
  } else {
    isSelecting = false;
    if(startPosition && endPosition ) {
      startPosition = {};
      endPosition = {};
      removeToolTipCover();
    }
  }
}

/**
 * 查询拼音并且展示
 * @param {Object} queryData 查询数据
 */
function sendQueryMessage(queryData) {
  chrome.runtime.sendMessage(
    {
        type: 'POST',
        url: queryUrl,
        data: queryData
    },
    (response = {}) => {
      const pinyin = response.pinyin || '未查询到'
      tippy(`#${pinyinId}`, {
        content: pinyin,
      });
    }
  )
}



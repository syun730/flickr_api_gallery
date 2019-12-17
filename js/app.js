// パラメーター
var parameters = {
  method: 'flickr.photos.search',
  api_key: '88b21295509ef1ffe91551c5772d0daf',
  text: '', // 検索キーワード
  sort: 'date-posted-desc', // ソート
  per_page: 12, // 取得件数
  extras: 'url_s', // 追加で取得する情報
  format: 'json', // レスポンスをJSON形式に
  nojsoncallback: 1 // コールバック関数呼び出さない
};

function searchFlickr() {
  var searchKeyword = document.getElementById('searchKeyword').value;
  parameters.text = searchKeyword;
  // console.log(parameters.text);

  if (parameters.text === '') {
    alert('キーワードを入力してください');
    return;
  }

  // オブジェクトを文字列に変換・&で繋ぐ
  var parameterUrl = Object.keys(parameters).map((key) => {
    // console.log(key);
    // console.log(parameters[key]);
    // console.log("-------------------------------------------");
    return encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key]);
  }).join('&');

  // 検索URL
  var requestUrl = 'https://api.flickr.com/services/rest/?' + parameterUrl;
  // console.log(requestUrl);

  // jsonデータを取得
  var xhr = new XMLHttpRequest();
  xhr.open('GET', requestUrl);
  xhr.responseType = 'json';
  xhr.addEventListener('load', () => {
    var jsonResponse = xhr.response;
    // console.log(jsonResponse);
    // console.log(jsonResponse.photos.photo[0].url_s);
    // console.log(jsonResponse.photos.perpage);

    // 検索実行後リセット
    galleryListInner.innerHTML = "";
    galleryListInner.style = 'margin-left: 0';
    currentIndex = 0;

    // htmlに反映
    var images = jsonResponse.photos.photo;
    images.forEach((image, index) => {
      // console.log(image);
      // console.log(index);

      var img = document.createElement('img');
      img.src = image.url_s;

      var galleryListItem = document.createElement('div');
      galleryListItem.classList.add('galleryListItem');
      galleryListInner.appendChild(galleryListItem);
      galleryListItem.appendChild(img);
    });

    next.style = 'display: block';
    prev.style = 'display: block';
  });
  xhr.send();
}

class BtnMove {
  constructor() {
    this.itemWidth;
    this.galleryListItem = document.getElementsByClassName('galleryListItem');
    this.galleryListInner = document.getElementById('galleryListInner');
  }

  prev() {
    this.itemWidth = this.galleryListItem[0].clientWidth;
    this.itemWidth *= -1;
    this.itemLast = document.querySelector('#galleryListInner .galleryListItem:last-child');
    this.galleryListInner.prepend(this.itemLast);
    this.galleryListItem[0].style = `margin-left: ${this.itemWidth}px`;

    setTimeout(() => {
      this.galleryListItem[0].style = 'margin-left: 0';
    }, 150);
  }

  next() {
    this.itemWidth = this.galleryListItem[0].clientWidth;
    this.itemWidth *= -1;
    this.galleryListItem[0].style = `margin-left: ${this.itemWidth}px`;

    setTimeout(() => {
      this.galleryListItem[0].style = 'margin-left: 0';
      this.itemFirst = document.querySelector('#galleryListInner .galleryListItem:first-child');
      this.galleryListInner.append(this.itemFirst);
    }, 250);
  }
}

var btnMove = new BtnMove();
// nextボタン
var next = document.getElementById('next');
next.addEventListener('click', () => {
  btnMove.next();
});

// prevボタン
var prev = document.getElementById('prev');
prev.addEventListener('click', () => {
  btnMove.prev();
});

// スワイプ
var galleryListInner = document.getElementById('galleryListInner');
var startX;
var endX;
var dist = 30;
galleryListInner.addEventListener('touchstart', (event) => {
  startX = event.touches[0].pageX;
});

galleryListInner.addEventListener('touchmove', (event) => {
  event.preventDefault();
  endX = event.changedTouches[0].pageX;
});

galleryListInner.addEventListener('touchend', (event) => {
  if (startX > endX + dist) { // 左スワイプ
    btnMove.next();
  } else if (startX + dist < endX) { // 右スワイプ
    btnMove.prev();
  }
});

// 検索ボタン
var serchBtn = document.getElementById('serchBtn');
serchBtn.addEventListener('click', () => {
  searchFlickr();
});

var currentIndex = 0;
if (currentIndex === 0) {
  next.style = 'display: none';
  prev.style = 'display: none';
}
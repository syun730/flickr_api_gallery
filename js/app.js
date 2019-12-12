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

var currentIndex = 0;
var itemWidth = 0;
var galleryList = document.getElementById('galleryList');
var galleryListInner = document.getElementById('galleryListInner');
var galleryListItem = document.getElementsByClassName('galleryListItem');

function searchFlickr() {
  var searchKeyword = document.getElementById('searchKeyword').value;
  parameters.text = searchKeyword;
  // console.log(parameters.text);

  if (parameters.text === '') {
    alert('キーワードを入力してください');
    return false;
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
      galleryListItem.setAttribute('class', 'galleryListItem');
      galleryListInner.appendChild(galleryListItem);
      galleryListItem.appendChild(img);
    });

    next.style = 'display: block';
    prev.style = 'display: block';
  });
  xhr.send();
}

// 検索ボタン
var serchBtn = document.getElementById('serchBtn');
serchBtn.addEventListener('click', () => {
  searchFlickr();
});

// nextボタン
var next = document.getElementById('next');
next.addEventListener('click', () => {
  itemWidth = 240;
  currentIndex++;
  itemWidth *= currentIndex;
  galleryListInner.style = `margin-left: -${itemWidth}px`;
  if (currentIndex === galleryListItem.length) {
    galleryListInner.style = 'margin-left: 0';
    currentIndex = 0;
  }
});

// prevボタン
var prev = document.getElementById('prev');
prev.addEventListener('click', () => {
  itemWidth = 240;
  currentIndex--;
  itemWidth *= currentIndex;
  galleryListInner.style = `margin-left: -${itemWidth}px`;
  if (currentIndex < 0) {
    currentIndex = galleryListItem.length - 1;
    galleryListInner.style = `margin-left: ${itemWidth * currentIndex}px`;
  }
});

if (currentIndex === 0) {
  next.style = 'display: none';
  prev.style = 'display: none';
}
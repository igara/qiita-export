
# この記事の内容

* ServiceWorker・Cache APIとは

ServiceWorkerとCache APIを使ってオフラインでも動くWebアプリを作る
http://qiita.com/horo/items/175c8fd7513138308930

JavaScriptの処理で自在にキャッシュ削除とかが行えたら良いなということでメモとして記載します。

# コード

下記をブラウザの開発ツールのコンソールより実行することで
ServiceWorkerの登録削除とCache APIのキャッシュを全て削除されます。

```JavaScript
navigator.serviceWorker.getRegistrations().then(function(registrations) {
    // 登録されているworkerを全て削除する
    for(let registration of registrations) {
        registration.unregister();
    }
});
caches.keys().then(function(keys) {
    var promises = [];
    // キャッシュストレージを全て削除する
    keys.forEach(function(cacheName) {
        if (cacheName) {
            promises.push(caches.delete(cacheName));
        }
    });
});
```

### package.jsonにて外部ライブラリを管理する

macを使っている場合にちょっとハマったので記載


下記で終わりっと思っていたら...

```
brew install npm
npm install
```

なんかこんなのでてくる

```
module.js:333
    throw err;
          ^
Error: Cannot find module 'child-process-close'
    at Function.Module._resolveFilename (module.js:331:15)
    at Function.Module._load (module.js:273:25)
    at Module.require (module.js:357:17)
    at require (module.js:373:17)
    at /usr/local/lib/node_modules/npm/lib/npm.js:15:1
    at Object.<anonymous> (/usr/local/lib/node_modules/npm/lib/npm.js:520:3)
    at Module._compile (module.js:449:26)
    at Object.Module._extensions..js (module.js:467:10)
    at Module.load (module.js:349:32)
    at Function.Module._load (module.js:305:12)
```

### 解決方法

毎度のことだがぐぐってみる
http://spot-bill.com/wordpress/?p=92

```
wget http://npmjs.org/install.sh
sudo sh ./install.sh
```

で解決

### おすすめの解決方法

brewからではなくnodebrewを用いてnodejsをインストールする。

```

$ curl -L git.io/nodebrew | perl - setup

```


```.bashrc

export PATH=$HOME/.nodebrew/current/bin:$PATH

```

```

$ source .bashrc
$ nodebrew install v4.2.1
$ nodebrew use v4.2.1
$ node -v
  v4.2.1

```


### laravelのpackage.jsonにライブラリを追加する

こっからが本題。

ライブラリをダウンロードしてプロジェクトに追加するのも良いが
せっかくlaravelのプロジェクトを作成した時にpackage.jsonというので
バージョン管理がされているのでこれを使おう。

laravelプロジェクト作成当時に記載されていたpackage.json

```package.json

{
  "private": true,
  "devDependencies": {
    "gulp": "^3.8.8"
  },
  "dependencies": {
    "laravel-elixir": "^3.0.0",
    "bootstrap-sass": "^3.0.0"
  }
}

```

このまま

```

npm install

```

でpackage.jsonのライブラリが追加されるわけだが
仮に新しいバージョンのライブラリを入れたい時は

```

npm install --save-dev laravel-elixir

```

とすることで新しいバージョンの情報がpackage.jsonに更新される。


### 個人的に使いたい物を入れてみる

```

npm install --save-dev angular2
npm install --save-dev mocha
npm install --save-dev phantomjs

```
結果として今使おうとしているライブラリの一覧ができた。

```package.json

{
  "private": true,
  "devDependencies": {
    "angular2": "^2.0.0-alpha.45",
    "gulp": "^3.8.8",
    "mocha": "^2.3.3",
    "phantomjs": "^1.9.18"
  },
  "dependencies": {
    "laravel-elixir": "^3.0.0",
    "bootstrap-sass": "^3.0.0"
  }
}
```

# 概要
> 『こういったサイトを作ってみたかったんだよ!』
> OnsenUIでスマホアプリみたいなサイトを作ってみる より
> http://qiita.com/igara/items/92d0b58c4df21141429a

サイトでもアプリのように動きのあるものを扱っていたとき、
これどうやってテストコード化できるのだろうと疑問に思ったため
やってみたという記事です。

ソースは下記のレポジトリにあります。
https://github.com/igara/syonet/

# 使ってみたもの
- [Protractor](http://www.protractortest.org/#/)
WebDriverとテストフレームワークを繋げてブラウザベースのテストができるE2Eテストフレームワーク

- [mocha](https://mochajs.org/)
JavaScriptのユニットテストフレームワークの１つ

- [power-assert](https://github.com/power-assert-js/power-assert)
t_wadaさん作成のassertライブラリ
> テスト書いてないとかお前それ@t_wadaの前でも同じこと言えんの？

- [TypeScript](http://www.typescriptlang.org/)
AltJS
[Typings](https://github.com/typings/typings)より[DefinitelyTyped](http://definitelytyped.org/)で管理されている様々な型情報ファイルを使うことでIDEによってはライブラリで扱っているものの入力補完できたりと便利。

- [OnsenUI](https://onsen.io/2/)
2.0 Beta版を使用しています。

# インストール

- npmパッケージインストール

```package.json
{
  "version": "0.0.1",
  "private": true,
  "devDependencies": {
    "angular": "^1.5.0",
    "mocha": "^2.4.5",
    "onsenui": "^2.0.0-beta",
    "power-assert": "^1.2.0",
    "protractor": "^3.1.1",
    "typescript": "^1.8.0",
    "typings": "^0.6.7"
  }
}
```

```
npm install
```

- d.tsインストール

AngularとjQueryで
var $: JQueryStatic;の宣言が被ってしまうので
独自でjQueryのd.tsファイルを加工しています。

```typings.json
{
  "ambientDependencies": {
    "angular": "github:DefinitelyTyped/DefinitelyTyped/angularjs/angular.d.ts#17ef40452039d19e06dc2a3815ea898c505860fa",
    "angular-protractor": "github:DefinitelyTyped/DefinitelyTyped/angular-protractor/angular-protractor.d.ts#17fa1e5f269189f7f8e0f53f8c443e6c2eac562c",
    "empower": "github:DefinitelyTyped/DefinitelyTyped/empower/empower.d.ts#aeb7701fbef3b7fc7261d67c025c823666ab98ea",
    "jquery": "github:igara/DefinitelyTyped/jquery/jquery.d.ts#144ca38f83058b29f2b7b38c28e931a0139aa022",
    "mocha": "github:DefinitelyTyped/DefinitelyTyped/mocha/mocha.d.ts#d6dd320291705694ba8e1a79497a908e9f5e6617",
    "node": "github:DefinitelyTyped/DefinitelyTyped/node/node.d.ts#263705d313346e093d95cb62cef6fed848e46978",
    "onsenui": "github:DefinitelyTyped/DefinitelyTyped/onsenui/onsenui.d.ts#76352a94c6e4a51e7f382aebaf0b63d9ac06ae12",
    "power-assert": "github:DefinitelyTyped/DefinitelyTyped/power-assert/power-assert.d.ts#695da95a2405a9d6aae11944174227e1e7716e37",
    "power-assert-formatter": "github:DefinitelyTyped/DefinitelyTyped/power-assert-formatter/power-assert-formatter.d.ts#aeb7701fbef3b7fc7261d67c025c823666ab98ea",
    "selenium-webdriver": "github:DefinitelyTyped/DefinitelyTyped/selenium-webdriver/selenium-webdriver.d.ts#a83677ed13add14c2ab06c7325d182d0ba2784ea"
  }
}

```

```
typings install
```

# 設定

- Protractorの設定

詳しいexports.configの情報として
[referenceConf.js](https://github.com/angular/protractor/blob/master/docs/referenceConf.js)に記載されています。


[e2echrome.js](https://github.com/igara/syonet/blob/master/e2echrome.js)

```e2echrome.js
exports.config = {
  seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
  framework: 'mocha', // mochaを使用する
  mochaOpts: {        // mochaの設定
    ui: 'bdd',        // テスト記述方法をビヘイビアで行う。tddも可能
    reporter: 'dot',  // テスト結果出力方法。詳しくはhttps://mochajs.org/#reporters
    slow: 3000,
    enableTimeouts: false     // テスト中にタイムアウトさせるかの設定
  },
  specs: ['tests/**/*.js'],    // テスト対象ファイル
  capabilities: {
    'browserName': 'chrome'    // 使用ブラウザ
  },
  baseUrl: 'http://127.0.0.1:8000/'
};
```

# テストコード

## SlidingMenuViewの表示・非表示のテスト例

OnsenUIには画面上を横スワイプしたときに表示できる[SlidingMenu](http://ja.onsen.io/reference/ons-sliding-menu.html)というのがあります。
テストコード上でどうやってスワイプの処理をさせ、表示の確認したかの一例紹介になります。

ソースは[SideMenuTest.ts](https://github.com/igara/syonet/blob/master/tests/e2e/syonetwork/SideMenuTest.ts)


- スワイプ処理どうする?

下記は、スワイプ処理のやり方としてマウスのイベントを用いて再現しようとしています。
「マウス動かす→マウスクリックを押す→マウスを動かす→マウスクリックを離す」
といった動きになります。

```
browser.actions()
       .mouseMove(body, {x:browserSize.width / 2, y:browserSize.height / 2})
       .mouseDown()
       .mouseMove(body, {x:browserSize.width, y:browserSize.height / 2})
       .mouseUp()
       .perform();
```

- SlidingMenuの表示確認どうする?

SlidingMenuには[isMenuOpened()](http://ja.onsen.io/reference/ons-sliding-menu.html#method-isMenuOpened)というJavaScriptの関数を用いることでSlidingMenuの表示確認を行うことができます。

ブラウザ内のJavaScriptの実行を行った結果を取得するために
[executeAsyncScript](https://angular.github.io/protractor/#/api?view=webdriver.WebDriver.prototype.executeAsyncScript)を用いてassertさせるやり方で確認をしています。

```
// ブラウザ内のJavaScriptを実行させる
browser.executeAsyncScript(function() {
    var callback = arguments[arguments.length - 1];
    callback(menu.isMenuOpened());
}).then(function(isMenu) {
    assert.default(
        isMenu === true,
        'error:サイドメニューが開かれていない');
    // スリープさせる
    browser.sleep(sleepTime);
    // スクリーンショットを取る
    browser.takeScreenshot().then(function(data) {
        fs.writeFile(
            'screenshot/syonetwork/OpenedSideMenu.png',
            data.replace(/^data:image\/png;base64,/,''), 
            'base64',
            function(error) {
                if(error) throw error;
            }
        );
    });
});
```

isMenuOpened()で表示確認した後、スクリーンショットを取る処理も入れて見ました。

menu.isMenuOpened()とありますがこいつは
[root_top.blade.php](https://github.com/igara/syonet/blob/master/resources/views/root/root_top.blade.php#L16)よりvarの属性が指定されているものになります。
　[OnsenUIの属性について](http://ja.onsen.io/reference/ons-sliding-menu.html#attributes)
TypeScriptを使っている場合、menuって型なんだっけ?となるので独自の型宣言のファイルを作ってあげてimportさせる必要が有ります。

[SyonetWork.d.ts](https://github.com/igara/syonet/blob/master/tests/e2e/SyonetWork.d.ts)

# 実行

ProtractorはWebDriverによるテストを行います。
Javaのインストールと下記を実行


WebDriver起動までにすること

```

node_modules/protractor/bin/webdriver-manager update
node_modules/protractor/bin/webdriver-manager start 

```


テストの実行

```

node_modules/.bin/protractor e2echrome.js

```


# 参考資料
Protractorの小ネタ
http://qiita.com/zoetro/items/6a82e066a8bb147c407a
AngularJS用テストフレームワーク「Protractor」チュートリアル日本語訳
http://qiita.com/weed/items/30098f7be2f753580f63
Protractor で起動したブラウザで任意の JavaScirpt コードを実行する
http://qiita.com/naoiwata/items/b389c27d7b19b6fa634d

# この記事では  
RoBoHoN開発をmacで行った時に公式で公開されているサンプルコードをビルドして実行するまでの手順について記載する

# 準備物  
Android Studio 2.1.1
ADB DebugできるUSB mini端子
※macですのでADB Driverのインストールは不要

# RoBoHoNをUSB経由でアプリインストールできるようにする
よくあるAndroidのデバッグモード切り替えの方法と同じだった  

1. ロボホンの背中から「設定」を押す  
![IMG_1217.JPG](0-md.jpeg)
2. 「端末情報」を押す  
![IMG_1218.JPG](1-md.jpeg)
3. 「ビルド番号」を複数回押す  
![IMG_1219.JPG](2-md.jpeg)
この時点でRoBoHoNは開発モードになります  
![IMG_1220.JPG](3-md.jpeg)
4. 「設定」画面から「その他」を押す  
![IMG_1221.JPG](4-md.jpeg)
5. 「開発者向けオプション」を押す  
![IMG_1222.JPG](5-md.jpeg)
6. 「On」にする  
![IMG_1223.JPG](6-md.jpeg)
7. 「USBデバッグ」をチェックする
![IMG_1224.JPG](7-md.jpeg)

この手順でADBデバイスとして認識されるようになり、Andoid Studioから自作アプリインストールができるようになる
次回はアプリ作成

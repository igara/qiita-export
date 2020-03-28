## MTV型フレームワーク
Model 　　データのまとまり
Templete 画面表示する雛形
View 　　 画面遷移先の制御

http://djangoproject.jp/doc/ja/1.0/faq/general.html

## 環境構築
#### Pythonのパッケージソフトウェア管理ツールをインストール

```
sudo easy_install pip
```

#### Djangoのインストール

```
sudo pip install django
```

## プロジェクトの作成

```
django-admin.py startproject プロジェクト名
```

下記の様な物が作成される
プロジェクト名
├── manage.py
├── プロジェクト名
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py

## マイグレーションの利用に関して

```
python manage.py startapp アプリケーション名
```

下記の様なのが構成される
├── アプリケーション名
│   ├── __init__.py
│   ├── admin.py // DBをいじるための管理画面に必要な物
│   ├── models.py // DB Model
│   ├── tests.py
│   └── views.py

Modelを作成する
adminの設定を行う

```
python manage.py makemigrations アプリケーション名
```

アプリケーションにモデルを基にmigrationsの追加構成される
├── アプリケーション名
│   ├── __init__.py
│   ├── admin.py
│   ├── migrations // DBの定義構成するためのファイルがある
│   │   ├── 0001_initial.py
│   │   └── __init__.py
│   ├── models.py
│   ├── tests.py
│   └── views.py

```
python manage.py syncdb
```

DB定義更新的な物

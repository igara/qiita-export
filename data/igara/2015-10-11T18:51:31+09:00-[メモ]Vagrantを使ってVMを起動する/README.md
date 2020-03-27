VagrantからVMを立ち上げてsshするとこまでまとめる。

# まず使いたいboxを探してくる

vagrant boxはサイトで公開されているものがあるためそちらを利用する。
今回はGentooを利用する。

```
$ vagrant box add gentoo_amd64 https://dl.dropboxusercontent.com/u/632007/gentoo-systemd-amd64-virtualbox-2015-02-22.box
```
この時、gentoo_amd64と入力したがこれは自分のローカルで使うboxの名前になる。

# Vagrantfileの作成

VMの設定をVagrantfileに記載することでvagrant up後に設定が反映される。
※vagrant up後については後記
Vagrantfileを作成したいディレクトリで

```
$ vagrant init gentoo_amd64
```

これでVagrantfileが作成される。

# vagrant up

```
$ vagrant up
```

これでいったんはVMが起動される。

# VMにsshする

```
$ vagrant ssh
```

便利そうなことを書き足す形式でこの投稿を更新しよう

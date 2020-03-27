レンタルサーバをお借りしていると
たまに意図せずにサーバが落ちてしまうことがあるので
再起動した時に自動で独自のサービスを起動させるためのメモ

# chkconfig

chkconfigの設定が必要そう!

詳しい話は下記リンク参照
http://blog.jicoman.info/2014/04/centos_init_script/

# 自動起動するスクリプトを書く

テスト的に記載

**本来ならばコマンド失敗時にログを残すなどしないと!**

```
vi /etc/rc.d/init.d/syonet
```

``` /etc/rc.d/init.d/syonet

#!/bin/bash
# chkconfig: 345 99 1
# description: syonet
# processname: syonet

start(){
    if [ -e /root/.phpenv/versions/7.0.0/sbin/php-fpm ]; then
        nohup /root/.phpenv/versions/7.0.0/sbin/php-fpm &
    else
        echo "/root/.phpenv/versions/7.0.0/sbin/php-fpmがないよ!"
    fi

    if [ -e /root/http.conf ]; then
        nohup h2o -c /root/http.conf &
    else
        echo "h2oのコンフィグファイル/root/http.confがないよ!"
    fi

    if [ -e /root/c9sdk/server.js ] && [ -d /root/slack_rack_php ]; then
        nohup node /root/c9sdk/server.js -p 8080 -a XXX:XXX -w /root/slack_rack_php/ &
    else
        echo "cloud9をcloneした？syonetのcloneは?"
    fi

    return 0;
}
stop(){
    echo "not stop"
    return 0
}


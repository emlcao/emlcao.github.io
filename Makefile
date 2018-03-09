all: sync

sync:
		rsync -av . root@linhcao.me:/var/www/html

echo:
		echo "helloworld"

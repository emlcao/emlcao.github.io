all: sync

sync:
		rsync -av . root@emlcao.github.io:/var/www/html

echo:
		echo "helloworld"

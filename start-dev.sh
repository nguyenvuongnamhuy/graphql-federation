nest start --watch users &
nest start --watch posts &
nest start --watch doc-queue & sleep 3
nest start --watch gateway
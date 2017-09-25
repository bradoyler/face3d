## obj :: 81d29f78060d53288df64d6aab636812
## id = $1
## name = $2

echo $1 $2
mkdir p/$2
curl http://www.cs.nott.ac.uk/~psxasj/3dme/queue/obj/$1.obj > p/$2/model.obj
curl http://www.cs.nott.ac.uk/~psxasj/3dme/queue/obj/$1.jpg > p/$2/avatar.jpg

This utility runs all of the image check commands found in this [guide](https://hackmd.io/@levicook/HJcDneEWF).

There is a slight modification to the command:

``find assets -type f -name '*.json' |  xargs jq -r '.name' | sort | less``

to

``find assets -type f -name '*.json' |  xargs jq -r '.name' | sort | less > out.txt``

which just outputs the result to a file for ease of use.
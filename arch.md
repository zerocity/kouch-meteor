1. export LC_ALL=C
2. ?? maybe it works .... sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000
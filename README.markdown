shutupjack.buzz
===============

Usage
-----

1. Go to https://shutupjack.buzz
2. Click buttons


Errata
------

- Vibration probably doesn't work on iphones


Deployment
----------

I didn't feel like buying a cloud server so I'm having Cloudflare reverse proxy to my home network. This requires:
1. A port forwarded at my edge router to one of my servers
2. Cloudflare origin rule for all incoming requests - rewrite port to the non-443 port I forwarded in my edge router
3. Self-signed SSL cert for my local web server even though that's not where I'm terminating SSL (Cloudflare really likes to speak HTTPS)
4. Python websocket backend server running with `python3.11 websocket-backend/backend.py`
    - protip: `python3.11 -m pip install websockets`
5. Probably some more magic I'm forgetting but those are the basics

nginx server:
```
    server {
        listen       3017 ssl;
        server_name  shutupjack.buzz;

        ssl_certificate /usr/local/etc/nginx/shutupjack.buzz.crt;
        ssl_certificate_key /usr/local/etc/nginx/shutupjack.buzz.key;

        location / {
            root /usr/local/www/shutupjack.buzz;
        }

        location /jack-botherer-3017 {
            proxy_pass http://localhost:13017;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
```

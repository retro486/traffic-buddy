call haml www/index.html.haml www/index.html
call haml www/new_peek.html.haml www/new_peek.html
call sass www/css/index.css.scss www/css/index.css
call sass www/css/new_peek.css.scss www/css/new_peek.css
cordova run --device android

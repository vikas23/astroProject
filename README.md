*THE SOLUTION IS BASED ON THE ASSUMPTION THAT (0, 0) IS THE SOUTH WEST MOST CORNER AND HENCE ONLY POSITIVE QUADRANT MOVEMENT IS ALLOWED.*
===

AWS Server IP: **18.188.63.236**
==

Usage
===
- npm i
- node app.js

API and Usage
===

- **/setplaceanddirection**: This sets the initail place for the bot.

      curl -X POST \
      http://18.188.63.236/setplaceanddirection \
      -H 'cache-control: no-cache' \
      -H 'content-type: application/json' \
      -d '{
    	"x": 0,
    	"y": 0,
    	"direction": "NORTH"
        }'
        
- **/report**: Report the current position for the bot.

      curl -X POST \
      http://18.188.63.236/report \
      -H 'cache-control: no-cache' \
      -H 'content-type: application/json' \
      -d '{
    	"command": "REPORT"
        }'

- **/moverobot**: To move and change direction of the bot
  
      curl -X POST \
      http://18.188.63.236/moverobot \
      -H 'cache-control: no-cache' \
      -H 'content-type: application/json' \
      -d '{
    	"command": "MOVE"
        }'

      ================
      
      curl -X POST \
      http://18.188.63.236/moverobot \
      -H 'cache-control: no-cache' \
      -H 'content-type: application/json' \
      -d '{
    	"command": "LEFT"
        }'

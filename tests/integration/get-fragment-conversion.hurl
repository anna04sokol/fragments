# Test markdown to HTML
POST http://localhost:8080/v1/fragments

Content-Type: text/markdown
[BasicAuth]
user1@email.com:password1
`# Hello World`

HTTP/1.1 201
[Asserts]
header "Content-Type" matches /^application\/json/
body contains "\"status\":\"ok\""
[Captures]
location: header "Location"

GET {{location}}.html
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
header "Content-Type" matches /^text\/html/
body contains "<h1>Hello World</h1>"

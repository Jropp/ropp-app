# ropp-app
## In Progress

### What is next

See if there is a good way to edit in preview mode directly instead of showing a preview separately.

### Thoughts on my markdown editor

I'm currently working on the text-editor div for markdown style text editing. I'm plopping it in the conversations container, but I'm not sure if this is the right place for it. I have a nice little parser that turns the basic markdown into a json config and then sets a display value for it. 

Do I actually need the config layer? Or should I just handle string parsing (which I already need to do to conver it to json?)? Why not just save it and parse it as raw text and convert it straight to html?

What is my use case?

I want pretty notes. Or at least more organized text and markdown will help me do that. 

I also want to support raw html type to put in buttons and such or quotes, or other fancy things like that. 


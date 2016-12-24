#!/Python/Python35/python
# -*- coding: UTF-8 -*-# To change this license header, choose License Headers in Project Properties.
# To change this template file, choose Tools | Templates
# and open the template in the editor.

import cgi

print """Content-type: text/html; charset=utf-8\n\n
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>"""
 
form = cgi.FieldStorage()
mymode = form.getvalue("mymode", "error")
myitem = form.getvalue("myitem", "error")
def doseton(myitem):
### Code here for backend operation
  print myitem
def dosetoff(myitem):
### Code here for backend operation
  print myitem
 
#&nbsp;
 
if myitem != "error":
 if mymode == "seton":
    doseton(myitem)
 
 elif mymode == "setoff":
  dosetoff(myitem)
 
 else:
  print "error"
else:
 print "error"
 
print """</html>"""



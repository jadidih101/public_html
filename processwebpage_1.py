#!/Python/Python35/python
# -*- coding: UTF-8 -*-# To change this license header, choose License Headers in Project Properties.
# To change this template file, choose Tools | Templates
# and open the template in the editor.

import cgi
from random import randrange ;
import pymysql

#form = cgi.FieldStorage()
#mymode = form.getvalue("mymode", "error")
#myitem = form.getvalue("myitem", "error")

#if myitem != "error":
# if mymode == "seton":
#    doseton(myitem)
# 
# elif mymode == "setoff":
#  dosetoff(myitem)
# 
# else:
#  print ("error")
#else:
# print ("error")

def connecttodb():
    # Connect to MySQL database """
    
    try:
        conn = pymysql.connect(host='localhost', port=3306, user='root', password='Potato123', db='mygermanwords', charset='utf8mb4',cursorclass=pymysql.cursors.DictCursor);

    except Error as e:
        print(e)
 
    #finally:
    #    conn.close();
    return conn

try:
    db = connecttodb()
    cursor = db.cursor()

    sqlst = "SELECT COUNT(*)FROM information_schema.tables WHERE table_schema = 'mygermanwords' AND table_name = 'usagedb';"
    cursor.execute(sqlst)
    udbexist = cursor.fetchone()
    if udbexist['COUNT(*)'] == 0 :
       #create usage database
       sqlst = "CREATE TABLE if not exists mygermanwords.usagedb (type INT(11), id INT(11), lastused DATETIME)"
       cursor.execute(sqlst)

    nb= '';
    while (nb != 'exit'):
        cursor.execute("select * from nouns order by rand() limit 1;");
        array = cursor.fetchone()
        noun_id = array['idnouns']
        sqlst = "select * from usagedb where usagedb.type=1 and id="+str(noun_id)+" ;"
        cursor.execute(sqlst);
        prev_use = cursor.fetchone()
        if prev_use is None: 
           sqlst = "insert into usagedb values(1,"+str(noun_id)+",now());"
           cursor.execute(sqlst)
           cursor.connection.commit()
        else:
           print("prev_use is:%s"%prev_use)
           continue

        # nb = input("what is %s in German (exit):"%array['translation']);
        #  if (nb == 'exit'): break;
        print (array['article']+' '+array['noun']);
        nb = 'exit'
except MySQLError as e:
    print('Got error {!r}, errno is {}'.format(e, e.args[0]))
finally:      
   db.close()


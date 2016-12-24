/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global result */

function selectword(){
    var nochoices = 0;
    var inclword = [];
    var turn = "";
    
    if ($("#incnouns").is(':checked'))
        inclword.push("nouns");
    
    if ($("#incverbs").is(':checked'))
        inclword.push("verbs");    
    if ($("#incads").is(':checked'))
        inclword.push("advadj");
    if ($("#incphrases").is(':checked'))
        inclword.push("phrases");
    
    nochoices = inclword.length;
    if (nochoices != 0)
        if ( nochoices > 1){
            rn = Math.floor(Math.random() * nochoices);
            turn = inclword[rn];
        }
        else 
            turn = inclword[0];
        
        
    return turn;
};

function showtranslation(){
    if ($("#engtogerm").is(':checked'))
    {
        if (window.wordtype == "nouns"){
            $("#showtranslation").text("German Noun translation: "+localStorage.article+" "+localStorage.noun);
        }
        if (window.wordtype == "verbs"){
                $("#showtranslation").text("German Verb translation: "+localStorage.verb);
        }
        if (window.wordtype == "advadj"){
                $("#showtranslation").text("German advadj translation: "+localStorage.advadj);
        }
        if (window.wordtype == "phrases"){
                $("#showtranslation").text("German phrase translation: "+localStorage.phrase);
        }
    } else {
          $("#showtranslation").text("English translation: "+localStorage.translation);
      }

   $("#showTrans").attr("disabled", true);
   $("#showdlg").show();
   //$("#showranslation").show();
   $("#getword").focus();

}

$(document).ready(function(){
    
    $("#verbix").click(function(){
        var url="http://www.verbix.com/webverbix/German/";
        url += localStorage.germword+".html";
        $("#ponsif").attr("src",url);
        $("#showpons").html("<p><a href=\""+url+"\" target=\"iframe_a\"></a></p>");   
    });
    
    $("#bab").click(function(){
        var url="http://en.bab.la/dictionary/german-english/";
        url += localStorage.germword+".html";
        window.open(url,'bab');
    });
    $("#pons").click(function(){
        var url="http://de.pons.com/%C3%BCbersetzung?l=deen&q=";
        url += localStorage.germword;
        $("#ponsif").attr("src",url);
        $("#showpons").html("<p><a href=\""+url+"\" target=\"iframe_a\"></a></p>");
    });
    $("#dictcc").click(function(){
        var url="http://www.dict.cc/?s=";
        url += localStorage.germword;
        $("#ponsif").attr("src",url);
        $("#showpons").html("<p><a href=\""+url+"\" target=\"iframe_a\"></a></p>");
    });
    
    $("#getword").click(function(){

        //localStorage.clear();
        //alert("include: "+window.word_included);
        window.wordtype = selectword();
        if (window.wordtype ==""){
            alert("Error: No word type selected.");
            return;
        };
           
        data = {wordinc: window.wordtype};
        $.getJSON("/cgi-bin/processwebpage.py", data, 
            function(result,status){
                //alert("result: " +JSON.stringify(result)+"\nStatus"+status);
                //$.each(result, function(i, item) {
                //    alert("i is: "+i+" item is: "+item);
                //gerword = JSON.parse(result);
                if (result["status"] != "success")
                    return;
                $("#showdlg").hide();
                $("#verbix").attr('disabled','disabled');
                if (result["type"] == "noun"){
                   localStorage.setItem("article",result['word']['article']);
                   localStorage.setItem("noun",result['word']['noun']);
                   localStorage.setItem("germword",localStorage.article+' '+localStorage.noun);
                   localStorage.setItem("translation",result['word']['translation']);
                    if ($("#engtogerm").is(':checked')){
                        $("#showword").text('English Noun: '+localStorage.translation);
                    } else 
                        $("#showword").text('German Noun: '+localStorage.germword);                   
                }
                if (result["type"] == "verb"){
                   localStorage.setItem("verb",result['word']['verbs']);
                   localStorage.setItem("translation",result['word']['translation']);
                   localStorage.setItem("germword",localStorage.verb);
                    if (!$("#engtogerm").is(':checked'))
                        $("#verbix").removeAttr('disabled');
                        //$("#verbix").show();
                   $("#showword").text("");
                    if ($("#engtogerm").is(':checked')){
                        $("#showword").text("English Verb: "+localStorage.translation);
                        $("#typegermword").show();
                    } else 
                        $("#showword").text("German Verb: "+localStorage.verb)
                }
                if (result["type"] == "advadj"){
                   localStorage.setItem("advadj",result['word']['advadj']);
                   localStorage.setItem("translation",result['word']['translation']);
                   localStorage.setItem("germword",localStorage.advadj);
                   $("#showword").text("");
                    if ($("#engtogerm").is(':checked')){
                        $("#showword").text("English advadj: "+localStorage.translation);
                        $("#typegermword").show();
                    } else 
                        $("#showword").text("German advadj: "+localStorage.advadj)
                }
                if (result["type"] == "phrase"){
                   localStorage.setItem("phrase",result['word']['phrases']);
                   localStorage.setItem("translation",result['word']['translation']);
                   localStorage.setItem("germword",localStorage.phrase);
                   $("#showword").text("");
                    if ($("#engtogerm").is(':checked')){
                        $("#showword").text("English phrase: "+localStorage.translation);
                        $("#typegermword").show();
                    } else 
                        $("#showword").text("German phrase: "+localStorage.phrase)
                }
                $("#typegermword").find("input").val("");
                $("#typegermword").show();
                $("#typegermword").find("input").focus();

                $("#showTrans").attr("disabled", false);
                $("#showtranslation").text("");
            });
        });
    $("input").keypress(function (e) {
        if (e.which == 13) {
            showtranslation();
            //$('input[name = butAssignProd]').click();
        return false;  
        }
    });
    $("#showTrans").click(showtranslation);

    $("#showdlg").click(function(){
        $("input[name*='newtrans']").val(localStorage.translation);
        var dialog = document.getElementById('getnewword');  
        dialog.showModal();
        //$("getnewword").show();
    });
    $("#canceldlg").click(function(){
        var dialog = document.getElementById('getnewword');  
        dialog.close();
        //$("getnewword").show();
    });
    $("#posttodb").click(function(){
        var dialog = document.getElementById('getnewword');  
        dialog.close();
        dialog = document.getElementById('confirmdlg');
        $("#oldtransval").text(localStorage.translation);
        $("#newtransval").text($("input[name*='newtrans']").val());
        
        dialog.showModal();
        //$("getnewword").show();
    });
    $("#cancelpost").click(function(){
        var dialog = document.getElementById('confirmdlg');  
        dialog.close();
        //$("getnewword").show();
    });
    $("#confirmpost").click(function(){
        var dialog = document.getElementById('confirmdlg');  
        dialog.close();
        //$("getnewword").show();
    });
    $("#szlig").click(function(){
//        insertAtCursor($('input[name="trans"]')[0],'ß');
        var cursorPos = $('input[name="trans"]').prop('selectionStart');
        var v = $('input[name="trans"]').val();
        var textBefore = v.substring(0,  cursorPos);
        var textAfter  = v.substring(cursorPos, v.length);
        $('input[name="trans"]').val(textBefore + 'ß' + textAfter);
    });
    $("#uuml").click(function(){
//        insertAtCursor($('input[name="trans"]')[0],'ü');
        var cursorPos = $('input[name="trans"]').prop('selectionStart');
        var v = $('input[name="trans"]').val();
        var textBefore = v.substring(0,  cursorPos);
        var textAfter  = v.substring(cursorPos, v.length);
        $('input[name="trans"]').val(textBefore + 'ü' + textAfter);

    });
    $("#ouml").click(function(){
//        insertAtCursor($('input[name="trans"]')[0],'ö');
        var cursorPos = $('input[name="trans"]').prop('selectionStart');
        var v = $('input[name="trans"]').val();
        var textBefore = v.substring(0,  cursorPos);
        var textAfter  = v.substring(cursorPos, v.length);

        $('input[name="trans"]').val(textBefore + 'ö' + textAfter);

    });
    $("#auml").click(function(){
//        insertAtCursor($('input[name="trans"]')[0],'ä');
//        newtxt = $('input[name="trans"]').val()+'ä';
//        $('input[name="trans"]').val(newtxt);        
        var cursorPos = $('input[name="trans"]').prop('selectionStart');
        var v = $('input[name="trans"]').val();
        var textBefore = v.substring(0,  cursorPos);
        var textAfter  = v.substring(cursorPos, v.length);

        $('input[name="trans"]').val(textBefore + 'ä' + textAfter);
    });
    $("#lookupbab").click(function(){
        var url="http://en.bab.la/dictionary/german-english/";
        url += $('input[name="trans"]').val();
        window.open(url,'bab');
//        $("#ponsif").attr("src",url);
//        $("#showpons").html("<p><a href=\""+url+"\" target=\"iframe_a\"></a></p>");   
    });
    $("#lookuppons").click(function(){
        var url="http://de.pons.com/%C3%BCbersetzung?l=deen&q=";
        url += $('input[name="trans"]').val();
        $("#ponsif").attr("src",url);
        $("#showpons").html("<p><a href=\""+url+"\" target=\"iframe_a\"></a></p>");   
    });
    $("#lookupdict").click(function(){
        var url="http://www.dict.cc/?s=";
        url += $('input[name="trans"]').val();
        $("#ponsif").attr("src",url);
        $("#showpons").html("<p><a href=\""+url+"\" target=\"iframe_a\"></a></p>");
    });
    $("#lookupverbix").click(function(){
        var url="http://www.verbix.com/webverbix/German/";
        url += $('input[name="trans"]').val()+".html";
        $("#ponsif").attr("src",url);
        $("#showpons").html("<p><a href=\""+url+"\" target=\"iframe_a\"></a></p>");   
    });
    
    
});

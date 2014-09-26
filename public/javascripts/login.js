$(document).ready(function() {
    //var temp = getCookie("username");
    document.getElementById('active_user').innerHTML = getCookie("username"); 
    // Delete User link click
    //$('#tabelle').on('click', 'td a.linkdeletefahrt',  deleteFahrt);
    // Login User link click
    $('#loginform').on('click', '.linkloginuser',  loginUser);
    
    //$('#searchform').on('click', 'a.search',  startsearch);

});

/*function loginUser(username){
    event.preventDefault();
    
    user= document.getElementById('input_username').value;
    document.getElementById('active_user').innerHTML=user;
}*/
    

function setCookie(cname,cvalue,exdays){
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;
};

function getCookie(cname){
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) 
      {
      var c = ca[i].trim();
      if (c.indexOf(name)==0) return c.substring(name.length,c.length);
      }
    return "invalid_user";
};

function loginUser(){
    var user = document.getElementById('input_username').value;
    alert("Willkommen " + user);
    setCookie("username", user, 1);
    //location.reload();
};
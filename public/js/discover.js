var currentPicture = 1;
var pictures = ['1.jpg', '3.jpg', '4.jpg', '5.jpg'];
var src = 'images/dogs/';
var id = 'id_response';

function discover(val, form) {

    var responseElement = document.getElementById(id);
    responseElement.value = val;
    document.forms["discoverForm"].submit();

}


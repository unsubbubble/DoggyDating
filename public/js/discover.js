var currentPicture = 1;
var pictures = ['1.jpg', '3.jpg', '4.jpg', '5.jpg'];
var src = 'images/dogs/';
var id = 'id_discover_image';

function discover(){
    var imgElement = document.getElementById(id);
    imgElement.src = src + pictures[currentPicture];
    currentPicture = (currentPicture+1) % pictures.length;
}


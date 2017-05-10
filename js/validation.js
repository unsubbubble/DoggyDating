


function validateEmail(email){
    var success = true;
    var email_regex = /[^@]+[@][^@]+[.][^@]+$/;
    if(!email.value){
        email.className='text-input-error';
        try{
            document.getElementById(email.id+'_error').innerHTML = 'This field is required.';
        }
        catch(err){}
        success = false;

    }else if(!email_regex.test(email.value)){
        email.className='text-input-error';
        try{
            document.getElementById(email.id+'_error').innerHTML = 'Please enter a valid email address.';
        }
        catch(err){}
        success = false;
    } else{
        email.className='text-input';
        try{
            document.getElementById(email.id+'_error').innerHTML = '';
        }
        catch(err){}

    }
    return success;
}

function validatePassword(password){
    var success = true;
    if(!password.value){
        password.className='text-input-error';
        try{
            document.getElementById(password.id+'_error').innerHTML = 'This field is required.';
        }catch(err){}
        success = false;

    }else if(password.name == 'password2' && document.getElementById('id_pass1')
        && document.getElementById('id_pass1').value != password.value
    ){
        password.className = 'text-input-error';
        try{
            document.getElementById(password.id+'_error').innerHTML = 'Passwords must match.';
        }catch(err){}
        success = false;


    }else{
        password.className='text-input';
        try{
            document.getElementById(password.id+'_error').innerHTML = '';
        }catch(err){}

    }

    return success;
}

function validateText(text){
    if(text.value){
        text.className='text-input';
        try{
            document.getElementById(text.id + '_error').innerHTML = '';
        }catch(err){}

    }else{
        text.className='text-input-error';
        try{
            document.getElementById(text.id + '_error').innerHTML = 'This field is required.';
        }catch(err){}

    }

    return text.value;
}

function validateDate(date){
    if(date.value){
        try{
            document.getElementById(date.id + '_error').innerHTML = '';
        }catch(err){}

    }else{
        try{
            document.getElementById(date.id + '_error').innerHTML = 'This field is required.';
        }catch(err){}

    }

    return date.value;
}


function validateRadio(radio){
    var buttons = document.getElementsByName(radio.name);
    var valid = false;

    if(buttons){
        for(var j = 0; j < buttons.length; j++){
            if(buttons[j].checked){
                valid = true;
                break;
            }
        }
    }

    try{
        if(valid){

            document.getElementById('id_'+radio.name+'_error').innerHTML  = '';
        }else{
            document.getElementById('id_'+radio.name+'_error').innerHTML  = 'Please select one of the options.';
        }
    }
    catch(err){}

    return valid;

}


function validateNumber(number){
    var success = true;
    if(!number.value){
        number.className='text-input-error';
        try{
            document.getElementById(number.id+'_error').innerHTML = 'This field is required.';
        }catch(err){}
        success = false;

    }else{
        number.className='text-input';
        try{
            document.getElementById(number.id+'_error').innerHTML = '';
        }catch(err){}

    }

    return success;
}

function validateFile(file){
    var success = true;
    try{
        if(!file.value){
            document.getElementById(file.id+'_error').innerHTML = 'This field is required.';
            success = false;
        }else{
            document.getElementById(file.id+'_error').innerHTML = '';
        }
    }catch(err){}

    return success;
}

function validateElement(element){
    var success = true;
    if(element.type == 'text'){
        if(!validateText(element)) success = false;
    }
    else if(element.type == 'email'){
        if(!validateEmail(element)) success = false;
    }else if(element.type == 'password'){
        if(!validatePassword(element)) success = false;
    }else if(element.type == 'date'){
        if(!validateDate(element)) success = false;
    }else if(element.type == 'radio'){
        if(!validateRadio(element))success = false;
    }else if(element.type == 'file'){
        if(!validateFile(element)) success = false;
    }else if(element.type == 'number'){
        if(!validateNumber(element)) success = false;
    }

    return success
}


function validateForm(form){
    var elements =  form.getElementsByTagName("input");
    var success = true;
    for(var i=0; i < elements.length; i++){
        if(!validateElement(elements[i])) success=false;
    }
    return success;
}

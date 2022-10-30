function Validator(options) {

  var elementParent = function(){
    
  }

  var selectorRules = {}

  //Lấy ra form cần chỉnh sửa
  var formElement = document.querySelector(options.form);                                 


  function validate(inputElement, rule) {
    var errorMessage; 
    // lấy ra class để hiển thị lỗi
    var errorElement = inputElement.parentElement.querySelector(
      options.errorSlector
    );
    var rules = selectorRules[rule.selector]
    console.log(rules)


    // lặp qua từng lỗi nếu gặp lỗi thì thoát ra khỏi vòng lặp
    for(var i  = 0 ; i < rules.length; i++){
      errorMessage = rules[i](inputElement.value)
      if(errorMessage) break;
    }


    if (errorMessage) {
      errorElement.innerText = errorMessage;
      inputElement.parentElement.classList.add("valitor");
      inputElement.classList.add("validator-box");
    } else {
      errorElement.innerText = "";
      inputElement.parentElement.classList.remove("valitor");
      inputElement.classList.remove("validator-box");
    }
    return !!errorMessage;
  }

  console.log();
  if (formElement) {
      formElement.onsubmit = function(e){
        e.preventDefault();
        var isFormValid = false;
        options.rules.forEach(function (rule) {
          var inputElement = formElement.querySelector(rule.selector);
          var isValid = validate(inputElement, rule);
          if(!isValid){
            isFormValid = true;
          }
        })

        // var formEnableInput = formElement.querySelectorAll('[name] : not([disabled])');
        // console.log(formEnableInput)
        // console.log(options.onSubmit)
        
            
        if(isFormValid){
          //Trường hợp submit với javascript
          if(typeof options.onSubmit === 'function'){
            
            var  formEnableInputs = formElement.querySelectorAll('[name]:not([disabled])')

            var formValue = Array.from(formEnableInputs).reduce(function(values, input){
              return (values[input.name] = input.value) && values

            },{})

            options.onSubmit(formValue)
          }else{
            // Trường hợp submit với html
            formElement.submit();
          }
        }

      }




    options.rules.forEach(function (rule) {

      if(Array.isArray(selectorRules[rule.selector])){
        selectorRules[rule.selector].push(rule.test)

      }else{
        selectorRules[rule.selector] = [rule.test];

      }

      


      var inputElement = formElement.querySelector(rule.selector);
      console.log(rule.selector)
      ///
      if (inputElement) {
        // Xử lí người dùng blur ra ngoài

        inputElement.onblur = function () {
          validate(inputElement, rule);
        };

        //  xử lí người dùng nhập vào input

        inputElement.oninput = function () {
  
          var errorElement =
            inputElement.parentElement.querySelector(".form-message");
          errorElement.innerText = "";
          inputElement.parentElement.classList.remove("valitor");
          inputElement.classList.remove("validator-box");
        };
      }
    });
    
  }
}
// Định nghĩa rules
Validator.isRequired = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : "Vui lòng nhập trường này";
    },
  };
};
Validator.isEmail = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : " Vui lòng nhập lại email này";
    },
  };
};
Validator.minlength = function (selector, min, message) {
  return {
    selector: selector,
    test: function (value) {
      
      return value.length >= min ? undefined :message || `Vui lòng nhập tối thiểu ${min} kí tự`;
    },
  };
};
Validator.isConfirm = function (selector, getConfirmValue, message) {
  return {
    selector: selector,
    test: function (value) {
      
      return value === getConfirmValue() ? undefined : message || "Vui lòng nhập mật khẩu trùng với mật khẩu ở trên";
    },
  };
};
 


 

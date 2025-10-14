document.querySelector("#uploadicon").addEventListener("click", function(){
    document.querySelector('#uploadfile').click();
    uploadfile.addEventListener("change", () => uploadform.submit())
});
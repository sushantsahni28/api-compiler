var compile = document.getElementById("compile-btn")
var codeText = document.getElementById("text-area")
var langCode = document.getElementById("lang-code")
var outputText = document.getElementById("output-label")

compile.addEventListener("click",sendCode)
function sendCode(){
    outputText.innerHTML = "Compiling....."
    console.log(codeText.value.trim())
    console.log(langCode.value)

    var data = {code: String(codeText.value.trim()),
                langId: String(langCode.value)}
    var request = new XMLHttpRequest()

    request.open("POST","https://codequotient.com/api/executeCode")
    request.setRequestHeader("Content-type","application/json")

    request.send(JSON.stringify(data))

    request.addEventListener("load", () =>{
        var response = JSON.parse(request.responseText)

        if(response.hasOwnProperty('codeId')){
            getResponse(response.codeId)
        }else{
            console.log("Code is null")
        }
    })
}
function getResponse(codeId){
    let timer = setInterval(function(){
        var url = "https://codequotient.com/api/codeResult/"
        var compiledResp = new XMLHttpRequest()

        compiledResp.open("GET",url+codeId)
        compiledResp.send()

        compiledResp.onreadystatechange = function(){
            var res = JSON.parse(this.response)
            if(res.data !== '{"status":"Pending"}'){
                clearInterval(timer)
                createOutput(this.response);
            }
        }
    },2000)
} 
function createOutput(resp){
    var received = JSON.parse(resp)
    var againrec = JSON.parse(received.data)
    outputText.innerHTML = `${againrec.output} ${againrec.errors}`
}   


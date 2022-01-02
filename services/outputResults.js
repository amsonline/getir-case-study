module.exports = (results, errorCode, errorDescription) => {
    var output = {};
    if (errorCode) {
        output.code = errorCode;
        output.msg = errorDescription;
        output.records = [];
    }else{
        output.code = 0;
        output.msg = "Success";
        output.records = results;
    }

    return output;
}
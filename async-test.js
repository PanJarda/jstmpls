var a = 0;
var b = "ahoj";
var c = {
    ahoj: 1
};

setTimeout( function() {
    console.log("prvni:");
    console.log(a, b);
    console.log(c);
    a++;
    b += "fff";
    c.ahoj++;
},500)

setTimeout( function() {
    console.log("druha:");
    console.log(a++, b+="fff");
    console.log(c);
    c.ahoj +=1;
    function test() {
        console.log(a);
    }
    test();
},300)


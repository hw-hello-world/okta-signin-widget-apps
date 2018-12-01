// import 'babel-polyfill';

const f1 = async () => {
    const resp = await fetch('https://api.github.com/users');
    console.log(resp);

    return resp;
}

const a = 'c'.repeat(3);
const b = String.repeat('c', 3);

console.log(a);

console.log("foobar".includes("foo"));

const c = Object.assign({}, {a: 1}, {b: 2});

const d = Object.keys({c: 3});

f1();

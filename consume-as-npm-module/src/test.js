import 'babel-polyfill';

const f1 = async () => {
    const resp = await fetch('https://api.github.com/users');
    console.log(resp);

    return resp;
}

const a = '!!!'.repeat(3);

console.log(a);

f1();

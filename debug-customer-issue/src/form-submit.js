(function () {
    const baseUrl = 'http://www.example.com';

    const form = document.createElement('form');
    form.method = 'GET';
    form.action = baseUrl;

    var input1 = document.createElement('input');
    input1.name = 'stateToken';
    input1.type = 'hidden';
    input1.value = '1111';
    form.appendChild(input1);

    document.body.appendChild(form);
    form.submit();
})();

import OktaSignIn from '@okta/okta-signin-widget';

const signIn = new OktaSignIn({
    baseUrl: 'https://rain.okta1.com'
});

const handler = () => {
    console.log(arguments);
}

signIn.renderEl(
    {el: '#main-container'},
    handler,
    handler,
);

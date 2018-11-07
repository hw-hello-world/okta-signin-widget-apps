
function userLogin() {

  // * Get website base URL
  var siteUrl = window.location.origin;

  // * Create OktaSignIn instance with parameters

  var oktaSignIn = new OktaSignIn({

    baseUrl: 'https://hw.trexcloud.com',
    clientId: "abcaede",
    redirectUri: siteUrl + "/home-page-1",
    authParams: {
      issuer: 'https://hw.trexcloud.com',
      responseType: ['token', 'id_token'],
      display: 'page'
    },
    features: {
      //registration: true,                 // Enable self-service registration flow
      rememberMe: true,                   // Setting to false will remove the checkbox to save username
      //multiOptionalFactorEnroll: true,  // Allow users to enroll in multiple optional factors before finishing the authentication flow.
      selfServiceUnlock: true,          // Will enable unlock in addition to forgotten password
      smsRecovery: true,                // Enable SMS-based account recovery
      //callRecovery: true,               // Enable voice call-based account recovery
    }
  });

  oktaSignIn.on('pageRendered', function (data) {
    if (data.page === 'primary-auth' && !document.getElementById('captchaDiv')) {
      window.captchaVerified = false;
      window.captchaValidate = false;
      loadCAPTCHA();
    }
  });

  oktaSignIn.renderEl(
    { el: '#okta-login-container' },
    function success(response) {
    },

    function error(err) {
      console.error(err);
    }
  );

  /* Create the CAPTCHA container, which will be filled in from Google */
  let loadCAPTCHA = () => {
    const oktaId = document.getElementsByTagName('form')[0];
    oktaId.addEventListener('submit', (event) => { checkCaptcha(event) });
    const oktaLoginBtn = document.getElementById('okta-signin-submit');
    const captchaDiv = document.createElement('div');
    captchaDiv.setAttribute('id', 'captchaDiv');
    captchaDiv.className = 'g-recaptcha';
    captchaDiv.style.margin = 'auto';
    captchaDiv.style.width = '96%';
    captchaDiv.style.paddingBottom = '10px';
    captchaDiv.setAttribute('data-sitekey', 'abce');
    captchaDiv.setAttribute('data-callback', 'verifyCaptcha');
    oktaLoginBtn.before(captchaDiv);
    const htmlBody = document.getElementsByTagName('body')[0];
    const captchaScript = document.createElement('script');
    captchaScript.src = 'https://www.google.com/recaptcha/api.js';
    htmlBody.appendChild(captchaScript);
    lightenLoginBtn();
  };

  /* Grey out the login button to simulate a non-working button */
  let lightenLoginBtn = () => {
    const oktaLoginBtn = document.getElementById('okta-signin-submit');
    oktaLoginBtn.style.setProperty('background-color', '#FFBCAD', 'important');
    oktaLoginBtn.style.setProperty('border-color', '#FFBCAD', 'important');
    oktaLoginBtn.style.setProperty('cursor', 'not-allowed', 'important');
  };

  let darkenLoginBtn = () => {
    const oktaLoginBtn = document.getElementById('okta-signin-submit');
    oktaLoginBtn.removeAttribute('style');
  }

  /* Check if user has completed the CAPTCHA, otherwise add a warning message */
  let checkCaptcha = (event) => {
    if (window.captchaVerified) {
      return true;
    } else {
      event.preventDefault();
      if (window.captchaValidate === false) {
        const captchaDiv = document.getElementById('captchaDiv');
        const errorDiv = document.createElement('div');
        errorDiv.setAttribute('id', 'showError');
        captchaDiv.appendChild(errorDiv);
        errorDiv.innerHTML = '<span style="color:red;">You must click <span style="color:black">"I\'m not a robot"</span> checkbox</span>';
        window.captchaValidate = true;
      }
    }
  };

  /* Check if the CAPTCHA has been completed successfully before allowing the form to submit */
  let oktaFormSubmit = () => {
    if (window.captchaVerified) {
      let response = grecaptcha.getResponse();
      if (response.length > 0) {
        return true;
      } else {
        console.log(response.length);
      }
    }
  };

  /* Set an object to make sure CATPCHA has been verified */
  window.verifyCaptcha = () => {
    darkenLoginBtn();
    window.captchaVerified = true;
  };


}

/**
 * ---------------------------------------------------------------------------------------
 * Function:    a#signout.click
 * Description: Sign the user out of the current session and return them to the Login page
 * ---------------------------------------------------------------------------------------
 */

document.addEventListener('DOMContentLoaded', function(){

  // * Get website base URL
  var siteUrl = window.location.origin;

  userLogin();

}, false);

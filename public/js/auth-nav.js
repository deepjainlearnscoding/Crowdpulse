// auth-nav.js — CrowdPulse
// Swaps "Sign In / Get Started" for a "My Profile" pill if the user is signed in.
// Loaded as the LAST script on every page.

(function () {
  var isAuth = localStorage.getItem('crowdpulse_is_authenticated') === 'true';
  if (!isAuth) return;

  var navActions = document.querySelector('.nav-actions');
  if (!navActions) return;

  var storedName   = localStorage.getItem('crowdpulse_user_name') || '';
  var email        = localStorage.getItem('crowdpulse_remembered_email') || '';
  var derivedFirst = email.split('@')[0]
    .replace(/[._\-]/g, ' ')
    .replace(/\b\w/g, function (c) { return c.toUpperCase(); })
    .split(' ')[0];
  var firstName = storedName ? storedName.split(' ')[0] : (derivedFirst || 'Fan');
  var nameParts = (storedName || firstName).trim().split(' ');
  var initials  = nameParts.length >= 2
    ? nameParts[0][0] + nameParts[nameParts.length - 1][0]
    : firstName.slice(0, 2).toUpperCase();

  navActions.innerHTML =
    '<a href="profile.html" id="nav-profile-btn" ' +
      'style="display:inline-flex;align-items:center;gap:.55rem;' +
             'padding:.4rem .9rem .4rem .4rem;' +
             'background:rgba(79,142,247,.12);' +
             'border:1px solid rgba(79,142,247,.32);' +
             'border-radius:50px;color:#4f8ef7;' +
             'text-decoration:none;font-size:.85rem;font-weight:600;' +
             'transition:all .25s;white-space:nowrap;" ' +
      'onmouseover="this.style.background=\'rgba(79,142,247,.22)\';' +
                   'this.style.borderColor=\'rgba(79,142,247,.55)\';' +
                   'this.style.boxShadow=\'0 0 18px rgba(79,142,247,.22)\'" ' +
      'onmouseout="this.style.background=\'rgba(79,142,247,.12)\';' +
                  'this.style.borderColor=\'rgba(79,142,247,.32)\';' +
                  'this.style.boxShadow=\'none\'" ' +
    '>' +
      '<span style="width:26px;height:26px;border-radius:50%;' +
                   'background:linear-gradient(135deg,#6366f1,#06b6d4);' +
                   'display:inline-flex;align-items:center;justify-content:center;' +
                   'font-size:.68rem;font-weight:900;color:white;' +
                   'letter-spacing:-.01em;flex-shrink:0;">' +
        initials +
      '</span>' +
      ' ' + firstName +
    '</a>';
}());

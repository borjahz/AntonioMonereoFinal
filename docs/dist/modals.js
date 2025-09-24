"use strict";

document.addEventListener('DOMContentLoaded', function () {
  var sendMailBtn = document.getElementById('sendMailBtn');
  if (sendMailBtn) {
    sendMailBtn.addEventListener('click', function () {
      window.location.href = 'mailto:antoniomonelopez@gmail.com';
    });
  }
});


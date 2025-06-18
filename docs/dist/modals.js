"use strict";

document.addEventListener('DOMContentLoaded', function () {
  const aboutBtn = document.getElementById('aboutBtn');
  const contactBtn = document.getElementById('contactBtn');
  const aboutSection = document.getElementById('aboutSection');
  const contactSection = document.getElementById('contactSection');
  const closeAbout = document.getElementById('closeAbout');
  const closeContact = document.getElementById('closeContact');
  const sendMailBtn = document.getElementById('sendMailBtn');

  function showModal(modal, button) {
    modal.classList.remove('hidden');
    button.setAttribute('aria-expanded', 'true');
  }

  function hideModal(modal, button) {
    modal.classList.add('hidden');
    button.setAttribute('aria-expanded', 'false');
    button.focus();
  }

  aboutBtn.addEventListener('click', function (e) {
    e.preventDefault();
    showModal(aboutSection, aboutBtn);
    closeAbout.focus();
  });

  closeAbout.addEventListener('click', function () {
    hideModal(aboutSection, aboutBtn);
  });

  contactBtn.addEventListener('click', function (e) {
    e.preventDefault();
    showModal(contactSection, contactBtn);
    sendMailBtn.focus();
  });

  closeContact.addEventListener('click', function () {
    hideModal(contactSection, contactBtn);
  });

  sendMailBtn.addEventListener('click', function () {
    window.location.href = 'mailto:antoniomonelopez@gmail.com';
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (!aboutSection.classList.contains('hidden')) hideModal(aboutSection, aboutBtn);
      if (!contactSection.classList.contains('hidden')) hideModal(contactSection, contactBtn);
    }
  });
});

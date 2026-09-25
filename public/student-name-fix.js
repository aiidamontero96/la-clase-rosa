'use strict';
(() => {
  const students = window.ROSA?.students;
  if (!Array.isArray(students)) return;
  const index = students.findIndex(name => name === 'Mohammed');
  if (index !== -1) students[index] = 'Muhammed';
})();

//handler functions

function onsubmitHandler(e) {
  e.preventDefault();
  const student = serializedForm(this);

  const { isValid, errors } = Students.isValid(student);

  if (isValid) {
    Students.set(student);
    App.insertStudentInTable(student);
    App.updateRecordSummary(Students.getRecordSummary());

    clearFormFields(studentFormElement);

    const errorSectionElement = document.querySelector('.errors');
    if (errorSectionElement) errorSectionElement.remove();
  } else {
    App.showErrors(errors);
  }
}

//Elements
const studentFormElement = document.querySelector('form');
const clearBtnElement = document.querySelector('form input[type="button"]');
const studentsTable = document.querySelector('table');

//Listeners

studentFormElement.addEventListener('submit', onsubmitHandler);
clearBtnElement.addEventListener('click', () =>
  clearFormFields(studentFormElement)
);

//Listeners for the update and delete events

studentsTable.addEventListener('click', function (e) {
  if (e.target.parentElement.classList.contains('delete')) {
    if (Students.delete(e.target.closest('div').dataset.id)) {
      e.target.closest('tr').remove();
      App.updateRecordSummary(Students.getRecordSummary());
    }
  } else if (e.target.parentElement.classList.contains('update')) {
    const modalTemplate = document
      .querySelector('template.update-modal')
      .cloneNode(true);
    const modal = modalTemplate.content;

    const id = e.target.closest('div').dataset.id;
    App.openModalUpdate(modal, Students.getById(id), e.target.closest('tr'));
  }
});

App.init();

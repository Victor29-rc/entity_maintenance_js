class App {
  static init() {
    this.studentsContainerElement = document.querySelector(
      'table.students tbody'
    );

    let students = localStorage.getItem('students');

    if (students) {
      students = JSON.parse(students);

      Students.setList(students);

      for (const student of students) {
        this.insertStudentInTable(student);
      }
    } else {
      Students.setList([]);
    }

    this.updateRecordSummary(Students.getRecordSummary());
  }

  static insertStudentInTable = (student) => {
    const tr = document.createElement('tr');

    for (const key in student) {
      if (key !== 'id') {
        const td = document.createElement('td');
        td.textContent = student[key];

        tr.append(td);
      }
    }

    this.#insertActionButtons(tr, student.id);

    this.studentsContainerElement.append(tr);
  };

  static updateStudentInTable = (tr, student) => {
    console.log(student);
    tr.querySelector('div.actions').parentElement.remove(); //removing the actions buttons in the current tr

    tr.querySelector('td:nth-child(1)').textContent = student.name;
    tr.querySelector('td:nth-child(2)').textContent = student.lastName;
    tr.querySelector('td:nth-child(3)').textContent = student.record;

    this.#insertActionButtons(tr, student.id);
  };

  static #insertActionButtons(trElement, id = 0) {
    const td = document.createElement('td');
    const div = document.createElement('div');
    div.dataset.id = id;
    div.classList.add('actions');

    //update btn
    const spanUpdate = document.createElement('span');
    spanUpdate.classList.add('update');

    const iUpdate = document.createElement('i');
    iUpdate.classList.add('fa-solid', 'fa-pen-to-square');
    spanUpdate.append(iUpdate);

    //delete btn
    const spanDelete = document.createElement('span');
    spanDelete.classList.add('delete');

    const iDelete = document.createElement('i');
    iDelete.classList.add('fa-solid', 'fa-trash-can');
    spanDelete.append(iDelete);

    //appending the buttons to the div and div to the td and so on
    div.append(spanUpdate);
    div.append(spanDelete);
    td.append(div);

    trElement.append(td);
  }

  static updateRecordSummary(recordSummary) {
    document.querySelector('.summary strong').textContent = recordSummary;
  }

  static showErrors(errors, form = false) {
    let liErrors = '';

    errors.forEach((error) => (liErrors += `<li>${error}</li>`));

    const errorsHtml = `
        <div class='errors'>
          <i class="fa-solid fa-xmark"></i>
          <ul>
            ${liErrors}
          <ul>
        </div>
      `;

    let formElement = document.querySelector('form');

    if (form) {
      formElement = form;
    }

    const errorElement = formElement.querySelector('.errors');

    if (errorElement) {
      errorElement.remove();
    }

    formElement.insertAdjacentHTML('afterbegin', errorsHtml);
    document
      .querySelector('div.errors i')
      .addEventListener('click', function () {
        this.closest('.errors').remove();
      });
  }

  static openModalUpdate(modal, student, currentRow) {
    const studentFormModalElement = modal;
    const studentForm = studentFormModalElement.querySelector('.update-form');
    const hiddenInputElement = document.createElement('input');

    hiddenInputElement.id = 'id';
    hiddenInputElement.name = 'id';
    hiddenInputElement.type = 'hidden';
    hiddenInputElement.value = student.id;

    studentFormModalElement
      .querySelector('.update-form')
      .insertAdjacentElement('afterbegin', hiddenInputElement);

    studentFormModalElement.querySelector('.update-form input#name').value =
      student.name;

    studentFormModalElement.querySelector(
      '.update-form input#last_name'
    ).value = student.lastName;

    studentFormModalElement.querySelector('.update-form input#record').value =
      student.record;

    studentFormModalElement
      .querySelector('.modal-header span')
      .addEventListener('click', function () {
        this.closest('.modal-container').nextElementSibling.remove();
        this.closest('.modal-container').remove();
      });

    studentFormModalElement
      .querySelector('.update-form')
      .addEventListener('submit', function (e) {
        e.preventDefault();
        const studentUpdated = serializedForm(this);

        const { isValid, errors } = Students.isValid(studentUpdated);

        if (isValid) {
          studentUpdated.id = student.id;

          if (Students.update(studentUpdated)) {
            App.updateStudentInTable(currentRow, studentUpdated);
            App.updateRecordSummary(Students.getRecordSummary());
          }

          this.closest('.modal-container')
            .querySelector('.modal-header span')
            .click();
        } else {
          App.showErrors(errors, studentForm);
        }
      });

    studentFormModalElement
      .querySelector('.update-form .actions input[type="button"]')
      .addEventListener('click', function (e) {
        clearFormFields(studentForm);
      });

    document.body.after(studentFormModalElement);
  }
}

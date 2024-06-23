class Students {
  static setList(list) {
    this.list = list;

    this.quantity = list.length;
    this.totalRecords = 0;

    list.forEach((student) => {
      this.totalRecords += parseFloat(student.record);
    });
  }

  static set(student) {
    student.id = 'id_' + new Date().getTime();
    this.list.push(student);
    localStorage.setItem('students', JSON.stringify(this.list));

    this.quantity++;
    this.totalRecords += parseFloat(student.record);
  }

  static update(student) {
    let itemUpdated = false;
    this.list.map((value, index) => {
      if (value.id == student.id) {
        this.list.splice(index, 1, student);
        this.totalRecords -= parseFloat(value.record);
        this.totalRecords += parseFloat(student.record);

        itemUpdated = true;
        localStorage.setItem('students', JSON.stringify(this.list));
      }
    });

    return itemUpdated;
  }

  static delete(id) {
    let itemDeleted = false;
    this.list.map((student, index) => {
      if (student.id == id) {
        this.list.splice(index, 1);
        this.quantity--;
        this.totalRecords -= parseFloat(student.record);

        itemDeleted = true;
        localStorage.setItem('students', JSON.stringify(this.list));
      }
    });

    return itemDeleted;
  }

  static getList() {
    return this.list;
  }

  static isValid({ name, lastName, record }) {
    const { isValid: nameIsValid, errors: nameErrors } = validate(
      name,
      'name',
      'required'
    );
    const { isValid: lastNameIsValid, errors: lastNameErrors } = validate(
      lastName,
      'last name',
      'required'
    );
    const { isValid: recordIsValid, errors: recordErrors } = validate(
      record,
      'record',
      'natural_number'
    );

    return {
      isValid: nameIsValid && lastNameIsValid && recordIsValid,
      errors: nameErrors.concat(lastNameErrors).concat(recordErrors),
    };
  }

  static getRecordSummary() {
    if (this.quantity > 0) {
      this.recordSummary = this.totalRecords / this.quantity;
    } else {
      this.recordSummary = 0;
    }

    return this.recordSummary.toFixed(2);
  }

  static getById(id) {
    return this.list.filter((student) => {
      return student.id == id;
    })[0];
  }
}

const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const credentials = require("../../credentials.json");

const docId = "1ae4KdKDYDdvLfeBs28bLqC21M5tQ-hIM1QAz9SYyHkQ";
const doc = new GoogleSpreadsheet(docId);

module.exports = {
  async listAll(req, res) {
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();

    let list = [];

    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    let headers = rows[0]._sheet.headerValues;

    for (let index = 0; index < rows.length; index++) {
      const element = rows[index];

      list.push({
        id: element[headers[0]],
        full_name: element[headers[1]],
        first_name: element[headers[2]],
        last_name: element[headers[3]],
        email: element[headers[4]],
        created_at: element[headers[5]],
      });
    }

    res.status(200).json(list);
  },
  async update(req, res) {
    const { id } = req.params;
    const { full_name, email } = req.body;
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    let headers = rows[0]._sheet.headerValues;

    let first_name = "",
      last_name = "";

    if (full_name.split(" ")[1] !== undefined) {
      first_name = full_name.split(" ")[0];
      last_name = full_name.split(" ")[1];
    } else {
      return res.status(400).json({ message: "Please, insert full name" });
    }

    for (let index = 0; index < rows.length; index++) {
      const element = rows[index];
      let id_sheet = element.ID;

      if (id_sheet === id) {
        rows[index].FullName = full_name;
        rows[index][headers[2]] = first_name;
        rows[index][headers[3]] = last_name;
        rows[index].Email = email;
        rows[index].save();
      }
    }

    res.status(200).json({ message: "Success" });
  },
  async insert(req, res) {
    const { full_name, email } = req.body;
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();

    let first_name = "",
      last_name = "";

    if (full_name.split(" ")[1] !== undefined) {
      first_name = full_name.split(" ")[0];
      last_name = full_name.split(" ")[1];
    } else {
      return res.status(400).json({ message: "Please, insert full name" });
    }

    const sheet = doc.sheetsByIndex[0];
    await sheet.addRow({
      ID: uuidv4(),
      FullName: full_name,
      "First Name": first_name,
      "Last Name": last_name,
      Email: email,
      "Created At": moment().format("DD/MM/YYYY HH:mm:ss"),
    });

    res.status(200).json({ message: "Success" });
  },
};
